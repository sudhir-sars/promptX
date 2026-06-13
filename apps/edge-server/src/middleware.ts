// src\middleware.ts

import type { MiddlewareHandler } from 'hono';
import { apiKeysKvKey, parseApiKey, SESSION_HEADER, type ApiKeyRecord } from '@promptx/shared';
import type { AppEnv } from './types';

async function hashSecret(secret: string): Promise<string> {
	const bytes = new TextEncoder().encode(secret);

	const digest = await crypto.subtle.digest('SHA-256', bytes);

	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const auth: MiddlewareHandler<AppEnv> = async (ctx, next) => {
	const authorization = ctx.req.header('Authorization');

	if (!authorization) {
		return ctx.json({ error: 'Missing Authorization header' }, 401);
	}

	const token = authorization.replace(/^Bearer\s+/, '');

	const parsed = parseApiKey(token);

	if (!parsed) {
		return ctx.json({ error: 'Invalid API key format' }, 401);
	}

	const { keyId, teamId, secret } = parsed;

	const stored = await ctx.env.PROMPTX_API_KEYS_KV.get(apiKeysKvKey(teamId), 'json');

	if (!stored) {
		return ctx.json({ error: 'Invalid API key' }, 401);
	}

	const keys = stored as ApiKeyRecord[];

	const apiKey = keys.find((k) => k.keyId === keyId);

	if (!apiKey) {
		return ctx.json({ error: 'Invalid API key' }, 401);
	}

	const providedHash = await hashSecret(secret);

	if (providedHash !== apiKey.hash) {
		return ctx.json({ error: 'Invalid API key' }, 401);
	}

	const sessionId = ctx.req.header(SESSION_HEADER);

	ctx.set('teamId', teamId);
	ctx.set('sessionId', sessionId);
	ctx.set('apiKey', apiKey);

	await next();
};
