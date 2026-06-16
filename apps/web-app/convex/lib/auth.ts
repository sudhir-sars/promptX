import { customAction, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import type { Id } from "../_generated/dataModel";
import { type ActionCtx, action, type MutationCtx, mutation, type QueryCtx, query } from "../_generated/server";
import { unauthorized } from "./errors";

async function getIdentity(ctx: QueryCtx | MutationCtx | ActionCtx) {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity?.["userId"] || !identity["clerkUserId"] || !identity.email || !identity.name || !identity["avatar"])
		unauthorized();

	return {
		userId: identity["userId"] as Id<"users">,
		clerkUserId: identity["clerkUserId"] as string,
		email: identity.email as string,
		name: identity.name as string,
		avatar: identity["avatar"] as string,
	};
}

export const authedQuery = customQuery(query, {
	args: {},

	input: async (ctx) => {
		const identity = await getIdentity(ctx);

		return {
			ctx: {
				...ctx,
				...identity,
			},
			args: {},
		};
	},
});

export const authedMutation = customMutation(mutation, {
	args: {},

	input: async (ctx) => {
		const identity = await getIdentity(ctx);

		return {
			ctx: {
				...ctx,
				...identity,
			},
			args: {},
		};
	},
});

export const authedAction = customAction(action, {
	args: {},

	input: async (ctx) => {
		const identity = await getIdentity(ctx);

		return {
			ctx: {
				...ctx,
				...identity,
			},
			args: {},
		};
	},
});
