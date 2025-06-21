
'use client';

import { usePoemHistory } from '@/hooks/use-poem-history';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import QuoteHistoryCard from '@/components/history/QuoteHistoryCard';
import type { PoemHistoryItem, Quote } from '@/lib/types';
import { useMemo } from 'react';

interface QuoteWithPoemContext extends Quote {
    poemId: string;
    poemText: string;
    photoDataUri?: string;
    photoFileName?: string;
}

export default function QuotesPage() {
  const { history, isHistoryLoading, deleteQuoteFromHistory } = usePoemHistory();

  const allQuotes = useMemo((): QuoteWithPoemContext[] => {
    if (isHistoryLoading) return [];
    
    return history.flatMap((item: PoemHistoryItem) => {
        if (!item.quotes || item.quotes.length === 0) {
            return [];
        }
        return item.quotes.map((quote: Quote) => ({
            ...quote,
            poemId: item.id,
            poemText: item.poem,
            photoDataUri: item.photoDataUri,
            photoFileName: item.photoFileName,
        }));
    }).sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()); // Assuming quote ID is a timestamp or can be parsed as one for sorting
  }, [history, isHistoryLoading]);

  if (isHistoryLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (allQuotes.length === 0) {
    return (
      <Alert className="max-w-md mx-auto border-primary/50 text-center">
        <Archive className="h-6 w-6 mx-auto mb-2 text-primary" />
        <AlertTitle className="font-headline text-xl">No Quotes Yet</AlertTitle>
        <AlertDescription>
          You haven&apos;t created any quotes from your poems. Go to <a href="/history" className="underline text-primary hover:text-accent">My Poems</a>, select a poem, and turn it into a quote!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-headline text-primary mb-2">My Quotes</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Browse through all the quotes you have generated from your poems.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {allQuotes.map(quote => (
          <QuoteHistoryCard 
            key={quote.id} 
            quote={quote} 
            onDelete={deleteQuoteFromHistory} 
          />
        ))}
      </div>
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
