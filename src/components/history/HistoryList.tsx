'use client';

import { usePoemHistory } from '@/hooks/use-poem-history';
import HistoryItemCard from './HistoryItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Archive } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HistoryList() {
  const { history, deleteHistoryItem, isHistoryLoading } = usePoemHistory();

  if (isHistoryLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Alert className="max-w-md mx-auto border-primary/50 text-center">
        <Archive className="h-6 w-6 mx-auto mb-2 text-primary" />
        <AlertTitle className="font-headline text-xl">No History Yet</AlertTitle>
        <AlertDescription>
          You haven&apos;t created or scheduled any poems. Go back to the <a href="/" className="underline text-primary hover:text-accent">homepage</a> to start creating!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      {history.map(item => (
        <HistoryItemCard key={item.id} item={item} onDelete={deleteHistoryItem} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
}
