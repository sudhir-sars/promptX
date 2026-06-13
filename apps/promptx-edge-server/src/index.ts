import { Hono } from 'hono';
import { PROMPTS_BASE_PATH } from '@promptx/shared';
import health from './api/health';
import prompts from './api/prompts';
import type { AppEnv } from './ztypes';

import { auth } from './middleware';
const app = new Hono<AppEnv>();

app.route('/health', health);

// Auth + prompts mounted at the canonical versioned base path (`/v0/prompts`).
app.use(`${PROMPTS_BASE_PATH}/*`, auth);
app.route(PROMPTS_BASE_PATH, prompts);

export default app;
