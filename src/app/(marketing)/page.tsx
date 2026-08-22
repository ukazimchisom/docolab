import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
    </main>
  );
}
