import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

export type InviteEmailProps = {
	teamName: string;
	inviterName: string;
	role: "admin" | "member";
	acceptUrl: string;
};

export function InviteEmail({ teamName, inviterName, role, acceptUrl }: InviteEmailProps) {
	return (
		<EmailLayout preview={`${inviterName} invited you to join ${teamName} on PromptX`}>
			<Heading style={emailStyles.heading}>You've been invited to {teamName}</Heading>

			<Text style={emailStyles.paragraph}>
				<span style={emailStyles.highlight}>{inviterName}</span> invited you to join{" "}
				<span style={emailStyles.highlight}>{teamName}</span> on PromptX as {role === "admin" ? "an" : "a"}{" "}
				<span style={emailStyles.highlight}>{role}</span>.
			</Text>

			<Section style={{ margin: "24px 0" }}>
				<Button href={acceptUrl} style={emailStyles.button}>
					Accept invitation
				</Button>
			</Section>

			<Text style={emailStyles.muted}>If the button doesn't work, copy and paste this link into your browser:</Text>

			<Text style={emailStyles.link}>{acceptUrl}</Text>
		</EmailLayout>
	);
}

export default InviteEmail;
