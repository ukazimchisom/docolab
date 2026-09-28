import { createClient } from "@/lib/supabase/server";
import { getAnalyticsForUser } from "@/lib/queries/analytics";
import { StatusBreakdownBar } from "@/components/app/status-breakdown-bar";
import {
  FileTextIcon,
  UsersThreeIcon,
  ChatCircleIcon,
  CalendarIcon,
} from "@phosphor-icons/react/dist/ssr";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const analytics = user
    ? await getAnalyticsForUser(user.id)
    : {
        totalDocuments: 0,
        statusBreakdown: [],
        totalCollaboratorsGiven: 0,
        totalCommentsAuthored: 0,
        memberSince: null,
      };

  const stats = [
    {
      label: "Total Documents",
      value: analytics.totalDocuments,
      icon: FileTextIcon,
    },
    {
      label: "Collaborators Added",
      value: analytics.totalCollaboratorsGiven,
      icon: UsersThreeIcon,
    },
    {
      label: "Comments Written",
      value: analytics.totalCommentsAuthored,
      icon: ChatCircleIcon,
    },
    {
      label: "Member Since",
      value: formatDate(analytics.memberSince),
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A basic overview of your Docolab activity.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <stat.icon size={18} className="text-primary" />
            </div>
            <p className="mt-3 text-lg font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 max-w-md">
        <StatusBreakdownBar
          breakdown={analytics.statusBreakdown}
          total={analytics.totalDocuments}
        />
      </div>
    </div>
  );
}
