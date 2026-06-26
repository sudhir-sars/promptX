import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { authedQuery } from "./lib/auth";
import { releaseDeployment, rollbackToDeployment } from "./lib/deployments";
import { invariant } from "./lib/errors";
import { requireDeploymentAccess, requirePromptAccess } from "./lib/permissions";
import { createDeployConfig } from "./types";

export const listDeployments = authedQuery({
	args: {
		promptId: v.id("prompts"),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, { promptId, paginationOpts }) => {
		await requirePromptAccess(ctx, promptId);
		return ctx.db
			.query("deployments")
			.withIndex("by_prompt", (q) => q.eq("promptId", promptId))
			.order("desc")
			.paginate(paginationOpts);
	},
});

export const _deployPromptVersionDb = internalMutation({
	args: {
		promptId: v.id("prompts"),
		config: createDeployConfig,
		userId: v.id("users"),
	},
	handler: async (ctx, { promptId, config, userId }) => {
		const { prompt } = await requirePromptAccess({ ...ctx, userId }, promptId);

		return releaseDeployment(ctx, prompt, config);
	},
});

export const _rollbackDeploymentDb = internalMutation({
	args: {
		rollbackTo: v.id("deployments"),
		currentDeploymentId: v.id("deployments"),
		userId: v.id("users"),
	},
	handler: async (ctx, { rollbackTo, userId, currentDeploymentId }) => {
		const authedCtx = { ...ctx, userId };

		const { deployment: target } = await requireDeploymentAccess(authedCtx, rollbackTo);
		const { deployment: current } = await requireDeploymentAccess(authedCtx, currentDeploymentId);

		invariant(current.active, "Current deployment must be active");
		invariant(current.promptId === target.promptId, "Deployments must belong to same prompt");

		const prompt = await ctx.db.get(target.promptId);
		invariant(prompt, "Prompt not found");

		return rollbackToDeployment(ctx, prompt, target);
	},
});
