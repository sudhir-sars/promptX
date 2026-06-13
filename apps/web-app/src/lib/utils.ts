import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Derives a prompt slug from its name. Must stay identical to the server-side
 * logic in `convex/prompts.ts` so the live preview matches the stored value.
 */
export function slugify(name: string) {
  return name.toLowerCase().replace(/ /g, "-");
}
