"use client";

import { useIntersection } from "@mantine/hooks";
import type { FunctionArgs } from "convex/server";
import { useEffect, useMemo } from "react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { useInvitesStore, useTeamsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

export type CreateInviteArgs = FunctionArgs<typeof api.teams.invite.createInvite>;

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
	next: null,
	status: "uninitialized" as const,
};

export function useTeamInvites() {
	const teamId = useNavigationStore((state) => state.teamId);

	const teamsById = useTeamsStore((state) => state.teamsById);
	const team = teamId ? teamsById[teamId] : undefined;

	const inviteIds = useInvitesStore((state) => (teamId ? (state.inviteIdsByTeam[teamId] ?? EMPTY_ARRAY) : EMPTY_ARRAY));

	const invitesById = useInvitesStore((state) => state.invitesById);

	const invites = useMemo(
		() =>
			inviteIds
				.map((id) => invitesById[id])
				.filter((invite): invite is NonNullable<typeof invite> => invite !== undefined),
		[inviteIds, invitesById],
	);

	const cursor = useInvitesStore((state) => (teamId ? (state.cursorByTeam[teamId] ?? EMPTY_CURSOR) : EMPTY_CURSOR));

	const { ref, entry } = useIntersection({
		threshold: 0,
	});

	const loadInvites = async () => {
		if (!teamId || (team?.membership?.role !== "owner" && team?.membership?.role !== "admin")) return;

		const store = useInvitesStore.getState();

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

		store.setCursor(teamId, {
			...currentCursor,
			status,
		});

		try {
			const result = await db.query(api.teams.invite.listInvites, {
				teamId,

				paginationOpts: {
					cursor: currentCursor.next,
					numItems: PAGE_SIZE,
				},
			});

			useInvitesStore.getState().cache(teamId, result.page);

			useInvitesStore.getState().setCursor(teamId, {
				next: result.continueCursor,
				status: result.isDone ? "exhausted" : "loaded",
			});
		} catch (error) {
			useInvitesStore.getState().setCursor(teamId, {
				...(useInvitesStore.getState().cursorByTeam[teamId] ?? {
					next: null,
				}),
				status: "error",
			});

			consumeError(error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: follows deployments pattern
	useEffect(() => {
		if (!teamId) return;

		const shouldLoadInitial = cursor.status === "uninitialized";

		const shouldLoadMore = cursor.status === "loaded" && cursor.next && entry?.isIntersecting;

		if (!shouldLoadInitial && !shouldLoadMore) {
			return;
		}

		void loadInvites();
	}, [teamId, cursor.status, cursor.next, entry?.isIntersecting]);

	const createInvite = async (args: Omit<CreateInviteArgs, "teamId">) => {
		if (!teamId) return null;

		try {
			const invite = await db.mutation(api.teams.invite.createInvite, {
				...args,
				teamId,
			});

			useInvitesStore.getState().cache(teamId, [invite]);

			return invite;
		} catch (error) {
			consumeError(error);

			return null;
		}
	};

	const cancelInvite = async (inviteId: Id<"invites">) => {
		if (!teamId) return;

		try {
			await db.mutation(api.teams.invite.cancelInvite, {
				inviteId,
			});

			useInvitesStore.getState().remove(teamId, [inviteId]);
		} catch (error) {
			consumeError(error);
		}
	};

	return {
		invites,

		cursor,
		status: cursor.status,

		loadInvites,

		createInvite,
		cancelInvite,

		loadMoreRef: ref,
		hasMore: !!cursor.next,
		hasInvites: invites.length > 0,
	};
}
