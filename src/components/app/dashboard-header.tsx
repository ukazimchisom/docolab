"use client";

import { useSyncExternalStore } from "react";
import { buildGreeting } from "@/lib/greeting";

// The local hour comes from the browser's clock. There is nothing to subscribe
// to, so subscribe is a no-op. During server rendering and hydration the hour
// is unknown (null), which produces a neutral "Welcome back" greeting.
const subscribe = () => () => {};
const getHour = (): number | null => new Date().getHours();
const getServerHour = (): number | null => null;

type DashboardHeaderProps = {
  firstName: string | null;
};

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
  const hour = useSyncExternalStore(subscribe, getHour, getServerHour);

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">
        {buildGreeting(hour, firstName)}
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Here&apos;s what&apos;s happening with your documents.
      </p>
    </div>
  );
}
