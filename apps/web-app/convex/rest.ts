import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx } from "./_generated/server";
import { cascadeDeletePrompt } from "./lib/cascade";
import { createDefaultVersion } from "./lib/defaults";
import { validateAndPrepareDeploymentConfig } from "./lib/deployments";
import { badRequest, invariant, notFound } from "./lib/errors";
import { type OwnershipCtx, requireTeamDeployment, requireTeamPrompt, requireTeamVersion } from "./lib/permissions";
import { createDeployConfig, type DeployPromptVersionResult, type RollbackDeploymentResult } from "./types";

/**
 * Team-scoped backend for the platform REST API (`convex/http/rest.ts`).
 *
 * These mirror the dashboard's prompt/version/deployment operations but are
 * authorized by a team id (resolved from an API key by the HTTP layer) instead of
 * a signed-in user, so they're `internal*` and never exposed to the Convex
 * client. Shared logic (`validateAndPrepareDeploymentConfig`, `createDefaultVersion`,
 * `cascadeDeletePrompt`) is reused so the two surfaces can't drift.
 */

const DEFAULT_LIMIT = 100;

/** Reject a tag that is reserved or already taken by another version of the prompt. */
async function assertTagFree(ctx: MutationCtx, promptId: Id<"prompts">, tag: string) {
	invariant(tag.toLowerCase() !== "draft", '"draft" is a reserved tag');

	const existing = await ctx.db
		.query("versions")
		.withIndex("by_prompt_tag", (q) => q.eq("promptId", promptId).eq("tag", tag))
		.unique();

	invariant(!existing, `Tag "${tag}" is already used by v${existing?.sequence}`);
}

/**
 * Resolve a version that lives under a specific prompt (the REST hierarchy). A
 * version of another prompt 404s, so `/prompts/:a/versions/:v` can't reach a
 * version of prompt `b` even within the same team.
 */
async function requireVersionInPrompt(
	ctx: Pick<OwnershipCtx, "db">,
	promptId: Id<"prompts">,
	versionId: Id<"versions">,
	teamId: Id<"teams">,
) {
	const version = await requireTeamVersion(ctx, versionId, teamId);
	if (version.promptId !== promptId) notFound("Version");
	return version;
}

/** Resolve a deployment that lives under a specific prompt (the REST hierarchy). */
async function requireDeploymentInPrompt(
	ctx: Pick<OwnershipCtx, "db">,
	promptId: Id<"prompts">,
	deploymentId: Id<"deployments">,
	teamId: Id<"teams">,
) {
	const deployment = await requireTeamDeployment(ctx, deploymentId, teamId);
	if (deployment.promptId !== promptId) notFound("Deployment");
	return deployment;
}

// --- Prompts ---------------------------------------------------------------

export const createPrompt = internalMutation({
	args: { teamId: v.id("teams"), name: v.string() },
	handler: async (ctx, { teamId, name }) => {
		const promptId = await ctx.db.insert("prompts", {
			teamId,
			name,
			slug: name.toLowerCase().replace(/ /g, "-"),
		});

		await createDefaultVersion(ctx, teamId, promptId);

		return ctx.db.get(promptId);
	},
});

export const listPrompts = internalQuery({
	args: { teamId: v.id("teams") },
	handler: (ctx, { teamId }) =>
		ctx.db
			.query("prompts")
			.withIndex("by_team", (q) => q.eq("teamId", teamId))
			.order("desc")
			.take(DEFAULT_LIMIT),
});

export const getPrompt = internalQuery({
	args: { teamId: v.id("teams"), promptId: v.id("prompts") },
	handler: (ctx, { teamId, promptId }) => requireTeamPrompt(ctx, promptId, teamId),
});

export const updatePrompt = internalMutation({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), name: v.string() },
	handler: async (ctx, { teamId, promptId, name }) => {
		await requireTeamPrompt(ctx, promptId, teamId);
		await ctx.db.patch(promptId, { name });
		return ctx.db.get(promptId);
	},
});

export const deletePrompt = internalMutation({
	args: { teamId: v.id("teams"), promptId: v.id("prompts") },
	handler: async (ctx, { teamId, promptId }) => {
		await requireTeamPrompt(ctx, promptId, teamId);
		await cascadeDeletePrompt(ctx, promptId);
	},
});

// --- Versions --------------------------------------------------------------

export const listVersions = internalQuery({
	args: { teamId: v.id("teams"), promptId: v.id("prompts") },
	handler: async (ctx, { teamId, promptId }) => {
		await requireTeamPrompt(ctx, promptId, teamId);
		return ctx.db
			.query("versions")
			.withIndex("by_prompt", (q) => q.eq("promptId", promptId))
			.order("desc")
			.take(DEFAULT_LIMIT);
	},
});

/**
 * Cut a new immutable version: promote the live draft to a published version
 * (optionally tagged), then open a fresh draft above it — same lifecycle as the
 * dashboard's "save version".
 */
