"use client";

import { useMemo } from "react";

import { getRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/stores/prompt-editor-store";
import { useVersions } from "@/hooks/use-versions";
import { useDeployments } from "@/hooks/use-deployments";
import Link from "next/link";

export function VersionSidebarContent() {
    const { versions, version } = useVersions();
    const { activeDeployment } = useDeployments();

    const setSelectedVersion = useStudioStore((state) => state.setSelectedVersion);

    const deployedVersionIds = useMemo(
        () => new Set(activeDeployment?.config.map((item) => item.versionId)),
        [activeDeployment],
    );

    return (
        <div className="space-y-8">
            {versions.map((item) => {
                const isSelected = item._id === version?._id;
                const isDraft = item.draft;
                const isDeployed = deployedVersionIds.has(item._id);

                return (
                    <Link
                        href={`/home/${version?.teamId}/${version?.promptId}`}
                        key={item._id}
                        type="button"
                        onClick={() => setSelectedVersion(item._id)}
                        className="group relative block w-full pl-8 text-left"
                    >
                        <div
                            className={cn(
                                "absolute left-[5.5px] top-[6px] h-[11px] w-[11px]",
                                isDraft && "rotate-45 border border-foreground bg-background",
                                isDraft && isSelected && "bg-foreground",

                                !isDraft && "rounded-full",

                                !isDraft &&
                                    !isSelected &&
                                    !isDeployed &&
                                    "border border-border bg-transparent",

                                !isDraft &&
                                    isSelected &&
                                    !isDeployed &&
                                    "border border-foreground bg-foreground",

                                !isDraft &&
                                    !isSelected &&
                                    isDeployed &&
                                    "border border-blue-500 bg-blue-500",

                                !isDraft &&
                                    isSelected &&
                                    isDeployed &&
                                    "border-blue-500 bg-blue-500 ring-2 ring-blue-500/30",
                            )}
                        />

                        <div>
                            <p
                                className={cn(
                                    "text-sm transition-colors",
                                    isSelected
                                        ? "text-foreground"
                                        : "text-muted-foreground group-hover:text-foreground",
                                )}
                            >
                                {isDraft ? "Draft" : `v${item.sequence}`}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {isDraft
                                    ? "Editable workspace"
                                    : getRelativeTime(item._creationTime)}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
