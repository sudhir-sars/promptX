"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type ActivitiesStore = {
	activitiesById: Record<Id<"auditLogs">, Doc<"auditLogs">>;

	activityIdsByTeam: Record<Id<"teams">, Id<"auditLogs">[]>;

	cursorByTeam: Record<Id<"teams">, CursorState>;

	cache(teamId: Id<"teams">, activities: Doc<"auditLogs">[]): void;

	setCursor(teamId: Id<"teams">, cursor: CursorState): void;

	removeByScope(teamId: Id<"teams">): void;

	reset(): void;
};

export const useActivitiesStore = create<ActivitiesStore>((set) => ({
	activitiesById: {},

	activityIdsByTeam: {},

	cursorByTeam: {},

	cache(teamId, activities) {
		set((state) => ({
			activitiesById: {
				...state.activitiesById,

				...Object.fromEntries(activities.map((activity) => [activity._id, activity])),
			},

			activityIdsByTeam: {
				...state.activityIdsByTeam,

				[teamId]: [
					...(state.activityIdsByTeam[teamId] ?? []),

					...activities.map((activity) => activity._id),
				],
			},
		}));
	},

	setCursor(teamId, cursor) {
		set((state) => ({
			cursorByTeam: {
				...state.cursorByTeam,

				[teamId]: cursor,
			},
		}));
	},

	removeByScope(teamId) {
		set((state) => {
			const activityIds = state.activityIdsByTeam[teamId] ?? [];

			const activitiesById = { ...state.activitiesById };
			for (const id of activityIds) {
				delete activitiesById[id];
			}

			const activityIdsByTeam = { ...state.activityIdsByTeam };
			const cursorByTeam = { ...state.cursorByTeam };
			delete activityIdsByTeam[teamId];
			delete cursorByTeam[teamId];

			return { activitiesById, activityIdsByTeam, cursorByTeam };
		});
	},

	reset() {
		set({
			activitiesById: {},

			activityIdsByTeam: {},

			cursorByTeam: {},
		});
	},
}));
