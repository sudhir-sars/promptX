"use client";

import { Page, PageHeader, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useConsentStore } from "@/stores/consent-store";

export default function CookiesPage() {
	const openPreferences = useConsentStore((s) => s.openPreferences);

	return (
		<Page>
			<PageHeader
				title="Cookie Policy"
				description="How we use cookies and similar technologies, and how you control them. Last updated June 22, 2026."
			/>

			<Section>
				<h2 className="font-medium">What we use</h2>
				<div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
					<p>
						Cookies and similar technologies (such as local storage) let the site work and help us understand usage. We
						use two categories:
					</p>
					<p>
						<strong>Strictly necessary</strong> — required for sign-in, security, and core functionality. Always active.
					</p>
					<p>
						<strong>Analytics</strong> — used to understand product usage, measure feature adoption, diagnose issues, and
						improve the service. These load <strong>only after you consent</strong>.
					</p>
				</div>
			</Section>

			<Section>
				<h2 className="font-medium">No advertising cookies</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We do not use advertising or cross-site tracking cookies, and we do not sell your data.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Managing your choices</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You can change or withdraw your consent at any time. Your choice is recorded as proof of consent.
				</p>
				<div className="pt-2">
					<Button variant="outline" onClick={openPreferences}>
						Manage Cookies
					</Button>
				</div>
			</Section>

			<Section>
				<h2 className="font-medium">More information</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					For how we handle personal data more broadly, see our Privacy Policy. Questions:{" "}
					<strong>contact@xevos.dev</strong>.
				</p>
			</Section>
		</Page>
	);
}
