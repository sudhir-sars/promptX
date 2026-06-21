import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { PreferenceCenter } from "@/components/consent/preference-center";
import { Dialogs } from "./dialog";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "PromptX by Xevos",
		template: "%s | PromptX",
	},

	description:
		"Deploy, version, and manage AI prompts at the edge. Built by Xevos for reliable prompt delivery in production.",

	applicationName: "PromptX",

	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
	},

	manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
		>
			<body className="min-h-full flex flex-col bg-background relative">
				<ClerkProvider>
					<div className="relative z-10 flex flex-col min-h-screen">
						<PostHogProvider>
							<Dialogs />
							<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
								<Toaster />
								{children}
							</ThemeProvider>
						</PostHogProvider>
					</div>
				</ClerkProvider>
			</body>
		</html>
	);
}
