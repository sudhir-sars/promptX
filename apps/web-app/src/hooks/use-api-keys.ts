"use client";

import type { FunctionReturnType } from "convex/server";
import { useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";

import { useApiKeysStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

export type CreateApiKeyResult = FunctionReturnType<typeof api.actions.apiKey.create>;

const PAGE_SIZE = 10;

const EMPTY_CURSOR = {
	next: null,
	status: "uninitialized" as const,
};

export function useApiKeys() {
	const teamId = useNavigationStore((state) => state.teamId);

	const apiKeysById = useApiKeysStore((state) => state.apiKeysById);
	const apiKeyIds = useApiKeysStore((state) => state.apiKeyIds);
	const cursor = useApiKeysStore((state) => state.cursor ?? EMPTY_CURSOR);

	const apiKeys = useMemo(
		() => apiKeyIds.map((id) => apiKeysById[id]).filter((key) => key !== undefined),
		[apiKeyIds, apiKeysById],
	);

	const activeApiKeys = useMemo(() => apiKeys.filter((key) => !key.revokedAt), [apiKeys]);

	const revokedApiKeys = useMemo(() => apiKeys.filter((key) => !!key.revokedAt), [apiKeys]);

	const loadApiKeys = async () => {
		if (!teamId) return;

		const store = useApiKeysStore.getState();
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
			const result = await db.query(api.apiKeys.list, {
				teamId,
				paginationOpts: {
					cursor: currentCursor.next,
					numItems: PAGE_SIZE,
				},
			});

			useApiKeysStore.getState().cache(result.page);

			useApiKeysStore.getState().setCursor({
				next: result.continueCursor,
				status: result.isDone ? "exhausted" : "loaded",
			});
		} catch (error) {
			useApiKeysStore.getState().setCursor({
				...useApiKeysStore.getState().cursor,
				status: "error",
			});

			consumeError(error);

			throw error;
		}
	};

	const createApiKey = async (name?: string): Promise<CreateApiKeyResult> => {
		if (!teamId) {
			throw new Error("No team selected");
		}

		try {
			const result = await db.action(api.actions.apiKey.create, {
				teamId,
				...(name !== undefined ? { name } : {}),
			});

			useApiKeysStore.getState().cache([result.keyDoc]);

			return result;
		} catch (error) {
			consumeError(error);

			throw error;
		}
	};

	const revokeApiKey = async (apiKeyId: Id<"apiKeys">) => {
		if (!teamId) {
			throw new Error("No team selected");
		}

		try {
			await db.action(api.actions.apiKey.revoke, {
				teamId,
				id: apiKeyId,
			});

			useApiKeysStore.getState().update(apiKeyId, {
				revokedAt: Date.now(),
			});
		} catch (error) {
			consumeError(error);

			throw error;
		}
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: loadApiKeys reads store via getState(), not reactive state
	useEffect(() => {
		if (!teamId || cursor.status !== "uninitialized") {
			return;
		}

		void loadApiKeys();
	}, [teamId, cursor.status]);

	return {
		apiKeys,

		activeApiKeys,
		revokedApiKeys,

		cursor,
		status: cursor.status,

		createApiKey,
		revokeApiKey,

		hasApiKeys: apiKeys.length > 0,
	};
}
