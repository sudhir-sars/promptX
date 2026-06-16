"use client";

import Link from "next/link";

import { ArrowUpIcon } from "@/components/ui/icons";

type SidebarSection = {
	id: string;
	items: {
		label: string;
		href: string;
	}[];
};

const resources: SidebarSection[] = [
	{
		id: "developer",
		items: [
			{ label: "Documentation", href: "/docs" },
			{ label: "Getting Started", href: "/docs/getting-started" },
			{ label: "Examples", href: "/docs/examples" },
		],
	},
	{
		id: "guides",
		items: [
			{ label: "Prompt Versioning", href: "/docs/prompt-versioning" },
			{ label: "Deployments", href: "/docs/deployments" },
			{ label: "Authentication", href: "/docs/authentication" },
			{ label: "Migration Guide", href: "/docs/migration" },
		],
	},
	{
		id: "integrations",
		items: [
			{ label: "Next.js", href: "/docs/nextjs" },
			{ label: "React", href: "/docs/react" },
			{ label: "Node.js", href: "/docs/nodejs" },
			{ label: "Python", href: "/docs/python" },
			{ label: "Go", href: "/docs/go" },
			{ label: "Rust", href: "/docs/rust" },
		],
	},
	{
		id: "community",
		items: [
			{ label: "Changelog", href: "/changelog" },
			{ label: "Roadmap", href: "/roadmap" },
			{ label: "Contact", href: "/contact" },
		],
	},
];

export function ResourceSidebarContent() {
	return (
		<div className="flex flex-col gap-8">
			{resources.map((section) => (
				<div key={section.id} className="flex flex-col gap-1">
					{section.items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="group flex items-center justify-between rounded-full border border-transparent px-5 py-2 text-[12.5px] text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
						>
							<span className="truncate">{item.label}</span>

							<ArrowUpIcon animate={false} className="size-4 shrink-0 rotate-45 opacity-0 group-hover:opacity-60" />
						</Link>
					))}
				</div>
			))}
		</div>
	);
}
