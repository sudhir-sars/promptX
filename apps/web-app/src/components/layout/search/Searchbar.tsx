"use client";

import { useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommandKeyIcon, SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";

import { useNavigationStore } from "@/stores/navigation-store";

import { SearchResults } from "./SearchResults";

interface SearchBarProps {
	mode?: "default" | "compact";
}

export function SearchBar({ mode = "default" }: SearchBarProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const teamId = useNavigationStore((state) => state.teamId);

	const inputRef = useRef<HTMLInputElement>(null);

	const searchTerm = query.trim();

	const results = useQuery(
		api.search.search,
		teamId && searchTerm
			? {
					teamId,
					search: searchTerm,
				}
			: "skip",
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

			if (isSearchShortcut) {
				event.preventDefault();
				setOpen(true);

				requestAnimationFrame(() => {
					inputRef.current?.focus();
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleSelect = () => {
		setOpen(false);
		setQuery("");
	};

	const handleOpenChange = (value: boolean) => {
		setOpen(value);

		if (!value) {
			setQuery("");
		}
	};

	return (
		<>
			{mode === "compact" ? (
				<Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setOpen(true)}>
					<SearchIcon size={18} animate={false} />
				</Button>
			) : (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="relative h-full w-full rounded-full border bg-foreground/5 px-4 backdrop-blur-2xl transition-colors hover:bg-foreground/10"
				>
					<SearchIcon
						size={16}
						animate={false}
						className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>

					<div className="flex h-full items-center text-xs justify-center px-8 text-sm text-muted-foreground">
						Search...
					</div>

					<div className="absolute right-3.5 top-1/2 flex h-6 -translate-y-1/2 items-center gap-1 text-[10px] font-medium text-muted-foreground">
						<CommandKeyIcon size={11} animate={false} />
						<span className="text-[11px]">K</span>
					</div>

					<div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/5" />
				</button>
			)}

			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					showCloseButton={false}
					className="top-20 translate-y-0 gap-0 overflow-hidden border p-0 sm:max-w-2xl"
				>
					<div className="p-2">
						<Input
							ref={inputRef}
							autoFocus
							value={query}
							placeholder="Search..."
							onChange={(e) => setQuery(e.target.value)}
							className="placeholder:text-sm"
						/>
					</div>

					<SearchResults teamId={teamId} results={results} searchTerm={searchTerm} onSelect={handleSelect} />
				</DialogContent>
			</Dialog>
		</>
	);
}
