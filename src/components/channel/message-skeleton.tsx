import { Skeleton } from "../ui/skeleton";

function MessageSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Skeleton className="rounded-3xl w-12 h-12" />
      <Skeleton className="w-1/2 h-12" />
    </div>
  );
}

export default function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <MessageSkeleton />
      <MessageSkeleton className="flex-row-reverse" />
      <MessageSkeleton />
      <MessageSkeleton className="flex-row-reverse" />
      <MessageSkeleton />
    </div>
  );
}
