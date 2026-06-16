"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type VersionsStore = {
	versionsById: Record<Id<"versions">, Doc<"versions">>;

	versionIdsByPrompt: Record<Id<"prompts">, Id<"versions">[]>;

	cursorByPrompt: Record<Id<"prompts">, CursorState>;

	cache(promptId: Id<"prompts">, versions: Doc<"versions">[]): void;

	update(id: Id<"versions">, partial: Partial<Doc<"versions">>): void;

	setCursor(promptId: Id<"prompts">, cursor: CursorState): void;

	removeByScope(promptId: Id<"prompts">): void;

	reset(): void;
};

export const useVersionsStore = create<VersionsStore>((set) => ({
	versionsById: {},

	versionIdsByPrompt: {},

	cursorByPrompt: {},

	cache(promptId, versions) {
		set((state) => ({
			versionsById: {
				...state.versionsById,

				...Object.fromEntries(versions.map((version) => [version._id, version])),
			},

			versionIdsByPrompt: {
				...state.versionIdsByPrompt,

				[promptId]: [
					...(state.versionIdsByPrompt[promptId] ?? []),

					...versions.filter((v) => !(state.versionIdsByPrompt[promptId] ?? []).includes(v._id)).map((v) => v._id),
				],
			},
		}));
	},

	update(id, partial) {
		set((state) => {
			const version = state.versionsById[id];
			if (!version) return state;

			return {
				versionsById: {
					...state.versionsById,

					[id]: { ...version, ...partial },
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
			const versionIds = state.versionIdsByPrompt[promptId] ?? [];

			const versionsById = { ...state.versionsById };
			for (const id of versionIds) {
				delete versionsById[id];
			}

			const versionIdsByPrompt = { ...state.versionIdsByPrompt };
			const cursorByPrompt = { ...state.cursorByPrompt };
			delete versionIdsByPrompt[promptId];
			delete cursorByPrompt[promptId];

			return { versionsById, versionIdsByPrompt, cursorByPrompt };
		});
	},

	reset() {
		set({
			versionsById: {},

			versionIdsByPrompt: {},

			cursorByPrompt: {},
		});
	},
}));
