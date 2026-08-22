import type { Icon } from "@phosphor-icons/react";

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: IconComponent,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
        <IconComponent size={22} className="text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
