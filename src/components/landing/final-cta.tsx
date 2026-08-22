import Link from "next/link";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary-foreground/30">
              <UsersThreeIcon
                aria-hidden="true"
                size={26}
                className="text-primary-foreground"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                Stop sending document versions back and forth.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Bring your team into one workspace and start collaborating
                today.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 lg:shrink-0">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/signup">Start Collaborating Free</Link>
            </Button>
            <p className="text-xs text-primary-foreground/70">
              No credit card required · Set up in under 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
