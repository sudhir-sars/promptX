"use client";

import { useDeployments } from "@/hooks/use-deployments";
import { getRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";

export default function DeploymentsPage() {
  const { deployments, activeDeployment, status, hasMore, loadMoreRef, rollbackDeployment } =
    useDeployments();

  return (
    <div className="h-full flex-1 space-y-6  overflow-y-auto no-scrollbar px-6 pt-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
      <div className="shrink-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Deployments</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Release versions to production and manage traffic allocation.
        </p>
      </div>

      <div className="rounded-2xl border p-4 sm:rounded-3xl sm:p-6">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              activeDeployment ? "bg-emerald-500" : "bg-muted-foreground/40",
            )}
          />

          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {activeDeployment ? "Live" : "Inactive"}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {activeDeployment
            ? "Serving production traffic."
            : "No versions are currently receiving production traffic."}
        </p>

        {activeDeployment && (
          <div className="mt-5 space-y-4">
            {activeDeployment.config.map((version) => (
              <div key={version.versionId}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="shrink-0 text-sm font-medium">v{version.sequence}</span>

                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{
                        width: `${version.traffic}%`,
                      }}
                    />
                  </div>

                  <span className="shrink-0 text-sm text-muted-foreground">{version.traffic}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 py-10">
        {deployments.map((deployment) => {
          if (!deployment) return null;

          const activate = async () => {
            const confirmed = confirm(
              `Rollback to deployment from ${getRelativeTime(
                deployment._creationTime,
              )}? This will replace the current production deployment.`,
            );

            if (!confirmed) return;

            await rollbackDeployment(deployment._id);
          };

          return (
            <button
              key={deployment._id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void activate();
              }}
              className="block w-full border-b px-4 py-4 text-left transition-colors hover:bg-muted/50 sm:px-6"
            >
              <div className="flex  justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {deployment.config.map((version) => (
                    <span
                      key={version.versionId}
                      className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium"
                    >
                      v{version.sequence}
                      <span className="ml-1 text-muted-foreground">{version.traffic}%</span>
                    </span>
                  ))}
                  {deployment.active && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="ml-auto text-xs text-muted-foreground sm:text-sm">
                    {getRelativeTime(deployment._creationTime)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {(status === "loaded" || status === "loading-more") && hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-4 text-sm text-muted-foreground">
            {status === "loading-more" ? "Loading more deployments..." : "Scroll for more"}
          </div>
        )}

        {status === "loading" && deployments.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading deployments...
          </div>
        )}

        {status === "error" && (
          <div className="py-8 text-center text-sm text-destructive">
            Failed to load deployments.
          </div>
        )}

        {status === "exhausted" && deployments.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No deployments found.
          </div>
        )}
      </div>
    </div>
  );
}
