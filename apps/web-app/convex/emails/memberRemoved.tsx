import { Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

export type MemberRemovedEmailProps = {
	teamName: string;
};

export function MemberRemovedEmail({ teamName }: MemberRemovedEmailProps) {
	return (
		<EmailLayout preview={`You were removed from ${teamName}`}>
			<Heading style={emailStyles.heading}>You were removed from {teamName}</Heading>

			<Text style={emailStyles.paragraph}>
				You no longer have access to <span style={emailStyles.highlight}>{teamName}</span> on PromptX.
			</Text>

			<Text style={emailStyles.muted}>If you think this was a mistake, contact a team administrator.</Text>
		</EmailLayout>
	);
}

export default MemberRemovedEmail;
