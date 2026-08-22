import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
  );
}
