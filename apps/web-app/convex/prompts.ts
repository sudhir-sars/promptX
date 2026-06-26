import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { authedMutation, authedQuery } from "./lib/auth";
import { cascadeDeletePrompt } from "./lib/cascade";
import { notFound } from "./lib/errors";
import { requirePromptAccess } from "./lib/permissions";
import { createPromptWithDefault } from "./lib/prompts";

export const createPrompt = authedMutation({
	args: {
		teamId: v.id("teams"),
		name: v.string(),
	},

	handler: (ctx, { teamId, name }) => createPromptWithDefault(ctx, teamId, name),
});

export const getPrompt = authedQuery({
	args: {
		promptId: v.id("prompts"),
	},

	handler: async (ctx, { promptId }) => {
		const { prompt } = await requirePromptAccess(ctx, promptId);

		return prompt;
	},
});

export const listPrompts = authedQuery({
	args: {
		teamId: v.id("teams"),
		paginationOpts: paginationOptsValidator,
	},

	handler: async (ctx, { teamId, paginationOpts }) => {
		return ctx.db
			.query("prompts")
			.withIndex("by_team", (q) => q.eq("teamId", teamId))
			.paginate(paginationOpts);
	},
});

export const updatePrompt = authedMutation({
	args: {
		promptId: v.id("prompts"),
		name: v.string(),
	},

	handler: async (ctx, { promptId, name }) => {
		await requirePromptAccess(ctx, promptId);

		await ctx.db.patch(promptId, {
			name,
		});
	},
});

export const deletePrompt = authedMutation({
	args: {
		promptId: v.id("prompts"),
	},

	handler: async (ctx, { promptId }) => {
		const { prompt } = await requirePromptAccess(ctx, promptId);

		await cascadeDeletePrompt(ctx, prompt._id);
	},
});

export const _getPrompt = internalQuery({
	args: {
		promptId: v.id("prompts"),
	},

	handler: async (ctx, { promptId }) => {
		const prompt = await ctx.db.get(promptId);
		if (!prompt) notFound("Prompt");

		return prompt;
	},
});
