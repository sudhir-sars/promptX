// lib/convex/client.ts

import { ConvexReactClient } from "convex/react";

// NOTE: must be a direct `process.env.NEXT_PUBLIC_*` member access, not a
// destructure — Turbopack only inlines the former into the client bundle.
const convexUrl = process.env["NEXT_PUBLIC_CONVEX_URL"]!;

if (!convexUrl) {
	throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

export const db = new ConvexReactClient(convexUrl, {});
