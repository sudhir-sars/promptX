"use client";

import { useIntersection } from "@mantine/hooks";
import type { FunctionArgs } from "convex/server";
import { useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";
import { useDeploymentsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

export type DeployVersionArgs = FunctionArgs<typeof api.actions.deployments.deployPromptVersion>;
export type RollbackDeploymentArgs = FunctionArgs<typeof api.actions.deployments.rollbackDeployment>;

const PAGE_SIZE = 10;

const EMPTY_ARRAY: readonly [] = [];

const EMPTY_CURSOR = {
	next: null,
	status: "uninitialized" as const,
};

function syncDeploymentCache(deployment: Doc<"deployments">, active: boolean) {
	const store = useDeploymentsStore.getState();
	const deploymentIds = store.deploymentIdsByPrompt[deployment.promptId] ?? [];

	if (active) {
		for (const deploymentId of deploymentIds) {
			const existing = store.deploymentsById[deploymentId];
			if (existing?.active) {
				useDeploymentsStore.getState().update(deploymentId, { active: false });
			}
		}
	}

	useDeploymentsStore.getState().cache(deployment.promptId, [{ ...deployment, active }]);
}

export function useDeployments() {
	const promptId = useNavigationStore((state) => state.promptId);

	const deploymentIds = useDeploymentsStore((state) =>
		promptId ? (state.deploymentIdsByPrompt[promptId] ?? EMPTY_ARRAY) : EMPTY_ARRAY,
	);

	const deploymentsById = useDeploymentsStore((state) => state.deploymentsById);

	const deployments = useMemo(
		() => deploymentIds.map((id) => deploymentsById[id]).filter((deployment) => deployment !== undefined),
		[deploymentIds, deploymentsById],
	);

	const cursor = useDeploymentsStore((state) =>
		promptId ? (state.cursorByPrompt[promptId] ?? EMPTY_CURSOR) : EMPTY_CURSOR,
	);

	const { ref, entry } = useIntersection({
		threshold: 0,
	});

	const activeDeployment = useMemo(() => deployments.find((deployment) => deployment.active) ?? null, [deployments]);
	const activeDeployments = useMemo(() => deployments.filter((deployment) => deployment.active), [deployments]);

	const loadDeployments = async () => {
		if (!promptId) return;

		const store = useDeploymentsStore.getState();
		const currentCursor = store.cursorByPrompt[promptId] ?? EMPTY_CURSOR;

		if (
			currentCursor.status === "loading" ||
			currentCursor.status === "loading-more" ||
			currentCursor.status === "error" ||
			currentCursor.status === "exhausted"
		) {
			return;
		}

		const status = currentCursor.status === "uninitialized" ? "loading" : "loading-more";

		store.setCursor(promptId, { ...currentCursor, status });

		try {
			const result = await db.query(api.deployments.listDeployments, {
				promptId,

				paginationOpts: {
					cursor: currentCursor.next,
					numItems: PAGE_SIZE,
				},
			});

			useDeploymentsStore.getState().cache(promptId, result.page);

			useDeploymentsStore.getState().setCursor(promptId, {
				next: result.continueCursor,
				status: result.isDone ? "exhausted" : "loaded",
			});
		} catch (error) {
			useDeploymentsStore.getState().setCursor(promptId, {
				...(useDeploymentsStore.getState().cursorByPrompt[promptId] ?? {
					next: null,
				}),
				status: "error",
			});

			consumeError(error);
		}
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: loadDeployments reads store via getState(), not reactive state
	useEffect(() => {
		if (!promptId) return;

		const shouldLoadInitial = cursor.status === "uninitialized";

		const shouldLoadMore = cursor.status === "loaded" && cursor.next && entry?.isIntersecting;

		if (!shouldLoadInitial && !shouldLoadMore) {
			return;
		}

		void loadDeployments();
	}, [promptId, cursor.status, cursor.next, entry?.isIntersecting]);

	const deployVersion = async (args: Omit<DeployVersionArgs, "promptId">) => {
		if (!promptId) return;

		try {
			const { deployment } = await db.action(api.actions.deployments.deployPromptVersion, {
				...args,
				promptId,
			});

			syncDeploymentCache(deployment, true);
		} catch (error) {
			consumeError(error);
		}
	};

	const rollbackDeployment = async (deploymentId: Id<"deployments">) => {
		const target = deployments.find((deployment) => deployment._id === deploymentId);

		if (!target) return false;

		const current = deployments.find((deployment) => deployment.active);

		if (!current) {
			consumeError(new Error("No active deployment to roll back."));

			return false;
		}

		try {
			const { newDeployment, prevDeployment } = await db.action(api.actions.deployments.rollbackDeployment, {
				rollbackTo: deploymentId,
				currentDeploymentId: current._id,
			});

			syncDeploymentCache(prevDeployment, false);
			syncDeploymentCache(newDeployment, true);

			return true;
		} catch (error) {
			consumeError(error);

			return false;
		}
	};

	return {
		deployments,
		activeDeployment,
		activeDeployments,

		cursor,
		status: cursor.status,

		loadDeployments,

		deployVersion,
		rollbackDeployment,

		loadMoreRef: ref,
		hasMore: !!cursor.next,
		hasDeployments: deployments.length > 0,
	};
}
