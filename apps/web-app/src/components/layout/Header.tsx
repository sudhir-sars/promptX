"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon, VersionsIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/stores/navigation-store";
import { TeamSwitcher } from "../dropdown/teams";
import { SearchBar } from "./search/Searchbar";

export function Header() {
	const navigate = useNavigationStore((s) => s.navigate);
	const desktop = useNavigationStore((s) => s.desktop);
	const leftSidebarOpen = useNavigationStore((s) => s.leftSidebarOpen);
	const rightSidebarOpen = useNavigationStore((s) => s.rightSidebarOpen);

	return (
		<header className="fixed top-0 z-30  h-14 w-full lg:px-10">
			{desktop ? (
				<div className={cn("absolute left-10 top-1/2 z-10 h-9 w-[180px] -translate-y-1/2")}>
					<TeamSwitcher />
				</div>
			) : (
				<div className={"absolute left-4 top-1/2 z-20 -translate-y-1/2"}>
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							navigate({
								leftSidebarOpen: !leftSidebarOpen,
							})
						}
					>
						<MenuIcon />
					</Button>
				</div>
			)}

			{desktop ? (
				<div className="absolute left-1/2 top-1/2 h-8.5 w-[500px] -translate-x-1/2 -translate-y-1/2">
					<SearchBar />
				</div>
			) : (
				<div className="absolute -right-5 space-x-2  top-1/2 -translate-y-1/2 -translate-x-1/2">
					<SearchBar mode="compact" />
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							navigate({
								rightSidebarOpen: !rightSidebarOpen,
							})
						}
					>
						<VersionsIcon className="rotate-180" />
					</Button>
				</div>
			)}
		</header>
	);
}
