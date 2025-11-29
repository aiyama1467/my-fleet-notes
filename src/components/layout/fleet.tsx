import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type FleetItem = {
  id: string;
  title: string;
  tags: string[];
  memo: string;
  createdAt: string;
  lastUpdatedAt: string;
};

export function Fleet(fleet: FleetItem) {
  const formattedCreated = format(
    new Date(fleet.createdAt),
    'yyyy/MM/dd HH:mm',
    {
      locale: ja,
    },
  );
  const lastUpdatedRelative = formatDistanceToNow(
    new Date(fleet.lastUpdatedAt),
    {
      addSuffix: true,
      locale: ja,
    },
  );

  return (
    <div className="grid gap-4 sm:gap-6">
      <Card key={fleet.id}>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{fleet.title}</CardTitle>
            <Button size="sm">Edit</Button>
          </div>
          <div className="flex gap-2">
            {fleet.tags.map((tag) => (
              <span
                className="rounded-full border border-border px-2 py-0.5 text-xs"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {fleet.memo}
          </p>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          <p className="text-xs">作成: {formattedCreated}</p>
          <p className="text-xs">更新: {lastUpdatedRelative}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
