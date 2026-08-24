import { TestimonialCard } from "./testimonial-card";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We stopped wasting time figuring out which version of a document was the latest. Everyone simply works in the same place.",
    name: "Maya Chen",
    role: "Product Lead, Northstar",
    initials: "MC",
    avatarColor: "bg-primary",
  },
  {
    quote:
      "Docolab feels incredibly simple. Our team was collaborating within minutes without needing a training session.",
    name: "Daniel Okafor",
    role: "Operations Manager, CloudLabs",
    initials: "DO",
    avatarColor: "bg-emerald-700",
  },
  {
    quote:
      "The biggest win is how invisible the collaboration becomes. We just open the document and work.",
    name: "Sofia Martins",
    role: "Design Director, PixelForge",
    initials: "SM",
    avatarColor: "bg-amber-700",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Loved by teams
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
