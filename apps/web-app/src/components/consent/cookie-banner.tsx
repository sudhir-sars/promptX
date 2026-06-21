"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_VERSION, useConsentStore } from "@/stores/consent-store";

/**
 * Bottom consent banner. Shown until the visitor makes a choice. "Reject all"
 * is given equal prominence to "Accept all" — rejecting must be no harder than
 * accepting (GDPR / EDPB dark-pattern guidance).
 */
export function CookieBanner() {
	const [mounted, setMounted] = useState(false);
	const consent = useConsentStore((s) => s.consent);
	const version = useConsentStore((s) => s.version);
	const acceptAll = useConsentStore((s) => s.acceptAll);
	const rejectAll = useConsentStore((s) => s.rejectAll);
	const openPreferences = useConsentStore((s) => s.openPreferences);

	// Avoid a hydration mismatch: persisted state is only known on the client.
	useEffect(() => setMounted(true), []);

	const responded = consent !== null && version === CONSENT_VERSION;
	if (!mounted || responded) return null;

	return (
		<div
			role="dialog"
			aria-label="Cookie consent"
			aria-live="polite"
			className="fixed inset-x-0 bottom-0 z-[100] border-t border-foreground/[0.08] bg-background/95 px-5 py-4 supports-backdrop-filter:backdrop-blur-md md:px-8"
		>
			<div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<p className="max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
					We use strictly necessary cookies to run this site. With your permission, we also use analytics to
					understand product usage and improve the service. See our{" "}
					<Link href="/cookies" className="text-foreground/70 underline underline-offset-2">
						Cookie Policy
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="text-foreground/70 underline underline-offset-2">
						Privacy Policy
					</Link>
					.
				</p>

				<div className="flex shrink-0 flex-wrap items-center gap-2">
					<Button variant="ghost" size="sm" onClick={openPreferences}>
						Customize
					</Button>
					<Button variant="outline" size="sm" onClick={rejectAll}>
						Reject all
					</Button>
					<Button variant="default" size="sm" onClick={acceptAll}>
						Accept all
					</Button>
				</div>
			</div>
		</div>
	);
}
