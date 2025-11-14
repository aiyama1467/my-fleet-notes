import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type FleetItem = {
  id: number;
  title: string;
  tags: string[];
  memo: string;
  createdAt: string;
  lastUpdatedAt: string;
};

export function Fleet(fleet: FleetItem) {
  return (
    <div className="grid gap-4 sm:gap-6">
      <Card
        className="bg-primary text-white border-white/10 transition-colors hover:bg-primary/90"
        key={fleet.id}
      >
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{fleet.title}</CardTitle>
            <Button size="sm" variant="secondary">
              Edit
            </Button>
          </div>
          <div className="flex gap-2">
            {fleet.tags.map((tag) => (
              <span
                className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="whitespace-pre-line text-sm leading-relaxed text-white/90">
            {fleet.memo}
          </p>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          <p className="text-xs text-gray-400">Created: {fleet.createdAt}</p>
          <p className="text-xs text-gray-400">
            Last updated: {fleet.lastUpdatedAt}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
