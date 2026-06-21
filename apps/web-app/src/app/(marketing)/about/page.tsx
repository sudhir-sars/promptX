import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "About",
	description: "About PromptX.",
};

export default function AboutPage() {
	return (
		<Page>
			<PageHeader
				title="About PromptX"
				description="Production-grade prompt management for teams shipping AI products."
			/>

			<Section>
				<div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
					<p>
						PromptX is an independently built product for deploying, versioning, and managing AI prompts in production —
						so teams can change prompts without redeploying code.
					</p>
					<p>
						We’re focused on reliability, clear versioning, and a developer experience that stays out of your way. Want to
						talk? Reach us at <strong>contact@xevos.dev</strong>.
					</p>
				</div>
			</Section>
		</Page>
	);
}
