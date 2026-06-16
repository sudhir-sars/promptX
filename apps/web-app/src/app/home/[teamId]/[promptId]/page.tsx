"use client";

import { useState } from "react";
import DiffViewer from "react-diff-viewer-continued";
import { VersionCompareDropdown } from "@/components/dropdown/VersionCompareDropdown";
import { Button } from "@/components/ui/button";
import { CloseIcon, CompareIcon, DeployIcon, VersionsIcon } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { useDeployments } from "@/hooks/use-deployments";
import { usePrompts } from "@/hooks/use-prompt";
import { useVersions } from "@/hooks/use-versions";
import { useDeployDialogStore } from "@/stores/deploy-dialog-store";

export default function StudioPage() {
	const { prompt } = usePrompts();
	const { version, createVersion, updateContent } = useVersions();
	const { activeDeployment } = useDeployments();

	const [compareVersion, setCompareVersion] = useState<typeof version | null>(null);

	const openDeployDialog = useDeployDialogStore((state) => state.open);

	if (!prompt || !version) return null;

	const isDraft = version.draft;

	return (
		<div className="h-full flex-1 overflow-y-auto px-6 pt-20 transition-all duration-300 ease-in-out no-scrollbar md:px-10 lg:px-16">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<div className="flex items-center gap-3">
							<h1 className="min-w-0 break-all text-xl font-semibold">{prompt.name}</h1>
						</div>

						<div className="mt-2 flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
								{isDraft ? "Draft" : `v${version.sequence} (read-only)`}
							</span>

							{activeDeployment && (
								<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
									Live v{activeDeployment.config.map((v) => v.sequence).join(", ")}
								</span>
							)}

							{compareVersion && (
								<div className="inline-flex items-center gap-1 rounded-full border border-foreground/50 px-2.5 py-1 text-xs">
									<CompareIcon className="size-3" />

									<span className="text-nowrap">
										Comparing with v{compareVersion.sequence}
										{compareVersion.tag ? ` · ${compareVersion.tag}` : ""}
									</span>

									<button
										type="button"
										onClick={() => setCompareVersion(null)}
										className="ml-1 opacity-60 transition-opacity hover:opacity-100"
									>
										<CloseIcon size={14} />
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="flex shrink-0 items-center gap-2">
						<VersionCompareDropdown selectedVersion={compareVersion} onSelect={setCompareVersion} />

						{isDraft && (
							<Button
								variant="outline"
								onClick={() =>
									createVersion({
										content: version.content,
									})
								}
							>
								<VersionsIcon className="size-4" />
								Version
							</Button>
						)}

						<Button variant="outline" onClick={() => openDeployDialog(version)} disabled={isDraft}>
							<DeployIcon className="size-4" />
							Deploy
						</Button>
					</div>
				</div>

				{compareVersion ? (
					<div className="h-full max-h-[70vh] overflow-scroll rounded-3xl bg-input/50 no-scrollbar">
						<DiffViewer
							oldValue={compareVersion.content}
							newValue={version.content}
							splitView={false}
							showDiffOnly={false}
							hideLineNumbers
							useDarkTheme
							styles={{
								variables: {
									dark: {
										diffViewerBackground: "transparent",
										emptyLineBackground: "rgb(31, 48, 34)",
									},
								},
							}}
						/>
					</div>
				) : (
					<Textarea
						readOnly={!isDraft}
						value={version.content}
						placeholder="Write your prompt..."
						onChange={(e) => updateContent(e.target.value)}
						className="h-[70vh] resize-none border-0 bg-input/50 p-7 text-sm leading-7 shadow-none no-scrollbar focus-visible:ring-0"
					/>
				)}
			</div>
		</div>
	);
}
