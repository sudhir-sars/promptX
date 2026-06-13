"use client";

import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

type NavigationStore = {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;

  desktop: boolean;
  xlDesktop: boolean;

  tab: string | undefined;

  teamId: Id<"teams"> | undefined;
  promptId: Id<"prompts"> | undefined;

  navigate: (navigation: Partial<Omit<NavigationStore, "navigate">>) => void;
  syncDesktop: (desktop: boolean) => void;
  syncXlDesktop: (lgDesktop: boolean) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  leftSidebarOpen: false,
  rightSidebarOpen: false,

  desktop: false,
  xlDesktop: false,

  tab: undefined,

  teamId: undefined,
  promptId: undefined,

  navigate: (navigation) => set(navigation),

  syncDesktop: (desktop) =>
    set(() => ({
      desktop,
      leftSidebarOpen: desktop,
    })),
  syncXlDesktop: (xlDesktop) =>
    set(() => ({
      xlDesktop,
      rightSidebarOpen: xlDesktop,
    })),
}));
