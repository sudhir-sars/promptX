"use client";

import { api } from "@/convex/_generated/api";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

export function useInvite() {
	const acceptInvite = async (code: string) => {
		try {
			return await db.mutation(api.teams.invite.acceptInvite, { code });
		} catch (error) {
			consumeError(error);

			return null;
		}
	};
	const invitePreview = async (code: string) => {
		try {
			return await db.query(api.teams.invite.getInvitePreview, { code });
		} catch (error) {
			consumeError(error);

			return null;
		}
	};

	const declineInvite = async (code: string) => {
		try {
			return await db.mutation(api.teams.invite.declineInvite, { code });
		} catch (error) {
			consumeError(error);

			return null;
		}
	};

	return {
		invitePreview,
		acceptInvite,
		declineInvite,
	};
}
