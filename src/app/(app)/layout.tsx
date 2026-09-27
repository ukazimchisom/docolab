import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getDocumentsForUser } from "@/lib/queries/documents";
import { IconRail } from "@/components/app/icon-rail";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { SecondaryPanelDesktop } from "@/components/app/secondary-panel-desktop";
import { TopBar } from "@/components/app/top-bar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  const documents = await getDocumentsForUser(user.id);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <IconRail />
      <SecondaryPanelDesktop recentDocuments={documents.slice(0, 5)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          user={{
            name: profile?.fullName ?? "Unknown User",
            email: user.email ?? "",
            initials: profile?.initials ?? "U",
          }}
          recentDocuments={documents.slice(0, 5)}
        />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      <BottomTabBar />
    </div>
  );
}
