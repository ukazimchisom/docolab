import {
  UsersThreeIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { FeatureCard } from "./feature-card";

interface Feature {
  icon: Icon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: UsersThreeIcon,
    title: "Edit Together",
    description:
      "Multiple people can edit the same document at the same time. No more waiting, no more back and forth.",
  },
  {
    icon: LightningIcon,
    title: "See Changes Live",
    description:
      "Instantly see what your teammates are typing with live cursors, presence indicators, and real-time comments.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Stay in Sync",
    description:
      "All changes are saved automatically. One source of truth for your team, so you're always working on the latest version.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24"
    >
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Everything your team needs to collaborate
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
