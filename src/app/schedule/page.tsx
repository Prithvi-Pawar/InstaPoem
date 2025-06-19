
// src/app/schedule/page.tsx
'use client';

import { CalendarClock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-headline text-primary mb-3">Your Scheduled Poems</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          This page will display all your upcoming scheduled posts.
        </p>
      </header>
      
      <Alert className="max-w-md mx-auto border-primary/50 text-center bg-card/80 backdrop-blur-sm">
        <CalendarClock className="h-8 w-8 mx-auto mb-3 text-primary" />
        <AlertTitle className="font-headline text-2xl text-primary">Coming Soon!</AlertTitle>
        <AlertDescription className="text-foreground/90">
          The ability to view all your scheduled poems in one place is currently under development. 
          <br />
          For now, you can manage individual scheduled poems from the <Link href="/history" className="underline text-accent hover:text-accent/80">My Poems</Link> page after scheduling.
        </AlertDescription>
      </Alert>

      {/* 
        Future implementation might include:
        - A list or calendar view of scheduled items.
        - Options to unschedule or edit scheduled posts directly from this page.
      */}
    </div>
  );
}
```