
'use client';

import HistoryList from '@/components/history/HistoryList';

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-headline text-primary mb-2">My Poems</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Browse through your previously generated poems. You can view, edit, or reschedule them.
        </p>
      </header>
      <HistoryList />
    </div>
  );
}
