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
