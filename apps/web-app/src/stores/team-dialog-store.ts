import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

export type TeamDialogMode = "create" | "edit";

type TeamDialogStore = {
  isOpen: boolean;

  mode: TeamDialogMode;

  teamId: Id<"teams"> | undefined;

  name: string;

  openCreate: () => void;

  openEdit: (teamId: Id<"teams">, name: string) => void;

  setOpen: (open: boolean) => void;

  setName: (name: string) => void;

  reset: () => void;
};

const initialState = {
  isOpen: false,

  mode: "create" as TeamDialogMode,

  teamId: undefined,

  name: "",
};

export const useTeamDialogStore = create<TeamDialogStore>((set) => ({
  ...initialState,

  openCreate: () =>
    set({
      isOpen: true,

      mode: "create",

      teamId: undefined,

      name: "",
    }),

  openEdit: (teamId, name) =>
    set({
      isOpen: true,

      mode: "edit",

      teamId,

      name,
    }),

  setOpen: (open) =>
    set({
      isOpen: open,
    }),

  setName: (name) =>
    set({
      name,
    }),

  reset: () => set(initialState),
}));
