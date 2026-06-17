import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { authedMutation, authedQuery } from "../lib/auth";

import { cascadeDeleteTeam } from "../lib/cascade";
import { createDefaultPrompt } from "../lib/defaults";
import { badRequest, invariant, notFound } from "../lib/errors";
import { requireTeamAdmin, requireTeamMembership, requireTeamOwner } from "../lib/permissions";

export const createTeam = authedMutation({
	args: {
		name: v.string(),
		avatar: v.optional(v.string()),
	},

	handler: async (ctx, { name, avatar }) => {
		const teamId = await ctx.db.insert("teams", {
			ownerId: ctx.userId,
			name,
			...(avatar !== undefined ? { avatar } : {}),
			meta: {
				memberCount: 1,
				promptCount: 1,
			},
		});

		const membershipId = await ctx.db.insert("members", {
			teamId,
			userId: ctx.userId,
			role: "owner",

			avatar: ctx.avatar,
			email: ctx.email,
			name: ctx.name,
		});
		const membership = await ctx.db.get(membershipId);
		invariant(membership, "Failed to create team membership");

		const { draftVersion, prompt, version } = await createDefaultPrompt(ctx, teamId);

		const team = await ctx.db.get(teamId);

		invariant(team, "Failed to create team");

		return { team: { ...team, membership }, draftVersion, prompt, version };
	},
});

export const getTeam = authedQuery({
	args: {
		teamId: v.id("teams"),
	},

	handler: async (ctx, { teamId }) => {
		const { membership } = await requireTeamMembership(ctx, teamId);

		const teamDoc = await ctx.db.get(teamId);

		if (!teamDoc) notFound("Team");

		return {
			...teamDoc,
			membership,
		};
	},
});

export const listTeams = authedQuery({
	args: {
		paginationOpts: paginationOptsValidator,
	},

	// Lists every team the user belongs to (owner, admin, or member), not just
	// the ones they own. Pagination runs over the user's memberships, then each
	// membership is resolved to its team document.
	handler: async (ctx, { paginationOpts }) => {
		const memberships = await ctx.db
			.query("members")
			.withIndex("by_user", (q) => q.eq("userId", ctx.userId))
			.order("desc")
			.paginate(paginationOpts);

		const page = await Promise.all(
			memberships.page.map(async (membership) => {
				const team = await ctx.db.get(membership.teamId);

				if (!team) return null;

				return {
					...team,
					membership: membership,
				};
			}),
		);

		return {
			continueCursor: memberships.continueCursor,
			isDone: memberships.isDone,
			page: page.filter((team) => team !== null),
		};
	},
});

export const updateTeam = authedMutation({
	args: {
		teamId: v.id("teams"),
		name: v.optional(v.string()),
		avatar: v.optional(v.string()),
	},

	handler: async (ctx, { teamId, name, avatar }) => {
		await requireTeamAdmin(ctx, teamId);

		const team = await ctx.db.get(teamId);

		if (!team) notFound("Team");

		await ctx.db.patch(teamId, {
			name: name ?? team.name,
			avatar: avatar ?? team.avatar,
		});

		return teamId;
	},
});

export const transferOwnership = authedMutation({
	args: {
		teamId: v.id("teams"),
		userId: v.id("users"),
	},

	handler: async (ctx, { teamId, userId }) => {
		const { membership: currentOwnerMembership } = await requireTeamOwner(ctx, teamId);

		const team = await ctx.db.get(teamId);

		if (!team) notFound("Team");

		const targetOwnerMembership = await ctx.db
			.query("members")
			.withIndex("by_team_user", (q) => q.eq("teamId", teamId).eq("userId", userId))
			.unique();

		if (!targetOwnerMembership) badRequest("Target user is not a team member");

		await ctx.db.patch(currentOwnerMembership._id, {
			role: "admin",
		});

		await ctx.db.patch(targetOwnerMembership._id, {
			role: "owner",
		});

		await ctx.db.patch(teamId, {
			ownerId: userId,
		});

		return teamId;
	},
});

export const deleteTeam = authedMutation({
	args: {
		teamId: v.id("teams"),
	},

	handler: async (ctx, { teamId }) => {
		await requireTeamOwner(ctx, teamId);

		const ownedTeams = await ctx.db
			.query("teams")
			.withIndex("by_owner", (q) => q.eq("ownerId", ctx.userId))
			.take(2);

		if (ownedTeams.length < 2) {
			badRequest("You cannot delete your last team. Create another team");
		}

		await cascadeDeleteTeam(ctx, teamId);

		return {
			success: true,
		};
	},
});
