"use client";

import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";

import { useNavigationStore } from "@/stores/navigation-store";

import { ResourceSidebarContent } from "./resources";
import { VersionSidebarContent } from "./versions";

export function RightSidebar() {
  const lgDesktop = useNavigationStore((state) => state.xlDesktop);
  const rightSidebarOpen = useNavigationStore((state) => state.rightSidebarOpen);
  const navigate = useNavigationStore((state) => state.navigate);
  const promptId = useNavigationStore((state) => state.promptId);

  const isPromptView = Boolean(promptId);

  const Content = isPromptView ? VersionSidebarContent : ResourceSidebarContent;

  const sidebarClasses = lgDesktop
    ? "relative shrink-0 w-72"
    : `fixed inset-y-0 right-0 z-50 w-72 transition-transform duration-300 ${
        rightSidebarOpen ? "translate-x-0" : "translate-x-full"
      }`;

  return (
    <>
      {!lgDesktop && rightSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => navigate({ rightSidebarOpen: false })}
        />
      )}

      <aside className={`${sidebarClasses} overflow-hidden bg-background`}>
        {!lgDesktop && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 top-4 z-[120]"
            onClick={() => navigate({ rightSidebarOpen: false })}
          >
            <CloseIcon />
          </Button>
        )}

        <div className="absolute bottom-[5vh] left-0 top-[5vh] w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        <div
          className="h-screen"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="h-full overflow-y-auto px-10 py-[20vh] no-scrollbar">
            <Content />
          </div>
        </div>
      </aside>
    </>
  );
}
