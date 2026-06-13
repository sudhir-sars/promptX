"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type TeamsStore = {
  teamsById: Record<Id<"teams">, Doc<"teams">>;

  teamIds: Id<"teams">[];

  cursor: CursorState;

  cache(teams: Doc<"teams">[]): void;

  remove(ids: Id<"teams">[]): void;

  update(id: Id<"teams">, partial: Partial<Doc<"teams">>): void;

  setCursor(cursor: CursorState): void;

  reset(): void;
};

export const useTeamsStore = create<TeamsStore>((set) => ({
  teamsById: {},

  teamIds: [],

  cursor: {
    next: null,
    status: "uninitialized",
  },

  cache(teams) {
    set((state) => ({
      teamsById: {
        ...state.teamsById,

        ...Object.fromEntries(teams.map((team) => [team._id, team])),
      },

      teamIds: [...new Set([...state.teamIds, ...teams.map((team) => team._id)])],
    }));
  },

  remove(ids) {
    set((state) => {
      const teamsById = { ...state.teamsById };
      for (const id of ids) {
        delete teamsById[id];
      }

      return {
        teamsById,

        teamIds: state.teamIds.filter((id) => !ids.includes(id)),
      };
    });
  },

  update(id, partial) {
    set((state) => {
      const team = state.teamsById[id];
      if (!team) return state;

      return {
        teamsById: {
          ...state.teamsById,

          [id]: { ...team, ...partial },
        },
      };
    });
  },

  setCursor(cursor) {
    set({ cursor });
  },

  reset() {
    set({
      teamsById: {},

      teamIds: [],

      cursor: {
        next: null,
        status: "uninitialized",
      },
    });
  },
}));
