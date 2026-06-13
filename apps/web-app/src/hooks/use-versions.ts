"use client";

import { useDebouncedCallback, useIntersection } from "@mantine/hooks";
import type { FunctionArgs, FunctionReturnType } from "convex/server";
import { useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";
import { useVersionsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";
import { useStudioStore } from "@/stores/prompt-editor-store";

export type CreateVersionArgs = FunctionArgs<typeof api.versions.createVersion>;
export type UpdateVersionArgs = FunctionArgs<typeof api.versions.updateVersion>;
export type CreateVersionResult = FunctionReturnType<
  typeof api.versions.createVersion
>;

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
  next: null,
  status: "uninitialized" as const,
};

export function useVersions() {
  const promptId = useNavigationStore((state) => state.promptId);

  const selectedVersionId = useStudioStore((state) => state.selectedVersion);

  const versionIds = useVersionsStore((state) =>
    promptId
      ? (state.versionIdsByPrompt[promptId] ?? EMPTY_ARRAY)
      : EMPTY_ARRAY,
  );

  const versionsById = useVersionsStore((state) => state.versionsById);

  const versions = useMemo(
    () => versionIds.map((id) => versionsById[id]).filter(Boolean),
    [versionIds, versionsById],
  );

  const cursor = useVersionsStore((state) =>
    promptId ? (state.cursorByPrompt[promptId] ?? EMPTY_CURSOR) : EMPTY_CURSOR,
  );

  const { ref, entry } = useIntersection({
    threshold: 0,
  });

  const updateVersionRemote = async (args: UpdateVersionArgs) => {
    try {
      await db.mutation(api.versions.updateVersion, args);
    } catch (error) {
      consumeError(error);
    }
  };

  const updateVersionDebounced = useDebouncedCallback(
    updateVersionRemote,
    2375,
  );

  useEffect(() => {
    return () => {
      updateVersionDebounced.flush();
    };
  }, [updateVersionDebounced]);

  const loadVersions = async () => {
    if (!promptId) return;

    const store = useVersionsStore.getState();
    const currentCursor = store.cursorByPrompt[promptId] ?? EMPTY_CURSOR;

    if (
      currentCursor.status === "loading" ||
      currentCursor.status === "loading-more" ||
      currentCursor.status === "error" ||
      currentCursor.status === "exhausted"
    ) {
      return;
    }

    const status =
      currentCursor.status === "uninitialized" ? "loading" : "loading-more";

    store.setCursor(promptId, { ...currentCursor, status });

    try {
      const result = await db.query(api.versions.listVersions, {
        promptId,

        paginationOpts: {
          cursor: currentCursor.next,
          numItems: PAGE_SIZE,
        },
      });

      useVersionsStore.getState().cache(promptId, result.page);

      useVersionsStore.getState().setCursor(promptId, {
        next: result.continueCursor,
        status: result.isDone ? "exhausted" : "loaded",
      });
    } catch (error) {
      useVersionsStore.getState().setCursor(promptId, {
        ...(useVersionsStore.getState().cursorByPrompt[promptId] ?? {
          next: null,
        }),
        status: "error",
      });

      consumeError(error);
    }
  };

  useEffect(() => {
    if (!promptId) return;

    const shouldLoadInitial = cursor.status === "uninitialized";

    const shouldLoadMore =
      cursor.status === "loaded" && cursor.next && entry?.isIntersecting;

    if (!shouldLoadInitial && !shouldLoadMore) {
      return;
    }

    void loadVersions();
  }, [
    promptId,
    cursor.status,
    cursor.next,
    entry?.isIntersecting,
    loadVersions,
  ]);

  const versionId = selectedVersionId ?? versions[0]?._id;

  const version = useMemo(
    () => (versionId ? (versionsById[versionId] ?? null) : null),
    [versionId, versionsById],
  );

  const createVersion = async (args: Omit<CreateVersionArgs, "promptId">) => {
    if (!promptId) return;

    updateVersionDebounced.cancel();

    try {
      const { newDraft, versionId } = await db.mutation(
        api.versions.createVersion,
        {
          ...args,
          promptId,
        },
      );

      const store = useVersionsStore.getState();

      // Cache the new draft
      useVersionsStore.getState().cache(promptId, [newDraft]);

      // Prepend new draft to list
      useVersionsStore.setState((state) => ({
        versionIdsByPrompt: {
          ...state.versionIdsByPrompt,

          [promptId]: [
            newDraft._id,
            ...(state.versionIdsByPrompt[promptId] ?? []).filter(
              (id) => id !== newDraft._id,
            ),
          ],
        },
      }));

      // Mark the released version as non-draft
      if (store.versionsById[versionId]) {
        useVersionsStore.getState().update(versionId, {
          draft: false,
          content: args.content,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      consumeError(error);
    }
  };

  const updateContent = (content: string) => {
    if (!versionId) return;

    // Optimistic update in store
    useVersionsStore.getState().update(versionId, {
      content,
      updatedAt: Date.now(),
    });

    // Debounced remote save
    updateVersionDebounced({ versionId, content });
  };

  const updateTag = (tag: string) => {
    if (!versionId) return;

    // Optimistic update in store
    useVersionsStore.getState().update(versionId, {
      tag,
      updatedAt: Date.now(),
    });

    // Debounced remote save
    updateVersionDebounced({ versionId, tag });
  };

  const setTag = async (versionId: Id<"versions">, tag: string) => {
    const trimmed = tag.trim();
    const previous = useVersionsStore.getState().versionsById[versionId]?.tag;

    // Optimistic update in store (cast: clearing sets `tag` to undefined,
    // which exactOptionalPropertyTypes disallows on the literal).
    useVersionsStore.getState().update(versionId, {
      tag: trimmed,
      updatedAt: Date.now(),
    });

    try {
      // Omitting `tag` clears it server-side (handler patches `undefined`).
      await db.mutation(
        api.versions.setVersionTag,
        trimmed ? { versionId, tag: trimmed } : { versionId },
      );
    } catch (error) {
      // Revert optimistic update on failure
      useVersionsStore
        .getState()
        .update(versionId, { tag: previous } as Partial<Doc<"versions">>);

      consumeError(error);
    }
  };

  const setSelectedVersion = (versionId: Id<"versions">) => {
    updateVersionDebounced.flush();

    useStudioStore.getState().setSelectedVersion(versionId);
  };

  return {
    version,
    versions,

    cursor,
    status: cursor.status,

    createVersion,

    updateContent,
    updateTag,
    setTag,

    setSelectedVersion,

    loadVersions,

    loadMoreRef: ref,

    hasMore: !!cursor.next,

    hasVersions: versions.length > 0,
  };
}
