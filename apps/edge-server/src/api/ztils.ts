import { TRAFFIC_BUCKET_RANGE, TRAFFIC_SCALE, type KVPromptVariant } from '@promptx/shared';

async function computeTrafficBucket(input: string): Promise<number> {
	const bytes = new TextEncoder().encode(input);

	const digest = await crypto.subtle.digest('SHA-256', bytes);

	const hash = new DataView(digest).getUint32(0);

	return hash % TRAFFIC_BUCKET_RANGE;
}

export async function selectVariant(identifier: string, variants: KVPromptVariant[], sessionId?: string): Promise<KVPromptVariant> {
	if (!sessionId) {
		return variants.reduce((highest, current) => (current.traffic > highest.traffic ? current : highest));
	}

	const bucket = await computeTrafficBucket(`${identifier}:${sessionId}`);

	let cumulative = 0;

	for (const variant of variants) {
		cumulative += variant.traffic * TRAFFIC_SCALE;

		if (bucket < cumulative) {
			return variant;
		}
	}

	return variants[variants.length - 1];
}
