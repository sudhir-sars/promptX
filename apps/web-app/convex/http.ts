import { type HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { Hono } from "hono";
import type { ActionCtx } from "./_generated/server";
import { registerClerkRoutes } from "./http/clerk";
import { registerPromptRoutes } from "./http/prompts";
import { registerRestRoutes } from "./http/rest";

// The REST API uses Hono for real path-param routing; the Hono app is wrapped by
// HttpRouterWithHono, which still accepts traditional `http.route()` handlers
// (checked first) for the Clerk webhook and edge prompt resolution.
const app: HonoWithConvex<ActionCtx> = new Hono();
registerRestRoutes(app);

const http = new HttpRouterWithHono(app);
registerClerkRoutes(http);
registerPromptRoutes(http);

export default http;
