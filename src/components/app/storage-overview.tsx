import { STORAGE_STATS } from "@/lib/mock-data";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StorageOverview() {
  const { usedGb, totalGb, breakdown } = STORAGE_STATS;
  const percentUsed = Math.round((usedGb / totalGb) * 100);
  const dashOffset = CIRCUMFERENCE * (1 - percentUsed / 100);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold text-foreground">
        Storage Overview
      </h2>

      <div className="mt-4 flex justify-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              className="text-accent"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="text-primary transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">
              {percentUsed}%
            </span>
            <span className="text-[11px] text-muted-foreground">
              {usedGb} GB / {totalGb} GB
            </span>
          </div>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2.5">
        {breakdown.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full bg-current ${item.color}`}
              />
              {item.label}
            </span>
            <span className="font-medium text-foreground">
              {item.usedGb} GB
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
