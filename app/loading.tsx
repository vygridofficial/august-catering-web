import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="w-full bg-background px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-10">
        <Skeleton className="h-[46vh] w-full rounded-3xl" />

        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-10 w-[85%] rounded-xl" />
          <Skeleton className="h-5 w-[70%] rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
