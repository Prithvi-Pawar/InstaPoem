'use client';

import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';

interface PoemDisplayEditorProps {
  photoDataUri: string | null;
  poem: string | null;
  editedPoem: string;
  onPoemChange: (newPoem: string) => void;
}

export default function PoemDisplayEditor({ photoDataUri, poem, editedPoem, onPoemChange }: PoemDisplayEditorProps) {
  if (!photoDataUri || poem === null) {
    return null; 
  }

  return (
    <Card className="w-full shadow-lg animate-fade-in mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your InstaPoem</CardTitle>
        <CardDescription>Review your generated poem and make any desired edits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {photoDataUri && (
            <div className="space-y-2">
              <Label className="font-headline text-lg">Your Photo</Label>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border shadow-sm">
                <Image
                  src={photoDataUri}
                  alt="User uploaded photo for poem generation"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint="user photo"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="poem-editor" className="font-headline text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit Your Poem
            </Label>
            <Textarea
              id="poem-editor"
              value={editedPoem}
              onChange={(e) => onPoemChange(e.target.value)}
              placeholder="Your poem will appear here. Edit as you like!"
              rows={15}
              className="w-full bg-background/80 focus:ring-accent focus:border-accent text-base leading-relaxed p-4 rounded-md shadow-inner"
              aria-label="Poem editor"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
