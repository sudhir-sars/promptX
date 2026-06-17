import { Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

export type InviteAcceptedEmailProps = {
	teamName: string;
	memberName: string;
	role: "admin" | "member";
};

export function InviteAcceptedEmail({ teamName, memberName, role }: InviteAcceptedEmailProps) {
	return (
		<EmailLayout preview={`${memberName} joined ${teamName}`}>
			<Heading style={emailStyles.heading}>
				{memberName} joined {teamName}
			</Heading>

			<Text style={emailStyles.paragraph}>
				<span style={emailStyles.highlight}>{memberName}</span> accepted your invitation and is now{" "}
				{role === "admin" ? "an" : "a"} <span style={emailStyles.highlight}>{role}</span> of{" "}
				<span style={emailStyles.highlight}>{teamName}</span>.
			</Text>
		</EmailLayout>
	);
}

export default InviteAcceptedEmail;
