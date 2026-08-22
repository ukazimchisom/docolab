import Link from "next/link";
import { CheckIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ProductMockup } from "./product-mockup";

const TRUST_INDICATORS = [
  "No credit card",
  "Setup in 2 minutes",
  "Free forever plan",
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">
            REAL-TIME DOCUMENT COLLABORATION
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your team&apos;s ideas, together in one{" "}
            <span className="text-primary">document.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Docolab helps teams write, edit, and collaborate in real
            time—without endless email threads, version conflicts, or
            complicated tools.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/signup">Start for Free</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="group">
              <Link href="#how-it-works">
                See How It Works
                <ArrowRightIcon
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {TRUST_INDICATORS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckIcon size={16} className="text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div>
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
