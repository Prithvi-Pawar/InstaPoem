
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/lib/types';
import { Edit2, FileImage, Palette, Trash2 } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';

interface QuoteWithPoemContext extends Quote {
    poemId: string;
    poemText: string;
    photoDataUri?: string;
    photoFileName?: string;
}

interface QuoteHistoryCardProps {
  quote: QuoteWithPoemContext;
  onDelete: (poemId: string, quoteId: string) => void;
}

export default function QuoteHistoryCard({ quote, onDelete }: QuoteHistoryCardProps) {
  
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          {quote.photoDataUri ? (
            <Image 
              src={quote.photoDataUri} 
              alt={quote.photoFileName || "Inspiration photo"} 
              fill={true}
              style={{objectFit: 'cover'}}
              className="rounded-md"
              data-ai-hint="inspiration photo"
            />
          ) : (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-muted rounded-md"
              data-ai-hint="placeholder image"
            >
              <FileImage className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-lg font-medium text-foreground/90 whitespace-pre-wrap font-body italic">“{quote.text}”</p>
        </blockquote>
         <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <Badge variant="secondary">{quote.emotion}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2 p-4 pt-3 border-t border-border/30">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="hover:bg-primary/10 hover:text-primary border-primary text-primary text-xs"
        >
          <Link href={`/quote?fromHistory=${quote.poemId}`}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            View / Edit
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(quote.poemId, quote.id)} 
          className="text-xs"
          aria-label={`Delete quote`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
