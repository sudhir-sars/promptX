"use client";

import { create } from "zustand";

import { Member } from "@/convex/types";
import type { Id } from "@/convex/_generated/dataModel";

import { CursorState } from "@/types";

type MembersStore = {
    membersById: Record<Id<"members">, Member>;

    memberIdsByTeam: Record<Id<"teams">, Id<"members">[]>;

    cursorByTeam: Record<Id<"teams">, CursorState>;

    cache(teamId: Id<"teams">, members: Member[]): void;

    remove(teamId: Id<"teams">, ids: Id<"members">[]): void;

    update(id: Id<"members">, partial: Partial<Member>): void;

    setCursor(teamId: Id<"teams">, cursor: CursorState): void;

    removeByScope(teamId: Id<"teams">): void;

    reset(): void;
};

export const useMembersStore = create<MembersStore>((set) => ({
    membersById: {},

    memberIdsByTeam: {},

    cursorByTeam: {},

    cache(teamId, members) {
        set((state) => ({
            membersById: {
                ...state.membersById,

                ...Object.fromEntries(members.map((member) => [member._id, member])),
            },

            memberIdsByTeam: {
                ...state.memberIdsByTeam,

                [teamId]: [
                    ...(state.memberIdsByTeam[teamId] ?? []),

                    ...members.map((member) => member._id),
                ],
            },
        }));
    },

    remove(teamId, ids) {
        set((state) => {
            const membersById = { ...state.membersById };
            for (const id of ids) {
                delete membersById[id];
            }

            return {
                membersById,

                memberIdsByTeam: {
                    ...state.memberIdsByTeam,

                    [teamId]: (state.memberIdsByTeam[teamId] ?? []).filter(
                        (id) => !ids.includes(id),
                    ),
                },
            };
        });
    },

    update(id, partial) {
        set((state) => {
            const member = state.membersById[id];
            if (!member) return state;

            return {
                membersById: {
                    ...state.membersById,

                    [id]: { ...member, ...partial },
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
            const memberIds = state.memberIdsByTeam[teamId] ?? [];

            const membersById = { ...state.membersById };
            for (const id of memberIds) {
                delete membersById[id];
            }

            const memberIdsByTeam = { ...state.memberIdsByTeam };
            const cursorByTeam = { ...state.cursorByTeam };
            delete memberIdsByTeam[teamId];
            delete cursorByTeam[teamId];

            return { membersById, memberIdsByTeam, cursorByTeam };
        });
    },

    reset() {
        set({
            membersById: {},

            memberIdsByTeam: {},

            cursorByTeam: {},
        });
    },
}));
