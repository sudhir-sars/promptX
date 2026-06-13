import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { authedMutation, authedQuery } from "../lib/auth";
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
    const code = await createUniqueInviteCode(ctx);
    const inviteId = await ctx.db.insert("invites", {
      teamId,
      invitedBy: ctx.userId,
      code,
      role,
      email,
    });

    const invite = await ctx.db.get(inviteId);

    invariant(invite, "Failed to create invite");

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

export const acceptInvite = authedMutation({
  args: {
    code: v.string(),
  },

  handler: async (ctx, { code }) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_code", (q) => q.eq("code", code.replace("-", "").toUpperCase()))
      .unique();

    if (!invite) {
      notFound("Invite");
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

      meta: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

    const team = await ctx.db.get(invite.teamId);

    invariant(team, "Team not found");

    await ctx.db.patch(team._id, {
      meta: {
        ...team.meta,
        memberCount: team.meta.memberCount + 1,
      },
    });

    await ctx.db.delete(invite._id);

    return {
      success: true,
      teamId: invite.teamId,
    };
  },
});
