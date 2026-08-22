import { StepCard } from "./step-card";

const STEPS = [
  {
    number: "1",
    title: "Create",
    description: "Start a new document in seconds.",
  },
  {
    number: "2",
    title: "Invite",
    description: "Share a link and invite your team to join.",
  },
  {
    number: "3",
    title: "Collaborate",
    description: "Write, edit, comment, and finalize together in real time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-accent/40 py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How Docolab works
        </h2>

        {/* Desktop: horizontal row with connector line */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-3 lg:gap-8">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 mx-[16.66%] border-t-2 border-dashed border-border"
          />
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        {/* Mobile/Tablet: vertical timeline */}
        <div className="relative mt-12 flex flex-col gap-10 lg:hidden">
          <div
            aria-hidden="true"
            className="absolute left-6 top-6 bottom-6 w-px border-l-2 border-dashed border-border"
          />
          {STEPS.map((step) => (
            <div key={step.number} className="relative z-10 flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-semibold text-primary">
                {step.number}
              </div>
              <div className="pt-2">
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
