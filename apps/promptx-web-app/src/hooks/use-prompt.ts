"use client";

import { useEffect, useMemo } from "react";
import { useIntersection } from "@mantine/hooks";
import { FunctionArgs, FunctionReturnType } from "convex/server";

import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { useNavigationStore } from "@/stores/navigation-store";
import { usePromptsStore } from "@/stores/data-store";

export type CreatePromptArgs = FunctionArgs<typeof api.prompts.createPrompt>;
export type UpdatePromptArgs = FunctionArgs<typeof api.prompts.updatePrompt>;
export type DeletePromptArgs = FunctionArgs<typeof api.prompts.deletePrompt>;
export type CreatePromptResult = FunctionReturnType<typeof api.prompts.createPrompt>;

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
    next: null,
    status: "uninitialized" as const,
};

export function usePrompts() {
    const teamId = useNavigationStore((state) => state.teamId);

    const selectedPromptId = useNavigationStore((state) => state.promptId);

    const promptIds = usePromptsStore((state) =>
        teamId ? (state.promptIdsByTeam[teamId] ?? EMPTY_ARRAY) : EMPTY_ARRAY,
    );

    const promptsById = usePromptsStore((state) => state.promptsById);

    const prompts = useMemo(
        () => promptIds.map((id) => promptsById[id]).filter(Boolean),
        [promptIds, promptsById],
    );

    const prompt = useMemo(
        () => (selectedPromptId ? (promptsById[selectedPromptId] ?? null) : null),
        [selectedPromptId, promptsById],
    );

    const cursor = usePromptsStore((state) =>
        teamId ? (state.cursorByTeam[teamId] ?? EMPTY_CURSOR) : EMPTY_CURSOR,
    );

    const { ref, entry } = useIntersection({
        threshold: 0,
    });

    const loadPrompts = async () => {
        if (!teamId) return;

        const store = usePromptsStore.getState();
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
            const result = await db.query(api.prompts.listPrompts, {
                teamId,

                paginationOpts: {
                    cursor: currentCursor.next,
                    numItems: PAGE_SIZE,
                },
            });

            usePromptsStore.getState().cache(teamId, result.page);

            usePromptsStore.getState().setCursor(teamId, {
                next: result.continueCursor,
                status: result.isDone ? "exhausted" : "loaded",
            });
        } catch (error) {
            usePromptsStore.getState().setCursor(teamId, {
                ...(usePromptsStore.getState().cursorByTeam[teamId] ?? { next: null }),
                status: "error",
            });

            consumeError(error);
        }
    };

    useEffect(() => {
        if (!teamId) return;

        const shouldLoadInitial = cursor.status === "uninitialized";

        const shouldLoadMore = cursor.status === "loaded" && cursor.next && entry?.isIntersecting;

        if (!shouldLoadInitial && !shouldLoadMore) {
            return;
        }

        void loadPrompts();
    }, [teamId, cursor.status, cursor.next, entry?.isIntersecting]);

    const createPrompt = async (args: Omit<CreatePromptArgs, "teamId">) => {
        if (!teamId) return null;

        try {
            const prompt = await db.mutation(api.prompts.createPrompt, {
                ...args,
                teamId,
            });

            usePromptsStore.getState().cache(teamId, [prompt]);

            // Prepend to list
            usePromptsStore.setState((state) => ({
                promptIdsByTeam: {
                    ...state.promptIdsByTeam,

                    [teamId]: [
                        prompt._id,
                        ...(state.promptIdsByTeam[teamId] ?? []).filter((id) => id !== prompt._id),
                    ],
                },
            }));

            // Cross-store: increment team prompt count
            const { useTeamsStore } = await import("@/stores/data-store/teams");
            const team = useTeamsStore.getState().teamsById[teamId];
            if (team) {
                useTeamsStore.getState().update(teamId, {
                    meta: {
                        ...team.meta,
                        promptCount: team.meta.promptCount + 1,
                    },
                });
            }

            return prompt;
        } catch (error) {
            consumeError(error);

            return null;
        }
    };

    const renamePrompt = async (name: string) => {
        if (!prompt) return null;

        try {
            await db.mutation(api.prompts.updatePrompt, {
                promptId: prompt._id,
                name,
            });

            usePromptsStore.getState().update(prompt._id, { name });
        } catch (error) {
            consumeError(error);
        }
    };

    const deletePrompt = async (promptId: Id<"prompts">) => {
        if (!teamId) return;

        try {
            await db.mutation(api.prompts.deletePrompt, { promptId });

            usePromptsStore.getState().remove(teamId, [promptId]);

            // Cross-store cascade: clean versions + deployments
            const { useVersionsStore } = await import("@/stores/data-store/versions");
            const { useDeploymentsStore } = await import("@/stores/data-store/deployments");

            useVersionsStore.getState().removeByScope(promptId);
            useDeploymentsStore.getState().removeByScope(promptId);

            // Cross-store: decrement team prompt count
            const { useTeamsStore } = await import("@/stores/data-store/teams");
            const team = useTeamsStore.getState().teamsById[teamId];
            if (team) {
                useTeamsStore.getState().update(teamId, {
                    meta: {
                        ...team.meta,
                        promptCount: Math.max(0, team.meta.promptCount - 1),
                    },
                });
            }
        } catch (error) {
            consumeError(error);
        }
    };

    return {
        prompt,
        prompts,

        cursor,
        status: cursor.status,

        loadPrompts,

        createPrompt,
        renamePrompt,
        deletePrompt,

        loadMoreRef: ref,
        hasMore: !!cursor.next,
        hasPrompts: prompts.length > 0,
    };
}
