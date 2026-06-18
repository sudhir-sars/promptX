import type { MetadataRoute } from "next";
/**
 * Programmatic robots.txt (Next.js `app/robots.ts` convention). Served at
 * `/robots.txt`. Allows crawling of public marketing and docs pages, blocks
 * the authenticated dashboard and auth flows, and points crawlers at the
 * sitemap.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/home/", "/invite/", "/sign-in", "/sso-callback"],
		},
		sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
		host: process.env.NEXT_PUBLIC_BASE_URL,
	};
}
