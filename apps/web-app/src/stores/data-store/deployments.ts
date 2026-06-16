"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type DeploymentsStore = {
	deploymentsById: Record<Id<"deployments">, Doc<"deployments">>;

	deploymentIdsByPrompt: Record<Id<"prompts">, Id<"deployments">[]>;

	cursorByPrompt: Record<Id<"prompts">, CursorState>;

	cache(promptId: Id<"prompts">, deployments: Doc<"deployments">[]): void;

	update(id: Id<"deployments">, partial: Partial<Doc<"deployments">>): void;

	setCursor(promptId: Id<"prompts">, cursor: CursorState): void;

	removeByScope(promptId: Id<"prompts">): void;

	reset(): void;
};

export const useDeploymentsStore = create<DeploymentsStore>((set) => ({
	deploymentsById: {},

	deploymentIdsByPrompt: {},

	cursorByPrompt: {},

	cache(promptId, deployments) {
		set((state) => ({
			deploymentsById: {
				...state.deploymentsById,

				...Object.fromEntries(deployments.map((d) => [d._id, d])),
			},

			deploymentIdsByPrompt: {
				...state.deploymentIdsByPrompt,

				[promptId]: [
					...deployments.map((d) => d._id),

					...(state.deploymentIdsByPrompt[promptId] ?? []).filter((id) => !deployments.some((d) => d._id === id)),
				],
			},
		}));
	},

	update(id, partial) {
		set((state) => {
			const deployment = state.deploymentsById[id];
			if (!deployment) return state;

			return {
				deploymentsById: {
					...state.deploymentsById,

					[id]: { ...deployment, ...partial },
				},
			};
		});
	},

	setCursor(promptId, cursor) {
		set((state) => ({
			cursorByPrompt: {
				...state.cursorByPrompt,

				[promptId]: cursor,
			},
		}));
	},

	removeByScope(promptId) {
		set((state) => {
			const deploymentIds = state.deploymentIdsByPrompt[promptId] ?? [];

			const deploymentsById = { ...state.deploymentsById };
			for (const id of deploymentIds) {
				delete deploymentsById[id];
			}

			const deploymentIdsByPrompt = { ...state.deploymentIdsByPrompt };
			const cursorByPrompt = { ...state.cursorByPrompt };
			delete deploymentIdsByPrompt[promptId];
			delete cursorByPrompt[promptId];

			return { deploymentsById, deploymentIdsByPrompt, cursorByPrompt };
		});
	},

	reset() {
		set({
			deploymentsById: {},

			deploymentIdsByPrompt: {},

			cursorByPrompt: {},
		});
	},
}));
