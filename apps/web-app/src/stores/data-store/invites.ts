"use client";

import { create } from "zustand";

import type { Doc, Id } from "@/convex/_generated/dataModel";

import { CursorState } from "@/types";

type InvitesStore = {
    invitesById: Record<Id<"invites">, Doc<"invites">>;

    inviteIdsByTeam: Record<Id<"teams">, Id<"invites">[]>;

    cursorByTeam: Record<Id<"teams">, CursorState>;

    cache(teamId: Id<"teams">, invites: Doc<"invites">[]): void;

    remove(teamId: Id<"teams">, ids: Id<"invites">[]): void;

    setCursor(teamId: Id<"teams">, cursor: CursorState): void;

    removeByScope(teamId: Id<"teams">): void;

    reset(): void;
};

export const useInvitesStore = create<InvitesStore>((set) => ({
    invitesById: {},

    inviteIdsByTeam: {},

    cursorByTeam: {},

    cache(teamId, invites) {
        set((state) => ({
            invitesById: {
                ...state.invitesById,

                ...Object.fromEntries(invites.map((invite) => [invite._id, invite])),
            },

            inviteIdsByTeam: {
                ...state.inviteIdsByTeam,

                [teamId]: [
                    ...invites.map((invite) => invite._id),

                    ...(state.inviteIdsByTeam[teamId] ?? []).filter(
                        (id) => !invites.some((invite) => invite._id === id),
                    ),
                ],
            },
        }));
    },

    remove(teamId, ids) {
        set((state) => {
            const invitesById = { ...state.invitesById };
            for (const id of ids) {
                delete invitesById[id];
            }

            return {
                invitesById,

                inviteIdsByTeam: {
                    ...state.inviteIdsByTeam,

                    [teamId]: (state.inviteIdsByTeam[teamId] ?? []).filter(
                        (id) => !ids.includes(id),
                    ),
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
            const inviteIds = state.inviteIdsByTeam[teamId] ?? [];

            const invitesById = { ...state.invitesById };
            for (const id of inviteIds) {
                delete invitesById[id];
            }

            const inviteIdsByTeam = { ...state.inviteIdsByTeam };
            const cursorByTeam = { ...state.cursorByTeam };
            delete inviteIdsByTeam[teamId];
            delete cursorByTeam[teamId];

            return { invitesById, inviteIdsByTeam, cursorByTeam };
        });
    },

    reset() {
        set({
            invitesById: {},

            inviteIdsByTeam: {},

            cursorByTeam: {},
        });
    },
}));
