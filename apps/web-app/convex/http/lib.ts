export type { HttpRouter } from "convex/server";

/** JSON response helper. Responses are never cached (development must be instant). */
export function jsonResponse(body: unknown, status: number, extraHeaders?: Record<string, string>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			...extraHeaders,
		},
	});
}
