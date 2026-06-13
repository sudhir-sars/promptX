"use client";

import { create } from "zustand";

type DocsNavigationStore = {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;

  desktop: boolean;
  xlDesktop: boolean;

  navigate: (
    navigation: Partial<Omit<DocsNavigationStore, "navigate" | "syncDesktop" | "syncXlDesktop">>,
  ) => void;

  syncDesktop: (desktop: boolean) => void;
  syncXlDesktop: (xlDesktop: boolean) => void;
};

export const useDocsNavigationStore = create<DocsNavigationStore>((set) => ({
  leftSidebarOpen: false,
  rightSidebarOpen: false,

  desktop: false,
  xlDesktop: false,

  navigate: (navigation) => set(navigation),

  syncDesktop: (desktop) =>
    set({
      desktop,
      leftSidebarOpen: desktop,
    }),

  syncXlDesktop: (xlDesktop) =>
    set({
      xlDesktop,
      rightSidebarOpen: xlDesktop,
    }),
}));
