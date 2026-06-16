"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommandKeyIcon, SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

import { getDocsSearch } from "./config";

interface DocsSearchBarProps {
	mode?: "default" | "compact";
}

export function DocsSearchBar({ mode = "default" }: DocsSearchBarProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

			if (!isSearchShortcut) {
				return;
			}

			event.preventDefault();

			setOpen(true);

			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const results = useMemo(() => {
		const search = query.trim();

		if (!search) {
			return [];
		}

		return getDocsSearch()
			.search(search)
			.slice(0, 5)
			.map(({ item }) => item);
	}, [query]);

	const handleOpenChange = (value: boolean) => {
		setOpen(value);

		if (!value) {
			setQuery("");
		}
	};

	const handleSelect = () => {
		setOpen(false);
		setQuery("");
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

					<div className="flex h-full items-center justify-center px-8 text-sm text-muted-foreground">
						Search docs...
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
					<div className="border-b p-3">
						<Input
							ref={inputRef}
							autoFocus
							value={query}
							placeholder="Search documentation..."
							onChange={(e) => setQuery(e.target.value)}
							className="border-0 shadow-none focus-visible:ring-0"
						/>
					</div>

					<div className="max-h-[500px] overflow-y-auto">
						{!query.trim() ? (
							<div className="p-6 text-sm text-muted-foreground">Start typing to search the documentation.</div>
						) : results.length === 0 ? (
							<div className="p-6 text-sm text-muted-foreground">
								No results found for <span className="font-medium text-foreground">"{query}"</span>
							</div>
						) : (
							<div className="p-2">
								{results.map((result) => (
									<Link
										key={result.href}
										href={result.href}
										onClick={handleSelect}
										className="block rounded-lg px-4 py-3 transition-colors hover:bg-muted"
									>
										<div className="text-sm font-medium">{result.title}</div>

										{result.page && <div className="mt-1 text-xs text-muted-foreground">{result.page}</div>}
									</Link>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
