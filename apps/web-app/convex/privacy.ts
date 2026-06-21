import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalQuery } from "./_generated/server";
import { authedAction } from "./lib/auth";

/** Gathers a complete copy of a user's personal data. API-key secrets excluded. */
export const collectUserData = internalQuery({
	args: { userId: v.id("users") },

	handler: async (ctx, { userId }) => {
		const user = await ctx.db.get(userId);

		const ownedTeams = await ctx.db
			.query("teams")
			.withIndex("by_owner", (q) => q.eq("ownerId", userId))
			.collect();

		const memberships = await ctx.db
			.query("members")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		const consentRecords = await ctx.db
			.query("consentRecords")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		const teams = [];
		for (const team of ownedTeams) {
			const prompts = await ctx.db
				.query("prompts")
				.withIndex("by_team", (q) => q.eq("teamId", team._id))
				.collect();

			const versions = await ctx.db
				.query("versions")
				.withIndex("by_team", (q) => q.eq("teamId", team._id))
				.collect();

			const deployments = await ctx.db
				.query("deployments")
				.withIndex("by_team", (q) => q.eq("teamId", team._id))
				.collect();

			const apiKeys = await ctx.db
				.query("apiKeys")
				.withIndex("by_team", (q) => q.eq("teamId", team._id))
				.collect();

			teams.push({
				team,
				prompts,
				versions,
				deployments,
				apiKeys: apiKeys.map((k) => ({
					_id: k._id,
					name: k.name,
					prefix: k.prefix,
					revokedAt: k.revokedAt,
					_creationTime: k._creationTime,
				})),
			});
		}

		return { exportedAt: Date.now(), user, memberships, ownedTeams: teams, consentRecords };
	},
});

/**
 * Right to data portability (GDPR Art. 20 / equivalent). Runs as an action so it
 * has the resources to assemble a full export, delegating reads to an internal query.
 */
export const exportMyData = authedAction({
	args: {},

	handler: async (ctx): Promise<unknown> => {
		return await ctx.runQuery(internal.privacy.collectUserData, { userId: ctx.userId });
	},
});
