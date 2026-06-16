// convex/auditLogs.ts

import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { authedQuery } from "./lib/auth";
import { requireTeamMembership } from "./lib/permissions";

export const listAuditLogs = authedQuery({
	args: {
		teamId: v.id("teams"),
		paginationOpts: paginationOptsValidator,
	},

	handler: async (ctx, { teamId, paginationOpts }) => {
		await requireTeamMembership(ctx, teamId);

		return await ctx.db
			.query("auditLogs")
			.withIndex("by_team", (q) => q.eq("teamId", teamId))
			.order("desc")
			.paginate(paginationOpts);
	},
});
