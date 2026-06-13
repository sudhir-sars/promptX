"use client";

import { useMemo } from "react";

import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { api } from "@/convex/_generated/api";

import { useNavigationStore } from "@/stores/navigation-store";
import { useActivitiesStore } from "@/stores/data-store";

const PAGE_SIZE = 25;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
    next: null,
    status: "uninitialized" as const,
};

export function useActivities() {
    const teamId = useNavigationStore((state) => state.teamId);

    const activityIds = useActivitiesStore((state) =>
        teamId ? (state.activityIdsByTeam[teamId] ?? EMPTY_ARRAY) : EMPTY_ARRAY,
    );

    const activitiesById = useActivitiesStore((state) => state.activitiesById);

    const activities = useMemo(
        () => activityIds.map((id) => activitiesById[id]).filter(Boolean),
        [activityIds, activitiesById],
    );

    const cursor = useActivitiesStore((state) =>
        teamId ? (state.cursorByTeam[teamId] ?? EMPTY_CURSOR) : EMPTY_CURSOR,
    );

    const loadActivities = async () => {
        if (!teamId) return;

        const store = useActivitiesStore.getState();
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
            const result = await db.query(api.activities.listAuditLogs, {
                teamId,

                paginationOpts: {
                    cursor: currentCursor.next,
                    numItems: PAGE_SIZE,
                },
            });

            useActivitiesStore.getState().cache(teamId, result.page);

            useActivitiesStore.getState().setCursor(teamId, {
                next: result.continueCursor,
                status: result.isDone ? "exhausted" : "loaded",
            });
        } catch (error) {
            useActivitiesStore.getState().setCursor(teamId, {
                ...(useActivitiesStore.getState().cursorByTeam[teamId] ?? { next: null }),
                status: "error",
            });

            consumeError(error);
        }
    };

    return {
        activities,
        cursor,
        status: cursor.status,
        loadActivities,
    };
}
