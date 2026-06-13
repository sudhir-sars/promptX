"use client";

import { useEffect, useMemo } from "react";
import { useIntersection } from "@mantine/hooks";
import { FunctionArgs, FunctionReturnType } from "convex/server";

import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { api } from "@/convex/_generated/api";

import { useTeamsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

export type CreateTeamArgs = FunctionArgs<typeof api.teams.team.createTeam>;
export type UpdateTeamArgs = FunctionArgs<typeof api.teams.team.updateTeam>;
export type TransferOwnershipArgs = FunctionArgs<typeof api.teams.team.transferOwnership>;
export type DeleteTeamArgs = FunctionArgs<typeof api.teams.team.deleteTeam>;
export type CreateTeamResult = FunctionReturnType<typeof api.teams.team.createTeam>;

const PAGE_SIZE = 10;

export function useTeams() {
    const teamId = useNavigationStore((state) => state.teamId);
    const teamsById = useTeamsStore((state) => state.teamsById);
    const teamIds = useTeamsStore((state) => state.teamIds);
    const cursor = useTeamsStore((state) => state.cursor);

    const teams = useMemo(
        () => teamIds.map((id) => teamsById[id]).filter(Boolean),
        [teamIds, teamsById],
    );

    const team = teamId ? teamsById[teamId] : undefined;

    const { ref, entry } = useIntersection({ threshold: 0 });

    const loadTeams = async () => {
        const store = useTeamsStore.getState();
        const currentCursor = store.cursor;

        if (
            currentCursor.status === "loading" ||
            currentCursor.status === "loading-more" ||
            currentCursor.status === "error" ||
            currentCursor.status === "exhausted"
        ) {
            return;
        }

        const status = currentCursor.status === "uninitialized" ? "loading" : "loading-more";

        store.setCursor({ ...currentCursor, status });

        try {
            const result = await db.query(api.teams.team.listTeams, {
                paginationOpts: {
                    cursor: currentCursor.next,
                    numItems: PAGE_SIZE,
                },
            });

            useTeamsStore.getState().cache(result.page);

            useTeamsStore.getState().setCursor({
                next: result.continueCursor,
                status: result.isDone ? "exhausted" : "loaded",
            });
        } catch (error) {
            useTeamsStore.getState().setCursor({
                ...useTeamsStore.getState().cursor,
                status: "error",
            });

            consumeError(error);
        }
    };

    useEffect(() => {
        const shouldLoadInitial = cursor.status === "uninitialized";
        const shouldLoadMore = cursor.status === "loaded" && cursor.next && entry?.isIntersecting;

        if (!shouldLoadInitial && !shouldLoadMore) return;

        void loadTeams();
    }, [cursor.status, cursor.next, entry?.isIntersecting]);

    const createTeam = async (args: CreateTeamArgs): Promise<CreateTeamResult | null> => {
        try {
            const result = await db.mutation(api.teams.team.createTeam, args);

            useTeamsStore.getState().cache([result.team]);

            return result;
        } catch (error) {
            consumeError(error);

            return null;
        }
    };

    const updateTeam = async (args: UpdateTeamArgs) => {
        try {
            await db.mutation(api.teams.team.updateTeam, args);

            useTeamsStore.getState().update(args.teamId, {
                ...(args.name !== undefined && { name: args.name }),
                ...(args.avatar !== undefined && { avatar: args.avatar }),
            });
        } catch (error) {
            consumeError(error);
        }
    };

    const transferOwnership = async (args: TransferOwnershipArgs) => {
        try {
            await db.mutation(api.teams.team.transferOwnership, args);

            // Cross-store sync: update team owner + member roles
            useTeamsStore.getState().update(args.teamId, { ownerId: args.userId });

            const membersState = (
                await import("@/stores/data-store/members")
            ).useMembersStore.getState();
            for (const member of Object.values(membersState.membersById)) {
                if (member.teamId !== args.teamId) continue;

                if (member.userId === args.userId) {
                    membersState.update(member._id, { role: "owner" });
                } else if (member.role === "owner") {
                    membersState.update(member._id, { role: "admin" });
                }
            }
        } catch (error) {
            consumeError(error);
        }
    };

    const deleteTeam = async (args: DeleteTeamArgs) => {
        try {
            await db.mutation(api.teams.team.deleteTeam, args);

            useTeamsStore.getState().remove([args.teamId]);

            // Cross-store cascade: clean related caches
            const { usePromptsStore } = await import("@/stores/data-store/prompts");
            const { useVersionsStore } = await import("@/stores/data-store/versions");
            const { useDeploymentsStore } = await import("@/stores/data-store/deployments");
            const { useMembersStore } = await import("@/stores/data-store/members");
            const { useInvitesStore } = await import("@/stores/data-store/invites");

            const promptIds = usePromptsStore.getState().promptIdsByTeam[args.teamId] ?? [];

            for (const promptId of promptIds) {
                useVersionsStore.getState().removeByScope(promptId);
                useDeploymentsStore.getState().removeByScope(promptId);
            }

            usePromptsStore.getState().removeByScope(args.teamId);
            useMembersStore.getState().removeByScope(args.teamId);
            useInvitesStore.getState().removeByScope(args.teamId);
        } catch (error) {
            consumeError(error);
        }
    };

    return {
        team,
        teams,
        cursor,
        status: cursor.status,
        loadTeams,
        createTeam,
        updateTeam,
        transferOwnership,
        deleteTeam,
        loadMoreRef: ref,
        hasMore: !!cursor.next,
        hasTeams: teams.length > 0,
    };
}
