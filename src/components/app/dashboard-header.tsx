const CURRENT_USER_FIRST_NAME = "Andy";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {getGreeting()}, {CURRENT_USER_FIRST_NAME}!
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening with your documents.
      </p>
    </div>
  );
}
