"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDeployments } from "@/hooks/use-deployments";
import { useVersions } from "@/hooks/use-versions";
import { getRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/stores/prompt-editor-store";
import { useVersionTagDialogStore } from "@/stores/version-tag-dialog-store";

const LIVE_BADGE = "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
const LIVE_DOT = "bg-emerald-500";
const LIVE_GLOW = "border border-emerald-500 bg-emerald-500";
const LIVE_RING = "ring-2 ring-emerald-500/30";

export function VersionSidebarContent() {
	const { versions, version } = useVersions();
	const { activeDeployments } = useDeployments();

	const setSelectedVersion = useStudioStore((state) => state.setSelectedVersion);
	const openTagDialog = useVersionTagDialogStore((state) => state.open);

	// Versions that are part of the active (live) deployment.
	const deployedVersionIds = useMemo(() => {
		const ids = new Set<string>();

		for (const deployment of activeDeployments) {
			for (const config of deployment.config) {
				ids.add(config.versionId);
			}
		}

		return ids;
	}, [activeDeployments]);

	return (
		<div className="space-y-8">
			{versions.map((item) => {
				if (!item) {
					return null;
				}

				const isSelected = item._id === version?._id;
				const isDraft = item.draft;

				const isDeployed = deployedVersionIds.has(item._id);

				// "draft" is an internal sentinel carried by promoted versions, not a user tag.
				const userTag = !isDraft && item.tag && item.tag !== "draft" ? item.tag : null;

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

								!isDraft && !isSelected && !isDeployed && "border border-border bg-transparent",

								!isDraft && isSelected && !isDeployed && "border border-foreground bg-foreground",

								!isDraft && isDeployed && LIVE_GLOW,

								!isDraft && isSelected && isDeployed && LIVE_RING,
							)}
						/>

						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<p
										className={cn(
											"text-sm transition-colors",
											isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
										)}
									>
										{isDraft ? "Draft" : `v${item.sequence}`}
									</p>

									{isDeployed && (
										<span
											className={cn(
												"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
												LIVE_BADGE,
											)}
										>
											<span className={cn("size-1.5 rounded-full", LIVE_DOT)} />
											Live
										</span>
									)}

									{userTag && (
										<span className="inline-flex max-w-[8rem] items-center truncate rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">
											{userTag}
										</span>
									)}
								</div>

								<p className="mt-1 text-xs text-muted-foreground">
									{isDraft ? "Editable workspace" : getRelativeTime(item._creationTime)}
								</p>
							</div>

							{!isDraft && (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										openTagDialog(item);
									}}
									className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
								>
									{userTag ? "Edit" : "Add Tag"}
								</button>
							)}
						</div>
					</Link>
				);
			})}
		</div>
	);
}
