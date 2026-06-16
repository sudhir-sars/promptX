"use client";

import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";
import { useMembersStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
	next: null,
	status: "uninitialized" as const,
};

export function useTeamMembers() {
	const teamId = useNavigationStore((state) => state.teamId);

	const memberIds = useMembersStore((state) => (teamId ? (state.memberIdsByTeam[teamId] ?? EMPTY_ARRAY) : EMPTY_ARRAY));

	const membersById = useMembersStore((state) => state.membersById);

	const members = useMemo(() => memberIds.map((id) => membersById[id]).filter(Boolean), [memberIds, membersById]);

	const cursor = useMembersStore((state) => (teamId ? (state.cursorByTeam[teamId] ?? EMPTY_CURSOR) : EMPTY_CURSOR));

	const loadMembers = async () => {
		if (!teamId) return;

		const store = useMembersStore.getState();
		const currentCursor = store.cursorByTeam[teamId] ?? EMPTY_CURSOR;

		if (
			currentCursor.status === "loading" ||
			currentCursor.status === "loading-more" ||
			currentCursor.status === "error" ||
			currentCursor.status === "exhausted"
		) {
			return;
		}

		const status = currentCursor.status === "uninitialized" ? "loading" : "loading-more";

		store.setCursor(teamId, { ...currentCursor, status });

		try {
			const result = await db.query(api.teams.member.listMembers, {
				teamId,

				paginationOpts: {
					cursor: currentCursor.next,
					numItems: PAGE_SIZE,
				},
			});

			useMembersStore.getState().cache(teamId, result.page);

			useMembersStore.getState().setCursor(teamId, {
				next: result.continueCursor,
				status: result.isDone ? "exhausted" : "loaded",
			});
		} catch (error) {
			useMembersStore.getState().setCursor(teamId, {
				...(useMembersStore.getState().cursorByTeam[teamId] ?? { next: null }),
				status: "error",
			});

			consumeError(error);
		}
	};

	const updateMemberRole = async (userId: Id<"users">, role: "admin" | "member") => {
		if (!teamId) return;

		try {
			await db.mutation(api.teams.member.updateMemberRole, {
				teamId,
				userId,
				role,
			});

			const member = Object.values(useMembersStore.getState().membersById).find(
				(m) => m.teamId === teamId && m.userId === userId,
			);

			if (member) {
				useMembersStore.getState().update(member._id, { role });
			}
		} catch (error) {
			consumeError(error);
		}
	};

	const removeMember = async (userId: Id<"users">) => {
		if (!teamId) return;

		try {
			await db.mutation(api.teams.member.removeMember, {
				teamId,
				userId,
			});

			const member = Object.values(useMembersStore.getState().membersById).find(
				(m) => m.teamId === teamId && m.userId === userId,
			);

			if (member) {
				useMembersStore.getState().remove(teamId, [member._id]);
			}
		} catch (error) {
			consumeError(error);
		}
	};

	const leaveTeam = async () => {
		if (!teamId) return;

		try {
			await db.mutation(api.teams.member.leaveTeam, {
				teamId,
			});

			useMembersStore.getState().removeByScope(teamId);
		} catch (error) {
			consumeError(error);
		}
	};

	return {
		members,

		cursor,
		status: cursor.status,

		loadMembers,

		updateMemberRole,
		removeMember,

		leaveTeam,
	};
}
