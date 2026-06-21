import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Roadmap",
	description: "What we're building next at PromptX.",
};

export default function RoadmapPage() {
	return (
		<Page>
			<PageHeader title="Roadmap" description="What we’re building next." />

			<Section>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We’re shaping what’s next. A public roadmap is coming soon.
				</p>
			</Section>
		</Page>
	);
}
