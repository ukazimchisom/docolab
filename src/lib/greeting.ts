/** First word of a full name, or null when there is nothing usable. */
export function getFirstName(
  fullName: string | null | undefined,
): string | null {
  const first = fullName?.trim().split(/\s+/)[0];
  return first ? first : null;
}

export function getGreetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Builds the dashboard greeting. Pass `null` as the hour when the user's
 * local time is not known yet (e.g. during server rendering).
 */
export function buildGreeting(
  hour: number | null,
  firstName: string | null,
): string {
  const base = hour === null ? "Welcome back" : getGreetingForHour(hour);
  return firstName ? `${base}, ${firstName}!` : `${base}!`;
}
