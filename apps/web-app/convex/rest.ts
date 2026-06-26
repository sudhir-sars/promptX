import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";
import { cascadeDeletePrompt } from "./lib/cascade";
import { releaseDeployment, rollbackToDeployment } from "./lib/deployments";
import { badRequest, notFound } from "./lib/errors";
import { type OwnershipCtx, requireTeamDeployment, requireTeamPrompt, requireTeamVersion } from "./lib/permissions";
import { createPromptWithDefault } from "./lib/prompts";
import { assertTagAvailable, cutVersion } from "./lib/versions";
import { createDeployConfig } from "./types";

/**
 * Team-scoped backend for the platform REST API (`convex/http/rest.ts`).
 *
 * These are thin wrappers: they authorize the actor by team id (resolved from an
 * API key by the HTTP layer, rather than a signed-in user) and then call the same
 * `lib/` operation cores the dashboard uses (`createPromptWithDefault`,
 * `cutVersion`, `releaseDeployment`, `rollbackToDeployment`, …), so the two
 * surfaces can't drift. They're `internal*` and never exposed to the Convex client.
 */

const DEFAULT_LIMIT = 100;

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
	handler: (ctx, { teamId, name }) => createPromptWithDefault(ctx, teamId, name),
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
		const prompt = await requireTeamPrompt(ctx, promptId, teamId);
		const { published } = await cutVersion(ctx, prompt, content, tag);
		return published;
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

		if (trimmedTag) await assertTagAvailable(ctx, version.promptId, trimmedTag);

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
		return releaseDeployment(ctx, prompt, config);
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
		const prompt = await requireTeamPrompt(ctx, promptId, teamId);
		return rollbackToDeployment(ctx, prompt, target);
	},
});