export const createVersion = internalMutation({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), content: v.string(), tag: v.optional(v.string()) },
	handler: async (ctx, { teamId, promptId, content, tag }) => {
		await requireTeamPrompt(ctx, promptId, teamId);

		const now = Date.now();
		const trimmedTag = tag?.trim();

		if (trimmedTag) await assertTagFree(ctx, promptId, trimmedTag);

		const draft = await ctx.db
			.query("versions")
			.withIndex("by_prompt_draft", (q) => q.eq("promptId", promptId).eq("draft", true))
			.unique();

		invariant(draft, "No draft found");

		await ctx.db.patch(draft._id, {
			draft: false,
			content,
			updatedAt: now,
			...(trimmedTag ? { tag: trimmedTag } : {}),
		});

		await ctx.db.insert("versions", {
			teamId,
			promptId,
			tag: "draft",
			sequence: draft.sequence + 1,
			draft: true,
			content,
			updatedAt: now,
		});

		return ctx.db.get(draft._id);
	},
});

export const getVersion = internalQuery({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), versionId: v.id("versions") },
	handler: (ctx, { teamId, promptId, versionId }) => requireVersionInPrompt(ctx, promptId, versionId, teamId),
});

/**
 * Edit a version. Drafts accept new `content` and/or `tag`; published versions
 * accept only a `tag` change (their content is immutable, as in the dashboard).
 */
export const updateVersion = internalMutation({
	args: {
		teamId: v.id("teams"),
		promptId: v.id("prompts"),
		versionId: v.id("versions"),
		content: v.optional(v.string()),
		tag: v.optional(v.string()),
	},
	handler: async (ctx, { teamId, promptId, versionId, content, tag }) => {
		const version = await requireVersionInPrompt(ctx, promptId, versionId, teamId);
		const trimmedTag = tag?.trim();

		if (!version.draft && content !== undefined) badRequest("Only draft versions can change content");

		if (trimmedTag) await assertTagFree(ctx, version.promptId, trimmedTag);

		await ctx.db.patch(versionId, {
			...(content !== undefined ? { content } : {}),
			...(tag !== undefined ? { tag: trimmedTag || undefined } : {}),
			updatedAt: Date.now(),
		});

		return ctx.db.get(versionId);
	},
});

// --- Deployments -----------------------------------------------------------

export const listDeployments = internalQuery({
	args: { teamId: v.id("teams"), promptId: v.id("prompts") },
	handler: async (ctx, { teamId, promptId }) => {
		await requireTeamPrompt(ctx, promptId, teamId);
		return ctx.db
			.query("deployments")
			.withIndex("by_prompt", (q) => q.eq("promptId", promptId))
			.order("desc")
			.take(DEFAULT_LIMIT);
	},
});

export const getDeployment = internalQuery({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), deploymentId: v.id("deployments") },
	handler: (ctx, { teamId, promptId, deploymentId }) => requireDeploymentInPrompt(ctx, promptId, deploymentId, teamId),
});

/** Release a deployment for a prompt, retiring whichever deployment was active. */
export const deployPromptVersion = internalMutation({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), config: createDeployConfig },
	handler: async (ctx, { teamId, promptId, config }) => {
		const prompt = await requireTeamPrompt(ctx, promptId, teamId);

		const { deploymentConfig, kvPayload } = await validateAndPrepareDeploymentConfig(ctx, prompt, config);

		const active = await ctx.db
			.query("deployments")
			.withIndex("by_prompt_active", (q) => q.eq("promptId", promptId).eq("active", true))
			.unique();

		if (active) await ctx.db.patch(active._id, { active: false });

		const deploymentId = await ctx.db.insert("deployments", {
			teamId,
			promptId,
			config: deploymentConfig,
			active: true,
		});

		const deployment = await ctx.db.get(deploymentId);
		invariant(deployment, "Deployment not found");

		const result: DeployPromptVersionResult = { deployment, kvPayload };
		return result;
	},
});

/**
 * Roll back to a previous deployment by re-releasing its config as a new active
 * deployment. `deploymentId` is the deployment to restore; the prompt's current
 * active deployment is resolved server-side and retired.
 */
export const rollbackDeployment = internalMutation({
	args: { teamId: v.id("teams"), promptId: v.id("prompts"), deploymentId: v.id("deployments") },
	handler: async (ctx, { teamId, promptId, deploymentId }) => {
		const target = await requireDeploymentInPrompt(ctx, promptId, deploymentId, teamId);

		const current = await ctx.db
			.query("deployments")
			.withIndex("by_prompt_active", (q) => q.eq("promptId", promptId).eq("active", true))
			.unique();

		invariant(current, "No active deployment to roll back from");

		const prompt = await ctx.db.get(promptId);
		invariant(prompt, "Prompt not found");

		const { kvPayload } = await validateAndPrepareDeploymentConfig(ctx, prompt, target.config);

		await ctx.db.patch(current._id, { active: false });

		const rollbackId = await ctx.db.insert("deployments", {
			teamId,
			promptId,
			config: target.config,
			active: true,
			rolledBackTo: target._id,
		});

		const newDeployment = await ctx.db.get(rollbackId);
		invariant(newDeployment, "Rollback deployment not found");

		const result: RollbackDeploymentResult = { newDeployment, prevDeployment: current, kvPayload };
		return result;
	},
});
