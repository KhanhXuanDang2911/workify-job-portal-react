import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TalentItemSkeleton() {
  return (
    <Card className="p-4 bg-white border border-gray-200">
      <div className="flex gap-4">
        {/* Avatar Skeleton */}
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Location */}
          <Skeleton className="h-4 w-1/2" />

          {/* Salary */}
          <Skeleton className="h-4 w-1/3" />

          {/* Experience */}
          <Skeleton className="h-4 w-2/5" />

          {/* Employer */}
          <Skeleton className="h-4 w-3/4" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};