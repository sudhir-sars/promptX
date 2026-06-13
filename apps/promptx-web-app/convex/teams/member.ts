import { v } from "convex/values";

import { authedMutation, authedQuery } from "../lib/auth";

import { badRequest, invariant, notFound } from "../lib/errors";

import { requireTeamMembership, requireTeamAdmin, requireTeamOwner } from "../lib/permissions";
import { paginationOptsValidator } from "convex/server";

export const listMembers = authedQuery({
    args: {
        teamId: v.id("teams"),
        paginationOpts: paginationOptsValidator,
    },

    handler: async (ctx, { teamId, paginationOpts }) => {
        await requireTeamMembership(ctx, teamId);
        return await ctx.db
            .query("members")
            .withIndex("by_team", (q) => q.eq("teamId", teamId))
            .order("desc")
            .paginate(paginationOpts);
    },
});

export const updateMemberRole = authedMutation({
    args: {
        teamId: v.id("teams"),
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("member")),
    },

    handler: async (ctx, { teamId, userId, role }) => {
        await requireTeamAdmin(ctx, teamId);

        const targetMember = await ctx.db
            .query("members")
            .withIndex("by_team_user", (q) => q.eq("teamId", teamId).eq("userId", userId))
            .unique();

        if (!targetMember) notFound("Membership");

        if (targetMember.role === "owner") badRequest("Owner role cannot be modified");

        await ctx.db.patch(targetMember._id, {
            role,
        });

        return targetMember._id;
    },
});

export const removeMember = authedMutation({
    args: {
        teamId: v.id("teams"),
        userId: v.id("users"),
    },

    handler: async (ctx, { teamId, userId }) => {
        const { membership: actingMembership } = await requireTeamAdmin(ctx, teamId);

        const targetMembership = await ctx.db
            .query("members")
            .withIndex("by_team_user", (q) => q.eq("teamId", teamId).eq("userId", userId))
            .unique();

        if (!targetMembership) notFound("Membership");

        if (targetMembership.role === "owner") badRequest("Owner cannot be removed");

        if (userId === ctx.userId) badRequest("Use leaveTeam instead");

        if (actingMembership.role === "admin" && targetMembership.role === "admin") {
            badRequest("Admins cannot remove other admins");
        }

        await ctx.db.delete(targetMembership._id);

        const team = await ctx.db.get(teamId);

        invariant(team, "Team not found");

        await ctx.db.patch(teamId, {
            meta: {
                ...team.meta,
                memberCount: Math.max(0, team.meta.memberCount - 1),
            },
        });

        return {
            success: true,
        };
    },
});

export const leaveTeam = authedMutation({
    args: {
        teamId: v.id("teams"),
    },

    handler: async (ctx, { teamId }) => {
        const { membership } = await requireTeamMembership(ctx, teamId);

        if (membership.role === "owner") badRequest("Transfer ownership before leaving the team");

        await ctx.db.delete(membership._id);

        const team = await ctx.db.get(teamId);

        invariant(team, "Team not found");

        await ctx.db.patch(teamId, {
            meta: {
                ...team.meta,
                memberCount: Math.max(0, team.meta.memberCount - 1),
            },
        });

        return {
            success: true,
        };
    },
});
