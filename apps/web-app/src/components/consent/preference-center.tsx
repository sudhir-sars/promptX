"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useConsentStore } from "@/stores/consent-store";

type Category = {
	key: "necessary" | "analytics";
	label: string;
	description: string;
	always?: boolean;
};

const CATEGORIES: Category[] = [
	{
		key: "necessary",
		label: "Strictly necessary",
		description: "Required for authentication, security, and core functionality. Always enabled.",
		always: true,
	},
	{
		key: "analytics",
		label: "Analytics",
		description:
			"We use analytics tools to understand product usage, measure feature adoption, diagnose issues, and improve the service.",
	},
];

/**
 * Granular cookie preference center. Controlled globally via the consent store
 * so the banner's "Customize", the footer, and the /cookies page can open it.
 * Mount once near the app root.
 */
export function PreferenceCenter() {
	const open = useConsentStore((s) => s.preferencesOpen);
	const closePreferences = useConsentStore((s) => s.closePreferences);
	const consent = useConsentStore((s) => s.consent);
	const save = useConsentStore((s) => s.save);

	const [analytics, setAnalytics] = useState(false);

	// Seed the toggle from the stored decision each time the dialog opens.
	useEffect(() => {
		if (open) setAnalytics(consent?.analytics ?? false);
	}, [open, consent]);

	const values: Record<Category["key"], boolean> = {
		necessary: true,
		analytics,
	};
	const setters: Partial<Record<Category["key"], (v: boolean) => void>> = {
		analytics: setAnalytics,
	};

	return (
		<Dialog open={open} onOpenChange={(v) => !v && closePreferences()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Cookie preferences</DialogTitle>
					<DialogDescription>
						Choose which optional cookies to allow. You can change these at any time.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{CATEGORIES.map((cat) => (
						<div key={cat.key} className="flex items-start justify-between gap-4">
							<div className="space-y-1">
								<p className="text-[13px] font-medium text-foreground/85">{cat.label}</p>
								<p className="text-[12px] leading-relaxed text-muted-foreground">{cat.description}</p>
							</div>
							<Switch
								checked={values[cat.key]}
								disabled={cat.always}
								onCheckedChange={(v) => setters[cat.key]?.(v)}
								aria-label={cat.label}
							/>
						</div>
					))}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => save({ analytics: false })}>
						Reject all
					</Button>
					<Button onClick={() => save({ analytics })}>Save preferences</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
