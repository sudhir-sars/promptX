"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { InviteEmail } from "../emails/invite";
import { InviteAcceptedEmail } from "../emails/inviteAccepted";
import { MemberRemovedEmail } from "../emails/memberRemoved";
import { RoleChangedEmail } from "../emails/roleChanged";
import { sendEmail } from "../lib/email";

const role = v.union(v.literal("admin"), v.literal("member"));

export const sendInviteEmail = internalAction({
	args: {
		to: v.string(),
		teamName: v.string(),
		inviterName: v.string(),
		role,
		acceptUrl: v.string(),
	},

	handler: async (_ctx, { to, teamName, inviterName, role, acceptUrl }) => {
		await sendEmail({
			to,
			subject: `You've been invited to ${teamName} on PromptX`,
			reactComp: InviteEmail({ teamName, inviterName, role, acceptUrl }),
		});
	},
});

export const sendInviteAcceptedEmail = internalAction({
	args: {
		to: v.string(),
		teamName: v.string(),
		memberName: v.string(),
		role,
	},

	handler: async (_ctx, { to, teamName, memberName, role }) => {
		await sendEmail({
			to,
			subject: `${memberName} joined ${teamName}`,
			reactComp: InviteAcceptedEmail({ teamName, memberName, role }),
		});
	},
});

export const sendRoleChangedEmail = internalAction({
	args: {
		to: v.string(),
		teamName: v.string(),
		role,
	},

	handler: async (_ctx, { to, teamName, role }) => {
		await sendEmail({
			to,
			subject: `Your role in ${teamName} changed`,
			reactComp: RoleChangedEmail({ teamName, role }),
		});
	},
});

export const sendMemberRemovedEmail = internalAction({
	args: {
		to: v.string(),
		teamName: v.string(),
	},

	handler: async (_ctx, { to, teamName }) => {
		await sendEmail({
			to,
			subject: `You were removed from ${teamName}`,
			reactComp: MemberRemovedEmail({ teamName }),
		});
	},
});
