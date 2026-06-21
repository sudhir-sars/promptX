import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Careers",
	description: "Work with us at PromptX.",
};

export default function CareersPage() {
	return (
		<Page>
			<PageHeader title="Careers" description="Building the infrastructure layer for AI prompts." />

			<Section>
				<div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
					<p>We don’t have any open roles right now.</p>
					<p>
						If you’re excited about prompt infrastructure and developer tools, we still like meeting good people. Send a
						note and what you’d want to work on to <strong>contact@xevos.dev</strong>.
					</p>
				</div>
			</Section>
		</Page>
	);
}
