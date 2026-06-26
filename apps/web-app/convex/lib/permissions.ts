import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

import { forbidden, notFound } from "./errors";

export type OwnershipCtx = {
	db: QueryCtx["db"] | MutationCtx["db"];
	userId: Id<"users">;
};

export async function requireTeamMembership(ctx: OwnershipCtx, teamId: Id<"teams">) {
	const membership = await ctx.db
		.query("members")
		.withIndex("by_team_user", (q) => q.eq("teamId", teamId).eq("userId", ctx.userId))
		.unique();

	if (!membership) forbidden();

	return { membership };
}

export async function requirePromptAccess(ctx: OwnershipCtx, promptId: Id<"prompts">) {
	const prompt = await ctx.db.get(promptId);

	if (!prompt) notFound("Prompt");

	const membership = await requireTeamMembership(ctx, prompt.teamId);

	return { prompt, membership };
}

export async function requireVersionAccess(ctx: OwnershipCtx, versionId: Id<"versions">) {
	const version = await ctx.db.get(versionId);

	if (!version) notFound("Version");

	const membership = await requireTeamMembership(ctx, version.teamId);

	return { version, membership };
}

export async function requireDeploymentAccess(ctx: OwnershipCtx, deploymentId: Id<"deployments">) {
	const deployment = await ctx.db.get(deploymentId);

	if (!deployment) notFound("Deployment");

	const membership = await requireTeamMembership(ctx, deployment.teamId);

	return { deployment, membership };
}

// ---------------------------------------------------------------------------
// Team-scoped access (API-key / management REST API). The actor is a team API
// key rather than a signed-in user, so authorization is "does this resource
// belong to the key's team?" — no `members` lookup, just a team-id match.
// ---------------------------------------------------------------------------

export async function requireTeamPrompt(ctx: Pick<OwnershipCtx, "db">, promptId: Id<"prompts">, teamId: Id<"teams">) {
	const prompt = await ctx.db.get(promptId);

	if (!prompt) notFound("Prompt");
	if (prompt.teamId !== teamId) forbidden();

	return prompt;
}

export async function requireTeamVersion(
	ctx: Pick<OwnershipCtx, "db">,
	versionId: Id<"versions">,
	teamId: Id<"teams">,
) {
	const version = await ctx.db.get(versionId);

	if (!version) notFound("Version");
	if (version.teamId !== teamId) forbidden();

	return version;
}

export async function requireTeamDeployment(
	ctx: Pick<OwnershipCtx, "db">,
	deploymentId: Id<"deployments">,
	teamId: Id<"teams">,
) {
	const deployment = await ctx.db.get(deploymentId);

	if (!deployment) notFound("Deployment");
	if (deployment.teamId !== teamId) forbidden();

	return deployment;
}

export async function requireTeamAdmin(ctx: OwnershipCtx, teamId: Id<"teams">) {
	const { membership } = await requireTeamMembership(ctx, teamId);

	if (membership.role !== "owner" && membership.role !== "admin") {
		forbidden();
	}

	return { membership };
}

export async function requireTeamOwner(ctx: OwnershipCtx, teamId: Id<"teams">) {
	const { membership } = await requireTeamMembership(ctx, teamId);

	if (membership.role !== "owner") {
		forbidden();
	}

	return { membership };
}
