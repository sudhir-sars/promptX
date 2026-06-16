export type CursorState = {
	next: string | null;
	status: "uninitialized" | "loading" | "loaded" | "loading-more" | "exhausted" | "error";
};
