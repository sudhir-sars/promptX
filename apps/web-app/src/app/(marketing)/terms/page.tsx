import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Terms of Service",
	description: "The terms that govern your use of PromptX.",
};

export default function TermsPage() {
	return (
		<Page>
			<PageHeader
				title="Terms of Service"
				description="The agreement governing your use of PromptX. Last updated June 22, 2026."
			/>

			<Section>
				<h2 className="font-medium">Acceptance</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					By creating an account or using PromptX, you agree to these Terms. If you use the service on behalf of an
					organization, you represent that you are authorized to bind that organization.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">The service</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					PromptX provides tools to create, version, deploy, and manage AI prompts. We may add, change, or remove features
					over time. We aim for high availability but do not guarantee uninterrupted service.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Your account</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You are responsible for safeguarding your credentials and API keys and for all activity under your account.
					Notify us promptly of any unauthorized use at <strong>support@xevos.dev</strong>.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Your content</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You retain ownership of the prompts and content you create. You grant us the limited rights needed to store,
					process, and display that content to operate the service for you. You are responsible for ensuring you have the
					rights to the content you submit.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Acceptable use</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You agree not to: break the law; infringe others’ rights; upload malware; attempt to disrupt, reverse engineer,
					or gain unauthorized access to the service; abuse rate limits or resell access without permission; or use the
					service to generate or distribute unlawful, harmful, or deceptive content. We may suspend accounts that violate
					this policy.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">AI features</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Some features process your content using leading industry AI providers. AI output may be inaccurate; you are
					responsible for reviewing it before relying on it. See the AI disclosure in our Privacy Policy.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Plans &amp; payment</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Paid plans, where offered, are billed as described at checkout. Fees are non-refundable except where required by
					law. We may change pricing with reasonable notice.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Termination</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You may stop using the service and delete your account at any time. We may suspend or terminate access for
					violations of these Terms. On termination, your data is handled as described in the Privacy Policy.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Disclaimers &amp; liability</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					The service is provided “as is” without warranties of any kind. To the maximum extent permitted by law, we are
					not liable for indirect, incidental, or consequential damages, and our total liability is limited to the amounts
					you paid us in the 12 months before the claim.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Governing law</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law rules.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Contact</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Questions about these Terms: <strong>contact@xevos.dev</strong>.
				</p>
			</Section>
		</Page>
	);
}
