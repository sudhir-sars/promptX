import { PROMPTS_BASE_PATH } from "@promptx/shared";
import { Hono } from "hono";
import health from "./api/health";
import prompts from "./api/prompts";
import { auth } from "./middleware";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

app.route("/health", health);

// Auth + prompts mounted at the canonical versioned base path (`/v0/prompts`).
app.use(`${PROMPTS_BASE_PATH}/*`, auth);
app.route(PROMPTS_BASE_PATH, prompts);

export default app;
