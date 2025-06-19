
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PoemHistoryItem } from '@/lib/types';
import { CalendarDays, Clock, Hash, Edit2, Trash2, Eye } from 'lucide-react'; // Changed Edit to Edit2 or Eye
import { format } from 'date-fns';

interface HistoryItemCardProps {
  item: PoemHistoryItem;
  onDelete: (id: string) => void;
}

export default function HistoryItemCard({ item, onDelete }: HistoryItemCardProps) {
  const isScheduled = !!item.scheduledAt;
  
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image 
            src={item.photoDataUri} 
            alt={item.photoFileName || "Historic photo"} 
            fill={true}
            style={{objectFit: 'cover'}}
            className="rounded-md"
            data-ai-hint="historic photo"
          />
        </div>
        <CardTitle className="mt-3 font-headline text-lg truncate text-primary" title={item.photoFileName || "Poem"}>
          {item.photoFileName || "Untitled Poem"}
        </CardTitle>
        <div className="space-y-0.5">
            <CardDescription className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="w-3 h-3 mr-1.5 flex-shrink-0" />
            Created: {format(new Date(item.createdAt), "MMM d, yyyy")}
            </CardDescription>
            {isScheduled && (
            <CardDescription className="flex items-center text-xs text-accent font-medium">
                <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                Scheduled: {format(new Date(item.scheduledAt!), "MMM d, yyyy 'at' p")}
            </CardDescription>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="line-clamp-3 text-sm text-foreground/90 whitespace-pre-wrap font-body">{item.poem}</p>
        {item.hashtags && item.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 items-center text-xs">
            <Hash className="w-3 h-3 text-primary" />
            {item.hashtags.slice(0, 3).map((tag, index) => ( // Show limited tags
              <span key={index} className="px-1.5 py-0.5 bg-secondary/70 text-secondary-foreground rounded-full text-[10px]">
                {tag}
              </span>
            ))}
            {item.hashtags.length > 3 && <span className="text-muted-foreground text-[10px]">+{item.hashtags.length - 3} more</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 pt-3 border-t border-border/30">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary border-primary text-primary text-xs"
        >
          <Link href={`/?fromHistory=${item.id}`}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            View / Edit
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(item.id)} 
          className="w-full sm:w-auto text-xs"
          aria-label={`Delete poem for ${item.photoFileName || "Untitled Photo"}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
