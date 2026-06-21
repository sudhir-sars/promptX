import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Data Processing Addendum",
	description: "Data processing terms for PromptX business customers.",
};

export default function DpaPage() {
	return (
		<Page>
			<PageHeader
				title="Data Processing Addendum"
				description="For customers who process personal data of their own users through PromptX. Last updated June 22, 2026."
			/>

			<Section>
				<h2 className="font-medium">Roles</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					When you use PromptX to process personal data of your own users, you act as the data controller and PromptX acts
					as your data processor. We process that data only on your documented instructions to provide the service.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Our commitments</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We implement appropriate technical and organizational measures to protect personal data, ensure persons
					processing it are bound by confidentiality, assist you with data-subject requests, and notify you without undue
					delay if we become aware of a personal-data breach affecting your data.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Sub-processors</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We use vetted sub-processors covering authentication, database and application hosting, transactional email,
					EU-hosted product analytics, and AI processing for certain features. Each is bound by data-protection terms
					consistent with this addendum.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">International transfers</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Where personal data is transferred across borders, we rely on appropriate safeguards such as Standard
					Contractual Clauses.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Requesting a signed DPA</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					A countersigned Data Processing Addendum is available on request. Email <strong>contact@xevos.dev</strong> and we
					will arrange it.
				</p>
			</Section>
		</Page>
	);
}
