import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description: "How PromptX collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
	return (
		<Page>
			<PageHeader
				title="Privacy Policy"
				description="How we collect, use, share, and protect your personal data. Last updated June 22, 2026."
			/>

			<Section>
				<h2 className="font-medium">Who we are</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					PromptX (“PromptX”, “we”, “us”) is an independently operated prompt-management service. For any privacy
					question or to exercise your rights, contact us at <strong>contact@xevos.dev</strong>. We act as the data
					controller for account and usage data, and as a data processor for the prompt content you store on behalf of
					your own users.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Data we collect</h2>
				<div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
					<p>
						<strong>Account data</strong> — your name, email address, and profile image, provided through our
						authentication provider when you sign up.
					</p>
					<p>
						<strong>Content data</strong> — the prompts, versions, deployments, teams, and related configuration you
						create.
					</p>
					<p>
						<strong>Usage &amp; analytics data</strong> — pages viewed, features used, and anonymized interaction data,
						collected only with your consent.
					</p>
					<p>
						<strong>Technical data</strong> — IP address, browser/device information, and security and audit logs needed
						to run the service securely.
					</p>
					<p>
						<strong>Consent records</strong> — a log of the cookie choices you make, kept as proof of consent.
					</p>
				</div>
			</Section>

			<Section>
				<h2 className="font-medium">How we use your data</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					To provide and maintain the service; to authenticate you and secure your account; to communicate with you about
					the service; to understand and improve product usage (with consent); and to comply with legal obligations.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Legal bases (GDPR / UK GDPR)</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We rely on <strong>performance of a contract</strong>, <strong>legitimate interests</strong> (security and
					product improvement), <strong>consent</strong> (analytics cookies and certain communications), and{" "}
					<strong>legal obligation</strong> where applicable. You can withdraw consent at any time without affecting prior
					processing.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Service providers &amp; sub-processors</h2>
				<div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
					<p>We share data only with providers that help us run the service, under appropriate data-protection terms:</p>
					<p>
						— Authentication (user identity and sign-in)
						<br />— Database &amp; application hosting (storage of your account and content)
						<br />— Transactional email (account and notification emails)
						<br />— Product analytics (EU-hosted usage analytics, consent-based)
						<br />— AI processing — for certain features such as evaluations, observability, and insights, relevant content
						may be processed by leading industry AI providers, solely to deliver the requested output. We do not sell your
						content.
					</p>
				</div>
			</Section>

			<Section>
				<h2 className="font-medium">International transfers</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Our analytics data is hosted in the European Union. Some other providers may process data in the United States
					or other countries. Where data leaves your region, we rely on appropriate safeguards such as Standard
					Contractual Clauses.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Data retention</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We keep account and content data while your account is active. Analytics data is retained for up to 12 months.
					When you delete your account, we delete your personal data within 30 days, except where we must retain limited
					information to meet legal obligations. Backups are cycled out within 30 days.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Your rights</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Depending on where you live, you may have the right to access, correct, delete, export, restrict, or object to
					the processing of your personal data, and to withdraw consent. You can export your data or delete your account
					from <strong>Settings → Your Data &amp; Privacy</strong>, or by emailing <strong>contact@xevos.dev</strong>.
					EU/UK users may also lodge a complaint with their data-protection authority.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">California privacy (CCPA/CPRA)</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					If you are a California resident, you have the right to know what personal information we collect, to request its
					deletion, and to correct it. <strong>We do not sell or share your personal information</strong> for
					cross-context behavioral advertising, and we do not discriminate against you for exercising your rights. To make
					a request, email <strong>contact@xevos.dev</strong>.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Children</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					PromptX is not directed to children and is not intended for anyone under 16. We do not knowingly collect
					personal data from children.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Changes &amp; contact</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					We may update this policy from time to time; material changes will be reflected by the “last updated” date
					above. Questions or requests: <strong>contact@xevos.dev</strong>.
				</p>
			</Section>
		</Page>
	);
}
