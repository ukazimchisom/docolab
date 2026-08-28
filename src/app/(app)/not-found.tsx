import Link from "next/link";
import { FileMagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function DocumentNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <FileMagnifyingGlassIcon size={28} className="text-primary" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Document not found
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This document doesn&apos;t exist or may have been removed.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
