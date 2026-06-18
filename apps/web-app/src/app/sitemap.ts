import type { MetadataRoute } from "next";
import { docsPages } from "@/components/docs/sidebar/config";
/**
 * Programmatic sitemap (Next.js `app/sitemap.ts` convention). Served at
 * `/sitemap.xml`. Only public, indexable pages are listed — the authenticated
 * dashboard (`/home`), invite links, and auth callbacks are excluded.
 *
 * Doc routes are derived from `docsPages` (the docs navigation source of
 * truth), so adding a doc to the sidebar automatically adds it here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: process.env.NEXT_PUBLIC_BASE_URL!, lastModified, changeFrequency: "monthly", priority: 1 },
		{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.8 },
	];

	const docRoutes: MetadataRoute.Sitemap = docsPages.map((page) => ({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${page.href}`,
		lastModified,
		changeFrequency: "weekly" as const,
		priority: page.href === "/docs/getting-started" ? 0.9 : 0.7,
	}));

	return [...staticRoutes, ...docRoutes];
}
