"use client";

import { CookieBanner } from "@/components/consent/cookie-banner";
import { PreferenceCenter } from "@/components/consent/preference-center";

export function Dialogs() {
	return (
		<>
			<PreferenceCenter />
			<CookieBanner />
		</>
	);
}
