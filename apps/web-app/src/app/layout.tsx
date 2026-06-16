import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

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
	title: "PromptX — AI Prompt Management Platform",
	description:
		"Version control, instant rollbacks, and gradual rollouts for every prompt in production. Manage the entire prompt lifecycle without code deploys.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={cn("antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
			<ClerkProvider>
				<body className="min-h-full flex flex-col bg-background relative">
					{/* Content sits above orbs */}
					<div className="relative z-10 flex flex-col min-h-screen">
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							forcedTheme="dark"
							enableSystem
							disableTransitionOnChange
						>
							<Toaster />
							{children}
						</ThemeProvider>
					</div>
				</body>
			</ClerkProvider>
		</html>
	);
}
