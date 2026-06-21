import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Changelog",
	description: "Product updates and improvements to PromptX.",
};

export default function ChangelogPage() {
	return (
		<Page>
			<PageHeader title="Changelog" description="Product updates and improvements." />

			<Section>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We’re preparing a public changelog. Updates will be posted here soon.
				</p>
			</Section>
		</Page>
	);
}
