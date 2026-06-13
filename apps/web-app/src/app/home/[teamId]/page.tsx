"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon } from "@/components/ui/icons";
import { LoadingState } from "@/components/ui/loading-state";

import { usePrompts } from "@/hooks/use-prompt";
import { getRelativeTime } from "@/lib/date";
import { usePromptDialogStore } from "@/stores/prompt-dialog-store";

export default function PromptsPage() {
  const { prompts, status, cursor, loadMoreRef, hasPrompts } = usePrompts();
  const openCreate = usePromptDialogStore((state) => state.openCreate);

  if (!hasPrompts && (status === "uninitialized" || status === "loading")) {
    return <LoadingState variant="prompt" />;
  }

  if (!hasPrompts && (status === "loaded" || status === "exhausted" || status === "error")) {
    return <EmptyState variant="prompt" action={() => openCreate()} />;
  }

  return (
    <div className="h-full flex-1 space-y-7  overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
      <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Prompts</h1>
            <p className="text-sm text-muted-foreground">Build and manage prompts</p>
          </div>

          <Button variant="outline" onClick={() => openCreate()} className="h-9 shrink-0">
            <PlusIcon className="size-4" />
            <span>Add Prompt</span>
          </Button>
        </div>

        {/* List */}
        <div className="h-full max-h-[75vh]  flex-1 overflow-hidden border-y">
          <div className="h-full overflow-y-auto no-scrollbar text-sm">
            <div>
              {prompts.map((prompt) => {
                if (!prompt) return null;

                return (
                  <Link
                    key={prompt._id}
                    prefetch={true}
                    href={`/home/${prompt.teamId}/${prompt._id}`}
                    className="block border-b transition-colors hover:bg-muted/40"
                  >
                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4">
                      <div className="min-w-0">
                        <p className="truncate ">{prompt.name}</p>
                      </div>

                      <div className="text-xs tabular-nums text-muted-foreground">
                        {getRelativeTime(prompt._creationTime)}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {(status === "loaded" || status === "loading-more") && cursor.next && (
                <div ref={loadMoreRef} className="py-6 text-center text-xs text-muted-foreground">
                  {status === "loading-more" ? "Loading..." : "Scroll for more"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
