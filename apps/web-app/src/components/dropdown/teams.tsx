"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BuildingIcon, ChevronRightIcon, PlusIcon } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useTeams } from "@/hooks/use-team";
import { useNavigationStore } from "@/stores/navigation-store";
import { useTeamDialogStore } from "@/stores/team-dialog-store";

interface TeamSwitcherProps {
	showCreateButton?: boolean;
}

export function TeamSwitcher({ showCreateButton = true }: TeamSwitcherProps) {
	const router = useRouter();

	const openCreate = useTeamDialogStore((state) => state.openCreate);
	const navigate = useNavigationStore((state) => state.navigate);
	const teamId = useNavigationStore((state) => state.teamId);

	const { teams, team, status, hasMore, loadMoreRef } = useTeams();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="group justify-between relative h-9 w-full rounded-full bg-foreground/5 px-4 font-normal backdrop-blur-2xl hover:bg-foreground/10"
				>
					<div className="flex min-w-0 items-center gap-2">
						<BuildingIcon animate={false} className="size-4 shrink-0" />
						<span className="truncate text-[12.5px]">{team?.name ?? "Select Team"}</span>
					</div>

					<ChevronRightIcon animate={false} className="size-4 shrink-0 opacity-60" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				sideOffset={6}
				className="w-[230px] rounded-[22px] bg-background/80 p-0 backdrop-blur-2xl gap-0"
			>
				<div className="max-h-[240px] overflow-y-auto p-1 no-scrollbar">
					{status === "uninitialized" || (status === "loading" && teams.length === 0) ? (
						<div className="py-10 text-center">
							<p className="text-sm text-muted-foreground">Loading teams...</p>
						</div>
					) : teams.length === 0 && (status === "loaded" || status === "exhausted" || status === "error") ? (
						<EmptyState variant="team" action={openCreate} mode="compact" />
					) : (
						<>
							{teams.map((t) => {
								if (!t) {
									return null;
								}

								const active = t._id === teamId;

								return (
									<Button
										key={t._id}
										variant="ghost"
										onClick={() => {
											navigate({ teamId: t._id });
											router.push("/home");
										}}
										className={`group h-9 w-full justify-start rounded-full border border-transparent px-3 text-left text-[12.5px] font-normal transition-colors hover:border-border ${
											active ? "bg-accent" : "hover:bg-accent"
										}`}
									>
										<span className="flex min-w-0 items-center gap-2">
											<BuildingIcon
												animate={false}
												size={20}
												strokeWidth={1.9}
												className={`shrink-0 ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
											/>
											<span className="truncate">{t.name}</span>
										</span>
									</Button>
								);
							})}

							{(status === "loaded" || status === "loading-more") && hasMore && (
								<div ref={loadMoreRef} className="py-2 text-center text-[11px] text-muted-foreground">
									{status === "loading-more" ? "Loading..." : ""}
								</div>
							)}
						</>
					)}
				</div>

				{showCreateButton && (
					<div className="rounded-b-[22px] border-t bg-background p-1">
						<Button
							variant="ghost"
							onClick={openCreate}
							className="w-full justify-center rounded-full text-[12.5px] font-normal"
						>
							<span className="flex items-center gap-2 pr-5">
								<PlusIcon className="size-4" />
								<span>Create Team</span>
							</span>
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
