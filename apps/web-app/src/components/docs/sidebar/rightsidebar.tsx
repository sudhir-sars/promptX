"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useDocsNavigationStore } from "@/stores/docs-navigation-store";

import { getCurrentDoc } from "./config";

export function DocsRightSidebar() {
	const pathname = usePathname();
	const page = getCurrentDoc(pathname);

	const [activeId, setActiveId] = useState("");

	const xlDesktop = useDocsNavigationStore((state) => state.xlDesktop);

	const rightSidebarOpen = useDocsNavigationStore((state) => state.rightSidebarOpen);

	const navigate = useDocsNavigationStore((state) => state.navigate);

	useEffect(() => {
		if (!page?.toc?.length) return;

		const ids = page.toc.map((item) => item.id);

		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries.filter((e) => e.isIntersecting);

				if (intersecting.length === 0) return;

				const topmost = intersecting.reduce((prev, curr) =>
					curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev,
				);

				setActiveId(topmost.target.id);
			},
			{
				rootMargin: "-72px 0px -60% 0px",
				threshold: 0,
			},
		);

		ids.forEach((id) => {
			const el = document.getElementById(id);

			if (el) {
				observer.observe(el);
			}
		});

		if (ids[0] !== undefined) {
			setActiveId(ids[0]);
		}

		return () => observer.disconnect();
	}, [page?.toc]);

	if (!page?.toc?.length) {
		return null;
	}

	const sidebarClasses = xlDesktop
		? "relative w-72 shrink-0"
		: `fixed inset-y-0 right-0 z-50 w-72 bg-background transition-transform duration-300 ${
				rightSidebarOpen ? "translate-x-0" : "translate-x-full"
			}`;

	return (
		<>
			{!xlDesktop && rightSidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar"
					className="fixed inset-0 z-40 bg-black/40"
					onClick={() =>
						navigate({
							rightSidebarOpen: false,
						})
					}
				/>
			)}

			<aside className={sidebarClasses}>
				{!xlDesktop && (
					<Button
						size="icon"
						variant="ghost"
						className="absolute left-4 top-4 z-[120]"
						onClick={() =>
							navigate({
								rightSidebarOpen: false,
							})
						}
					>
						<CloseIcon />
					</Button>
				)}

				<div className="sticky top-0 h-screen overflow-hidden">
					<div className="absolute bottom-[5vh] left-0 top-[5vh] w-px bg-gradient-to-b from-transparent via-border to-transparent" />

					<div
						className="h-full"
						style={{
							maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
							WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
						}}
					>
						<div className="h-full overflow-y-auto px-8 py-[20vh] no-scrollbar">
							<p className="mb-6 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/30">
								On this page
							</p>

							<div className="relative">
								<div className="absolute left-[4.5px] top-0 h-full w-px bg-gradient-to-b from-foreground/[0.08] via-foreground/[0.08] to-transparent" />

								<div className="space-y-5">
									{page.toc.map((item) => {
										const isActive = activeId === item.id;

										return (
											<Link
												key={item.id}
												href={`#${item.id}`}
												onClick={() => {
													if (!xlDesktop) {
														navigate({
															rightSidebarOpen: false,
														});
													}
												}}
												className="group relative flex items-start pl-7"
											>
												<div
													className={cn(
														"absolute left-0 top-[5px] h-[10px] w-[10px] rounded-full border transition-all duration-200",
														isActive
															? "border-foreground bg-foreground"
															: "border-foreground/15 bg-transparent group-hover:border-foreground/35",
													)}
												/>

												<span
													className={cn(
														"text-[12px] leading-snug transition-colors duration-200",
														isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80",
													)}
												>
													{item.label}
												</span>
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
