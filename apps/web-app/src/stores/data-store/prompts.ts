"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import type { CursorState } from "@/types";

type PromptsStore = {
  promptsById: Record<Id<"prompts">, Doc<"prompts">>;

  promptIdsByTeam: Record<Id<"teams">, Id<"prompts">[]>;

  cursorByTeam: Record<Id<"teams">, CursorState>;

  cache(teamId: Id<"teams">, prompts: Doc<"prompts">[]): void;

  remove(teamId: Id<"teams">, ids: Id<"prompts">[]): void;

  update(id: Id<"prompts">, partial: Partial<Doc<"prompts">>): void;

  setCursor(teamId: Id<"teams">, cursor: CursorState): void;

  removeByScope(teamId: Id<"teams">): void;

  reset(): void;
};

export const usePromptsStore = create<PromptsStore>((set) => ({
  promptsById: {},

  promptIdsByTeam: {},

  cursorByTeam: {},

  cache(teamId, prompts) {
    set((state) => ({
      promptsById: {
        ...state.promptsById,

        ...Object.fromEntries(prompts.map((prompt) => [prompt._id, prompt])),
      },

      promptIdsByTeam: {
        ...state.promptIdsByTeam,

        [teamId]: [
          ...(state.promptIdsByTeam[teamId] ?? []),

          ...prompts
            .filter((p) => !(state.promptIdsByTeam[teamId] ?? []).includes(p._id))
            .map((p) => p._id),
        ],
      },
    }));
  },

  remove(teamId, ids) {
    set((state) => {
      const promptsById = { ...state.promptsById };
      for (const id of ids) {
        delete promptsById[id];
      }

      return {
        promptsById,

        promptIdsByTeam: {
          ...state.promptIdsByTeam,

          [teamId]: (state.promptIdsByTeam[teamId] ?? []).filter((id) => !ids.includes(id)),
        },
      };
    });
  },

  update(id, partial) {
    set((state) => {
      const prompt = state.promptsById[id];
      if (!prompt) return state;

      return {
        promptsById: {
          ...state.promptsById,

          [id]: { ...prompt, ...partial },
        },
      };
    });
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
      const promptIds = state.promptIdsByTeam[teamId] ?? [];

      const promptsById = { ...state.promptsById };
      for (const id of promptIds) {
        delete promptsById[id];
      }

      const promptIdsByTeam = { ...state.promptIdsByTeam };
      const cursorByTeam = { ...state.cursorByTeam };
      delete promptIdsByTeam[teamId];
      delete cursorByTeam[teamId];

      return { promptsById, promptIdsByTeam, cursorByTeam };
    });
  },

  reset() {
    set({
      promptsById: {},

      promptIdsByTeam: {},

      cursorByTeam: {},
    });
  },
}));
