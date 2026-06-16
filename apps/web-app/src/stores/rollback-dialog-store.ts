"use client";

import { create } from "zustand";

type RollbackDialogStore = {
	isOpen: boolean;

	open(): void;

	close(): void;
};

export const useRollbackDialogStore = create<RollbackDialogStore>((set) => ({
	isOpen: false,

	open: () => set({ isOpen: true }),

	close: () => set({ isOpen: false }),
}));
