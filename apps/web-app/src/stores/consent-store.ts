"use client";

import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { api } from "@/convex/_generated/api";
import { db } from "@/lib/convex/client";

/**
 * Bump when the meaning of consent changes. A stored record older than this is
 * treated as "no response yet" so the banner re-prompts (valid, current consent).
 */
export const CONSENT_VERSION = 1;

export type ConsentState = {
	/** Strictly necessary — always on, cannot be rejected. */
	necessary: true;
	/** Covers all optional product analytics and usage-measurement tooling. */
	analytics: boolean;
};

type ConsentStore = {
	/** Stable anonymous id used to tie consent records together. */
	visitorId: string;
	/** `null` until the visitor responds to the banner. */
	consent: ConsentState | null;
	version: number;
	/** Epoch ms of the last decision. */
	updatedAt: number | null;

	preferencesOpen: boolean;

	hasResponded: () => boolean;
	acceptAll: () => void;
	rejectAll: () => void;
	save: (partial: Partial<Omit<ConsentState, "necessary">>) => void;
	withdraw: () => void;

	openPreferences: () => void;
	closePreferences: () => void;
};

const ALL_ON: ConsentState = { necessary: true, analytics: true };
const ALL_OFF: ConsentState = { necessary: true, analytics: false };

/** Persist the decision server-side for accountability. Fire-and-forget. */
function logConsent(visitorId: string, analytics: boolean, source: string) {
	void db
		.mutation(api.consent.logConsent, {
			visitorId,
			analytics,
			policyVersion: CONSENT_VERSION,
			source,
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
		})
		.catch(() => {
			/* never block the UI on the consent log */
		});
}

export const useConsentStore = create<ConsentStore>()(
	persist(
		(set, get) => ({
			visitorId: nanoid(),
			consent: null,
			version: CONSENT_VERSION,
			updatedAt: null,
			preferencesOpen: false,

			hasResponded: () => {
				const s = get();
				return s.consent !== null && s.version === CONSENT_VERSION;
			},

			acceptAll: () => {
				set({ consent: ALL_ON, version: CONSENT_VERSION, updatedAt: Date.now(), preferencesOpen: false });
				logConsent(get().visitorId, true, "banner-accept");
			},

			rejectAll: () => {
				set({ consent: ALL_OFF, version: CONSENT_VERSION, updatedAt: Date.now(), preferencesOpen: false });
				logConsent(get().visitorId, false, "banner-reject");
			},

			save: (partial) => {
				const next: ConsentState = { ...ALL_OFF, ...get().consent, ...partial, necessary: true };
				set({ consent: next, version: CONSENT_VERSION, updatedAt: Date.now(), preferencesOpen: false });
				logConsent(get().visitorId, next.analytics, "preferences");
			},

			withdraw: () => {
				set({ consent: null, updatedAt: null });
				logConsent(get().visitorId, false, "withdraw");
			},

			openPreferences: () => set({ preferencesOpen: true }),
			closePreferences: () => set({ preferencesOpen: false }),
		}),
		{
			name: "px-consent",
			partialize: (s) => ({
				visitorId: s.visitorId,
				consent: s.consent,
				version: s.version,
				updatedAt: s.updatedAt,
			}),
		},
	),
);
