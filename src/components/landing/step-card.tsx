interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-semibold text-primary">
        {number}
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
