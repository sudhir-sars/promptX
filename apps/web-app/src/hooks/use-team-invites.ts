"use client";

import { useMemo } from "react";
import { FunctionArgs } from "convex/server";

import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { api } from "@/convex/_generated/api";

import { useNavigationStore } from "@/stores/navigation-store";
import { useInvitesStore } from "@/stores/data-store";

export type CreateInviteArgs = FunctionArgs<typeof api.teams.invite.createInvite>;

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
    next: null,
    status: "uninitialized" as const,
};

export function useTeamInvites() {
    const teamId = useNavigationStore((state) => state.teamId);

    const inviteIds = useInvitesStore((state) =>
        teamId ? (state.inviteIdsByTeam[teamId] ?? EMPTY_ARRAY) : EMPTY_ARRAY,
    );

    const invitesById = useInvitesStore((state) => state.invitesById);

    const invites = useMemo(
        () => inviteIds.map((id) => invitesById[id]).filter(Boolean),
        [inviteIds, invitesById],
    );

    const cursor = useInvitesStore((state) =>
        teamId ? (state.cursorByTeam[teamId] ?? EMPTY_CURSOR) : EMPTY_CURSOR,
    );

    const loadInvites = async () => {
        if (!teamId) return;

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

        store.setCursor(teamId, { ...currentCursor, status });

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
                ...(useInvitesStore.getState().cursorByTeam[teamId] ?? { next: null }),
                status: "error",
            });

            consumeError(error);
        }
    };

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

    return {
        invites,

        cursor,
        status: cursor.status,

        loadInvites,
        createInvite,
    };
}
