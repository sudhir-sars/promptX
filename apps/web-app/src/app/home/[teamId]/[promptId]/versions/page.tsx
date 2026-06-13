// app/home/[projectId]/[promptId]/versions/page.tsx

"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useDeployments } from "@/hooks/use-deployments";

import { useVersions } from "@/hooks/use-versions";
import { getRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/stores/navigation-store";

export default function VersionsPage() {
  const { versions, setSelectedVersion, status, hasMore, loadMoreRef } = useVersions();
  const { activeDeployment } = useDeployments();

  const promptId = useNavigationStore((state) => state.promptId);

  if (!promptId) return null;

  if (status === "error") {
    return <ErrorState message="Failed to load versions." />;
  }

  if (status === "loaded" && versions.length === 0) {
    return <EmptyState variant="version" />;
  }
  return (
    <div className="h-full flex-1 space-y-7  overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
      <div className="shrink-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Versions</h1>

        <p className="mt-1 text-sm text-muted-foreground">Browse and manage prompt versions.</p>
      </div>

      <div className=" flex-1 py-10">
        {versions.map((version) => {
          if (!version) return null;

          return (
            <Link
              key={version._id}
              href={`/home/${version.teamId}/${version.promptId}`}
              onClick={() => setSelectedVersion(version._id)}
              className={cn("block border-b px-4 py-4 transition-colors hover:bg-muted/50 sm:px-6")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap min-w-0 items-center gap-2">
                  <span className="inline-flex shrink-0 items-center rounded-full border px-4 py-1 text-xs font-medium">
                    v{version.sequence}
                  </span>

                  <span className="truncate text-xs font-medium rounded-full border px-2 py-1">
                    {version.tag || "Untitled"}
                  </span>
                  {activeDeployment?.config.some((dep) => dep.versionId === version._id) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  )}
                </div>

                <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                  {getRelativeTime(version._creationTime)}
                </span>
              </div>
            </Link>
          );
        })}

        {(status === "loaded" || status === "loading-more") && hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-4 text-sm text-muted-foreground">
            {status === "loading-more" ? "Loading more versions..." : "Scroll for more"}
          </div>
        )}

        {status === "loading" && versions.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading versions...</div>
        )}
      </div>
    </div>
  );
}
