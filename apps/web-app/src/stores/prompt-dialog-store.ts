import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

export type PromptDialogMode = "create" | "edit";

type PromptDialogStore = {
  isOpen: boolean;

  mode: PromptDialogMode;

  promptId: string | undefined;

  name: string;
  description: string;

  openCreate: () => void;

  openEdit: (promptId: Id<"prompts">, name: string, description?: string) => void;

  setOpen: (open: boolean) => void;

  setName: (name: string) => void;

  setDescription: (description: string) => void;

  reset: () => void;
};

const initialState = {
  isOpen: false,

  mode: "create" as PromptDialogMode,

  promptId: undefined,

  name: "",
  description: "",
};

export const usePromptDialogStore = create<PromptDialogStore>((set) => ({
  ...initialState,

  openCreate: () =>
    set({
      isOpen: true,

      mode: "create",

      promptId: undefined,

      name: "",
      description: "",
    }),

  openEdit: (promptId, name, description) =>
    set({
      isOpen: true,

      mode: "edit",

      promptId,

      name,

      description: description ?? "",
    }),

  setOpen: (open) =>
    set({
      isOpen: open,
    }),

  setName: (name) =>
    set({
      name,
    }),

  setDescription: (description) =>
    set({
      description,
    }),

  reset: () => set(initialState),
}));
