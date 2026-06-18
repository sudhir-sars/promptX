import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

export type PromptDialogMode = "create" | "edit";

type PromptDialogStore = {
	isOpen: boolean;

	mode: PromptDialogMode;

	promptId: string | undefined;

	name: string;

	openCreate: () => void;

	openEdit: (promptId: Id<"prompts">, name: string, description?: string) => void;

	setOpen: (open: boolean) => void;

	setName: (name: string) => void;

	reset: () => void;
};

const initialState = {
	isOpen: false,

	mode: "create" as PromptDialogMode,

	promptId: undefined,

	name: "",
};

export const usePromptDialogStore = create<PromptDialogStore>((set) => ({
	...initialState,

	openCreate: () =>
		set({
			isOpen: true,

			mode: "create",

			promptId: undefined,

			name: "",
		}),

	openEdit: (promptId, name) =>
		set({
			isOpen: true,

			mode: "edit",

			promptId,

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
