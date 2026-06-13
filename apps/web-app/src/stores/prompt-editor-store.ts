// stores/studio-store.ts

"use client";

import { create } from "zustand";

import type { Id } from "@/convex/_generated/dataModel";

type StudioStore = {
  selectedVersion: Id<"versions"> | undefined;
  setSelectedVersion: (versionId: Id<"versions">) => void;
};

export const useStudioStore = create<StudioStore>((set) => ({
  selectedVersion: undefined,

  setSelectedVersion: (versionId) =>
    set({
      selectedVersion: versionId,
    }),
}));
