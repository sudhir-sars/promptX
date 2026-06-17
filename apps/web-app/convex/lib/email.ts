import { Resend } from "resend";
import { z } from "zod";
import { badRequest } from "./errors";

const DEFAULT_FROM = "PromptX <team@resend.dev>";
const resend = new Resend(process.env["RESEND_API_KEY"]!);

export async function sendEmail(args: { to: string; subject: string; reactComp: React.ReactElement; from?: string }) {
	const from = args.from ?? DEFAULT_FROM;
	const { error } = await resend.emails.send({
		from,
		to: args.to,
		subject: args.subject,
		react: args.reactComp,
	});

	if (error) {
		throw new Error(`Failed to send "${args.subject}" to ${args.to}: ${error.message}`);
	}
}

export function normalizeAndValidateEmail(email: string): string {
	const result = z.string().trim().toLowerCase().pipe(z.email()).safeParse(email);

	if (!result.success) {
		badRequest("Enter a valid email address");
	}

	return result.data;
}

export function normalizeAndValidateInviteCode(code: string): string {
	const result = z
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/)
		.safeParse(code);

	if (!result.success) {
		badRequest("Invalid invite code");
	}

	return result.data;
}
