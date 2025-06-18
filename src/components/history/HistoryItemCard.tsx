
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PoemHistoryItem } from '@/lib/types';
import { CalendarDays, Clock, Hash, Edit, Trash2, Repeat } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryItemCardProps {
  item: PoemHistoryItem;
  onDelete: (id: string) => void;
}

export default function HistoryItemCard({ item, onDelete }: HistoryItemCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image 
            src={item.photoDataUri} 
            alt={item.photoFileName || "Historic photo"} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="historic photo"
          />
        </div>
        <CardTitle className="mt-4 font-headline text-xl truncate" title={item.photoFileName || "Poem"}>
          Poem for: {item.photoFileName || "Untitled Photo"}
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-1.5" />
          Created: {format(new Date(item.createdAt), "PPP")}
        </CardDescription>
        {item.scheduledAt && (
           <CardDescription className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1.5" />
            Scheduled: {format(new Date(item.scheduledAt), "PPP p")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4 text-foreground/90 whitespace-pre-wrap font-body">{item.poem}</p>
        {item.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 items-center text-sm">
            <Hash className="w-4 h-4 text-primary" />
            {item.hashtags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground border-accent text-accent"
        >
          <Link href={`/?fromHistory=${item.id}`}>
            <Repeat className="w-4 h-4 mr-2" />
            Use this Poem
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(item.id)} 
          className="w-full sm:w-auto"
          aria-label={`Delete poem for ${item.photoFileName || "Untitled Photo"}`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
