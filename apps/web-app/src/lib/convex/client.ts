// lib/convex/client.ts

import { ConvexReactClient } from "convex/react";

const { NEXT_PUBLIC_CONVEX_URL: convexUrl } = process.env;

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

export const db = new ConvexReactClient(convexUrl, {});
