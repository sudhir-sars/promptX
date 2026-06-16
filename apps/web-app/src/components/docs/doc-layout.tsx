"use client";

import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type DocEntry, docMeta } from "./registry";

/* ------------------------------------------------------------------ */
/*  Navigation structure                                               */
/* ------------------------------------------------------------------ */
const navSections = [
	{
		label: "Getting Started",
		items: ["getting-started", "examples"],
	},
	{
		label: "Guides",
		items: ["prompt-versioning", "deployments", "authentication", "migration"],
	},
	{
		label: "SDK",
		items: ["nextjs", "react", "nodejs", "python", "go", "rust"],
	},
];

function getAllSlugs(): string[] {
	return navSections.flatMap((s) => s.items);
}

/* ------------------------------------------------------------------ */
/*  DocLayout                                                          */
/* ------------------------------------------------------------------ */
export function DocLayout({ children, slug }: { children: React.ReactNode; slug: string }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const allSlugs = getAllSlugs();
	const currentIndex = allSlugs.indexOf(slug);
	const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
	const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;
	const meta = docMeta[slug] as DocEntry | undefined;

	return (
		<div
			className="relative min-h-[100svh]"
			style={{
				backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
				backgroundSize: "22px 22px",
			}}
		>
			{/* Ghost watermark */}
			{meta?.ghost && (
				<span
					aria-hidden
					className="pointer-events-none fixed right-[-2%] top-1/2 -translate-y-1/2 select-none font-black uppercase leading-none tracking-tighter text-foreground/[0.03]"
					style={{ fontSize: "clamp(100px, 18vw, 240px)" }}
				>
					{meta.ghost}
				</span>
			)}

			<div className="relative z-10 mx-auto flex max-w-7xl">
				{/* Mobile sidebar toggle */}
				<button
					type="button"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="fixed left-4 top-4 z-50 flex size-9 items-center justify-center rounded-xl border border-foreground/[0.08] bg-background/80 backdrop-blur-sm lg:hidden"
				>
					<ChevronRightIcon className="size-4 text-foreground/50" />
				</button>

				{/* Sidebar */}
				<aside
					className={cn(
						"fixed inset-y-0 left-0 z-40 w-[260px] shrink-0 overflow-y-auto border-r border-foreground/[0.04] bg-background px-6 pb-8 pt-16 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
						sidebarOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					{/* Brand */}
					<Link
						href="/"
						className="mb-10 inline-block text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground"
					>
						XEVOS AI
					</Link>

					{/* Nav sections */}
					<nav className="flex flex-col gap-7">
						{navSections.map((section) => (
							<div key={section.label}>
								<p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/25">
									{section.label}
								</p>
								<div className="flex flex-col gap-0.5">
									{section.items.map((itemSlug) => {
										const entry = docMeta[itemSlug];
										const isActive = slug === itemSlug;
										return (
											<Link
												key={itemSlug}
												href={`/docs/${itemSlug}`}
												onClick={() => setSidebarOpen(false)}
												className={cn(
													"rounded-xl px-3 py-2 text-[12px] transition-colors",
													isActive
														? "bg-foreground/[0.05] font-medium text-foreground"
														: "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground/70",
												)}
											>
												{entry?.title ?? itemSlug}
											</Link>
										);
									})}
								</div>
							</div>
						))}
					</nav>

					{/* Bottom nav */}
					<div className="mt-10 flex flex-col gap-0.5 border-t border-foreground/[0.06] pt-6">
						{[
							{ label: "Changelog", href: "/changelog" },
							{ label: "Roadmap", href: "/roadmap" },
							{ label: "Pricing", href: "/pricing" },
						].map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="rounded-xl px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground/70"
							>
								{link.label}
							</Link>
						))}
					</div>
				</aside>

				{/* Sidebar overlay on mobile */}
				{sidebarOpen && (
					<button
						type="button"
						aria-label="Close sidebar"
						className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Main content */}
				<main className="min-w-0 flex-1 px-8 pb-20 pt-16 md:px-16 lg:px-20 lg:pt-20">
					{/* Breadcrumb */}
					<div className="mb-10 flex items-center gap-3">
						<div className="h-px w-8 bg-foreground/20" />
						<p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							{meta?.section ?? "Documentation"}
						</p>
					</div>

					{/* Content */}
					<div className="max-w-3xl">{children}</div>

					{/* Prev / Next navigation */}
					{(prevSlug || nextSlug) && (
						<div className="mt-20 max-w-3xl">
							<div className="h-px w-full bg-foreground/[0.06]" />
							<div className="mt-6 flex justify-between gap-4">
								{prevSlug ? (
									<Button asChild variant="outline" className="gap-2">
										<Link href={`/docs/${prevSlug}`}>
											<ChevronLeftIcon className="size-3.5" />
											{docMeta[prevSlug]?.title ?? prevSlug}
										</Link>
									</Button>
								) : (
									<div />
								)}
								{nextSlug ? (
									<Button asChild variant="outline" className="gap-2">
										<Link href={`/docs/${nextSlug}`}>
											{docMeta[nextSlug]?.title ?? nextSlug}
											<ChevronRightIcon className="size-3.5" />
										</Link>
									</Button>
								) : (
									<Button asChild variant="outline" className="gap-2">
										<Link href="/">
											<HomeIcon className="size-3.5" />
											Go home
										</Link>
									</Button>
								)}
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
