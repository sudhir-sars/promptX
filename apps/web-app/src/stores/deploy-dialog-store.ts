"use client";

import { create } from "zustand";

import type { Doc } from "@/convex/_generated/dataModel";

type DeployDialogStore = {
	isOpen: boolean;

	version: Doc<"versions"> | null;

	open(version: Doc<"versions">): void;

	close(): void;
};

const initialState = {
	isOpen: false,
	version: null,
};

export const useDeployDialogStore = create<DeployDialogStore>((set) => ({
	...initialState,

	open: (version) =>
		set({
			isOpen: true,
			version,
		}),

	close: () => set(initialState),
}));
