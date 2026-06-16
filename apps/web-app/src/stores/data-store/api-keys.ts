"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type ApiKeysStore = {
	apiKeysById: Record<Id<"apiKeys">, Doc<"apiKeys">>;

	apiKeyIds: Id<"apiKeys">[];

	cursor: CursorState;

	cache(apiKeys: Doc<"apiKeys">[]): void;

	update(id: Id<"apiKeys">, partial: Partial<Doc<"apiKeys">>): void;

	setCursor(cursor: CursorState): void;

	reset(): void;
};

export const useApiKeysStore = create<ApiKeysStore>((set) => ({
	apiKeysById: {},

	apiKeyIds: [],

	cursor: {
		next: null,
		status: "uninitialized",
	},

	cache(apiKeys) {
		set((state) => ({
			apiKeysById: {
				...state.apiKeysById,

				...Object.fromEntries(apiKeys.map((key) => [key._id, key])),
			},

			apiKeyIds: [...new Set([...apiKeys.map((key) => key._id), ...state.apiKeyIds])],
		}));
	},

	update(id, partial) {
		set((state) => {
			const apiKey = state.apiKeysById[id];
			if (!apiKey) return state;

			return {
				apiKeysById: {
					...state.apiKeysById,

					[id]: { ...apiKey, ...partial },
				},
			};
		});
	},

	setCursor(cursor) {
		set({ cursor });
	},

	reset() {
		set({
			apiKeysById: {},
			apiKeyIds: [],
			cursor: {
				next: null,
				status: "uninitialized",
			},
		});
	},
}));
