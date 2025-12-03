import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FleetSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <Skeleton className="h-8 w-14" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}

export function FleetListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: スケルトンは静的なリストなので安全
        <FleetSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
