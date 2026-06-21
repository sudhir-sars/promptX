import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

/**
 * Public mutation — runs for anonymous visitors (consent happens before sign-in).
 * If the visitor is authenticated we attach their user id for traceability.
 */
export const logConsent = mutation({
	args: {
		visitorId: v.string(),
		analytics: v.boolean(),
		policyVersion: v.number(),
		source: v.string(),
		userAgent: v.optional(v.string()),
	},

	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		const userId = (identity?.["userId"] as Id<"users"> | undefined) ?? undefined;

		await ctx.db.insert("consentRecords", {
			visitorId: args.visitorId,
			userId,
			necessary: true,
			analytics: args.analytics,
			policyVersion: args.policyVersion,
			source: args.source,
			userAgent: args.userAgent,
			createdAt: Date.now(),
		});
	},
});
