"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { useConsentStore } from "@/stores/consent-store";

/**
 * PostHog loads ONLY after the visitor consents to analytics. Loading earlier
 * would set analytics storage / identifiers before consent — a GDPR + ePrivacy
 * (UK PECR) violation. Interaction recording is enabled under the same consent
 * with all inputs masked, so no free-text or credentials are ever captured.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
	const analytics = useConsentStore((s) => s.consent?.analytics ?? false);
	const initialized = useRef(false);

	useEffect(() => {
		if (!analytics) {
			if (initialized.current) {
				posthog.stopSessionRecording();
				posthog.opt_out_capturing();
			}
			return;
		}

		if (!initialized.current) {
			posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
				api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
				person_profiles: "identified_only",
				capture_pageview: true,
				capture_pageleave: true,
				session_recording: {
					maskAllInputs: true,
					maskTextSelector: "*",
				},
			});
			initialized.current = true;
		} else {
			posthog.opt_in_capturing();
			posthog.startSessionRecording();
		}
	}, [analytics]);

	return <PHProvider client={posthog}>{children}</PHProvider>;
}
