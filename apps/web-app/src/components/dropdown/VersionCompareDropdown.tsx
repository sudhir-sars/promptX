"use client";

import { Button } from "@/components/ui/button";
import { CompareIcon } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { Version } from "@/convex/types";
import { useVersions } from "@/hooks/use-versions";

type Props = {
	selectedVersion: Version | null;
	onSelect: (version: Version | null) => void;
};

export function VersionCompareDropdown({ selectedVersion, onSelect }: Props) {
	const { versions } = useVersions();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon" className={selectedVersion ? "border-foreground/30" : undefined}>
					<CompareIcon className="size-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				sideOffset={8}
				className="w-auto max-w-72 overflow-hidden rounded-[22px] bg-background/80 p-0 backdrop-blur-2xl"
			>
				<div className="max-h-80 overflow-y-auto p-1 no-scrollbar">
					{versions.map((v) => {
						if (!v) {
							return null;
						}

						return (
							<Button
								key={v._id}
								variant="ghost"
								onClick={() => onSelect(v)}
								className="h-10 w-full justify-start rounded-full border border-transparent px-3 text-[12.5px] font-normal hover:border-border"
							>
								<span className="truncate">
									v{v.sequence}
									{v.tag ? ` · ${v.tag}` : ""}
								</span>
							</Button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
