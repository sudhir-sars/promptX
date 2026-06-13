import { BenefitsSection } from "@/components/landing-page/benefits-section";
import { CtaSection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { LandingFooter } from "@/components/landing-page/footer";
import { LandingNav } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero-section";
import { SocialProof } from "@/components/landing-page/social-proof";
import { ProductShowcase } from "@/components/landing-page/workflow-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground ">
      <LandingNav />

      <main className="">
        <HeroSection />
        <ProductShowcase />
        <FeaturesSection />
        <BenefitsSection />
        <SocialProof />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
