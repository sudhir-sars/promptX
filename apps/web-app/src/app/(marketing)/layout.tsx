import { LandingFooter } from "@/components/landing-page/footer";
import { LandingNav } from "@/components/landing-page/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<LandingNav />

			<main className="py-10">{children}</main>

			<LandingFooter />
		</div>
	);
}
