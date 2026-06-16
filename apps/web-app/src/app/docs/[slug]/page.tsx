"use client";

import { notFound, redirect, usePathname } from "next/navigation";
import { docComponents } from "@/components/docs/registry";

export default function DocsPage() {
	const pathname = usePathname();
	const slug = pathname.split("/").filter(Boolean).at(-1) ?? "";

	if (!slug) redirect("/docs/getting-started");

	const Content = docComponents[slug];

	if (!Content) notFound();

	return (
		<div className="mx-auto h-full w-full max-w-7xl flex-col gap-8 overflow-y-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20 no-scrollbar">
			<Content />
		</div>
	);
}
