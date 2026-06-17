import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

const main = {
	backgroundColor: "#f4f4f5",
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
	padding: "32px 0",
};

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #e4e4e7",
	borderRadius: "16px",
	margin: "0 auto",
	maxWidth: "480px",
	padding: "40px",
};

const brand = {
	color: "#18181b",
	fontSize: "18px",
	fontWeight: 600,
	letterSpacing: "-0.01em",
	margin: "0 0 24px",
};

const hr = {
	borderColor: "#e4e4e7",
	margin: "32px 0 16px",
};

const footer = {
	color: "#a1a1aa",
	fontSize: "12px",
	lineHeight: "18px",
	margin: 0,
};

type EmailLayoutProps = {
	preview: string;
	children: ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
	return (
		<Html>
			<Head />

			<Preview>{preview}</Preview>

			<Body style={main}>
				<Container style={container}>
					<Text style={brand}>PromptX</Text>

					{children}

					<Hr style={hr} />

					<Section>
						<Text style={footer}>
							PromptX — version control, instant rollbacks, and gradual rollouts for every prompt in production.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export const emailStyles = {
	heading: {
		color: "#18181b",
		fontSize: "22px",
		fontWeight: 600,
		letterSpacing: "-0.02em",
		lineHeight: "30px",
		margin: "0 0 16px",
	},
	paragraph: {
		color: "#3f3f46",
		fontSize: "15px",
		lineHeight: "24px",
		margin: "0 0 16px",
	},
	muted: {
		color: "#71717a",
		fontSize: "14px",
		lineHeight: "22px",
		margin: "0 0 16px",
	},
	button: {
		backgroundColor: "#18181b",
		borderRadius: "9999px",
		color: "#ffffff",
		display: "inline-block",
		fontSize: "14px",
		fontWeight: 500,
		padding: "12px 28px",
		textDecoration: "none",
	},
	link: {
		color: "#6366f1",
		fontSize: "13px",
		wordBreak: "break-all" as const,
	},
	highlight: {
		color: "#18181b",
		fontWeight: 600,
	},
} as const;
