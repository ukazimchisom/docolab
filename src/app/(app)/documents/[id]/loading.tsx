import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentLoading() {
  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      <div className="p-6 lg:flex-1">
        <Skeleton className="h-4 w-64" />

        <div className="mx-auto mt-8 w-full max-w-3xl">
          <Skeleton className="h-8 w-2/3" />
          <div className="mt-6 flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      <div className="w-full border-t border-border p-4 lg:h-full lg:w-80 lg:border-l lg:border-t-0">
        <Skeleton className="h-5 w-24" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
