import { Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

export type RoleChangedEmailProps = {
	teamName: string;
	role: "admin" | "member";
};

export function RoleChangedEmail({ teamName, role }: RoleChangedEmailProps) {
	return (
		<EmailLayout preview={`Your role in ${teamName} changed`}>
			<Heading style={emailStyles.heading}>Your role changed</Heading>

			<Text style={emailStyles.paragraph}>
				You are now {role === "admin" ? "an" : "a"} <span style={emailStyles.highlight}>{role}</span> of{" "}
				<span style={emailStyles.highlight}>{teamName}</span>.
			</Text>

			<Text style={emailStyles.muted}>
				{role === "admin"
					? "Admins can invite teammates, manage members, and update team settings."
					: "Members can view and collaborate on the team's prompts."}
			</Text>
		</EmailLayout>
	);
}

export default RoleChangedEmail;
