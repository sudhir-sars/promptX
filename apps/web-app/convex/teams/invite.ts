import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, query } from "../_generated/server";
import { authedMutation, authedQuery } from "../lib/auth";
import { normalizeAndValidateEmail, normalizeAndValidateInviteCode } from "../lib/email";
import { badRequest, invariant, notFound } from "../lib/errors";
import { createUniqueInviteCode } from "../lib/invites";
import { requireTeamAdmin } from "../lib/permissions";
export const createInvite = authedMutation({
	args: {
		teamId: v.id("teams"),
		role: v.union(v.literal("admin"), v.literal("member")),
		email: v.string(),
	},

	handler: async (ctx, { teamId, role, email }) => {
		await requireTeamAdmin(ctx, teamId);

		const normalizedEmail = normalizeAndValidateEmail(email);

		if (!normalizedEmail) badRequest("Enter a valid email address");

		if (normalizedEmail === ctx.email.toLowerCase()) badRequest("You are already a member of this team");

		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", normalizedEmail))
			.unique();

		if (existingUser) {
			const existingMembership = await ctx.db
				.query("members")
				.withIndex("by_team_user", (q) => q.eq("teamId", teamId).eq("userId", existingUser._id))
				.unique();

			if (existingMembership) badRequest("This person is already a member of the team");
		}

		const duplicate = await ctx.db
			.query("invites")
			.withIndex("by_team_email", (q) => q.eq("teamId", teamId).eq("email", normalizedEmail))
			.unique();

		if (duplicate) badRequest("An invitation has already been sent to this email");

		const code = await createUniqueInviteCode(ctx);

		const inviteId = await ctx.db.insert("invites", {
			teamId,
			invitedBy: ctx.userId,
			code,
			role,
			email: normalizedEmail,
			expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
		});

		const invite = await ctx.db.get(inviteId);

		invariant(invite, "Failed to create invite");

		const team = await ctx.db.get(teamId);
		invariant(team, "Team not found");

		const appUrl = process.env["APP_URL"]!;

		await ctx.scheduler.runAfter(0, internal.actions.email.sendInviteEmail, {
			to: normalizedEmail,
			teamName: team.name,
			inviterName: ctx.name,
			role,
			acceptUrl: `${appUrl}/invite/${code}`,
		});

		return invite;
	},
});

export const listInvites = authedQuery({
	args: {
		teamId: v.id("teams"),
		paginationOpts: paginationOptsValidator,
	},

	handler: async (ctx, { teamId, paginationOpts }) => {
		await requireTeamAdmin(ctx, teamId);

		return await ctx.db
			.query("invites")
			.withIndex("by_team", (q) => q.eq("teamId", teamId))
			.order("desc")
			.paginate(paginationOpts);
	},
});

export const cancelInvite = authedMutation({
	args: {
		inviteId: v.id("invites"),
	},

	handler: async (ctx, { inviteId }) => {
		const invite = await ctx.db.get(inviteId);

		if (!invite) {
			notFound("Invite");
		}

		await requireTeamAdmin(ctx, invite.teamId);

		await ctx.db.delete(inviteId);

		return {
			success: true,
		};
	},
});

export const deleteExpiredInvite = internalMutation({
	args: {
		inviteId: v.id("invites"),
	},

	handler: async (ctx, { inviteId }) => {
		const invite = await ctx.db.get(inviteId);

		if (!invite) {
			return;
		}

		if (invite.expiresAt > Date.now()) {
			return;
		}

		await ctx.db.delete(inviteId);
	},
});

export const getInvitePreview = query({
	args: {
		code: v.string(),
	},

	handler: async (ctx, { code }) => {
		const normalizedCode = normalizeAndValidateInviteCode(code);

		const invite = await ctx.db
			.query("invites")
			.withIndex("by_code", (q) => q.eq("code", normalizedCode))
			.unique();

		if (!invite || invite.expiresAt < Date.now()) {
			return null;
		}

		const [team, inviter] = await Promise.all([ctx.db.get(invite.teamId), ctx.db.get(invite.invitedBy)]);

		if (!team) {
			return null;
		}

		return {
			teamName: team.name,
			teamAvatar: team.avatar ?? null,
			role: invite.role,
			inviterName: inviter?.name ?? "A teammate",
		};
	},
});

export const acceptInvite = authedMutation({
	args: {
		code: v.string(),
	},

	handler: async (ctx, { code }) => {
		const normalizedCode = normalizeAndValidateInviteCode(code);
		const invite = await ctx.db
			.query("invites")
			.withIndex("by_code", (q) => q.eq("code", normalizedCode))
			.unique();

		if (!invite) {
			notFound("Invite");
		}

		if (invite.email !== ctx.email.toLowerCase()) {
			badRequest("This invitation was sent to a different email address");
		}

		const existingMembership = await ctx.db
			.query("members")
			.withIndex("by_team_user", (q) => q.eq("teamId", invite.teamId).eq("userId", ctx.userId))
			.unique();

		if (existingMembership) {
			badRequest("You are already a member of this team");
		}

		const user = await ctx.db.get(ctx.userId);

		invariant(user, "User not found");

		await ctx.db.insert("members", {
			teamId: invite.teamId,
			userId: ctx.userId,
			role: invite.role,

			name: user.name,
			email: user.email,
			avatar: user.avatar,
		});

		const team = await ctx.db.get(invite.teamId);

		invariant(team, "Team not found");

		await ctx.db.patch(team._id, {
			meta: {
				...team.meta,
				memberCount: team.meta.memberCount + 1,
			},
		});

		const inviter = await ctx.db.get(invite.invitedBy);

		await ctx.db.delete(invite._id);

		if (inviter) {
			await ctx.scheduler.runAfter(0, internal.actions.email.sendInviteAcceptedEmail, {
				to: inviter.email,
				teamName: team.name,
				memberName: user.name,
				role: invite.role,
			});
		}

		return {
			success: true,
			teamId: invite.teamId,
		};
	},
});

export const declineInvite = authedMutation({
	args: {
		code: v.string(),
	},

	handler: async (ctx, { code }) => {
		const normalizedCode = normalizeAndValidateInviteCode(code);
		const invite = await ctx.db
			.query("invites")
			.withIndex("by_code", (q) => q.eq("code", normalizedCode))
			.unique();

		if (!invite) {
			notFound("Invite");
		}

		if (invite.email !== ctx.email.toLowerCase()) {
			badRequest("This invitation was sent to a different email address");
		}

		await ctx.db.delete(invite._id);

		return {
			success: true,
		};
	},
});
