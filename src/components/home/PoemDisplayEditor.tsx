'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3, Languages, Loader2, Copy, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { translatePoem } from '@/ai/flows/translate-poem-flow';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface PoemDisplayEditorProps {
  photoDataUri: string | null;
  poem: string | null;
  editedPoem: string;
  onPoemChange: (newPoem: string) => void;
}

export default function PoemDisplayEditor({ photoDataUri, poem, editedPoem, onPoemChange }: PoemDisplayEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [translatedPoem, setTranslatedPoem] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const languages = [
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Korean', label: 'Korean' },
  ];

  const handleTranslatePoem = async () => {
    if (!editedPoem || !selectedLanguage) {
      toast({
        variant: "destructive",
        title: "Translation Error",
        description: "Please ensure your poem is not empty and select a target language.",
      });
      return;
    }
    setIsTranslating(true);
    setTranslatedPoem(null); 
    try {
      const result = await translatePoem({ poemText: editedPoem, targetLanguage: selectedLanguage });
      setTranslatedPoem(result.translatedPoem);
    } catch (error) {
      console.error("Error translating poem:", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate poem. Please try again.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (translatedPoem) {
      navigator.clipboard.writeText(translatedPoem);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleUseTranslatedPoem = () => {
    if (translatedPoem) {
      onPoemChange(translatedPoem);
      toast({ title: "Translated poem applied to editor." });
    }
  };
  
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

      <Separator className="my-6 bg-primary/20" />

      <CardHeader className="pt-0">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Languages className="w-5 h-5 text-primary" />
          Translate Your Poem
        </CardTitle>
        <CardDescription>Select a language and translate your edited poem.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="language-select" className="font-headline text-sm">Target Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language-select" className="w-full mt-1 h-11 text-base">
                <SelectValue placeholder="Select language..." />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value} className="text-base">{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleTranslatePoem}
            disabled={!selectedLanguage || isTranslating || !editedPoem}
            className="w-full md:w-auto h-11 text-base font-headline"
            size="lg"
          >
            {isTranslating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Languages className="mr-2 h-4 w-4" />
            )}
            {isTranslating ? 'Translating...' : 'Translate Poem'}
          </Button>
        </div>

        {translatedPoem && (
          <div className="mt-6 space-y-2 animate-fade-in">
            <Label htmlFor="translated-poem-display" className="font-headline text-lg">Translated Poem ({selectedLanguage})</Label>
            <div className="relative">
              <Textarea
                id="translated-poem-display"
                value={translatedPoem}
                readOnly
                rows={10}
                className="w-full bg-muted/30 p-4 rounded-md shadow-inner text-base leading-relaxed focus:ring-accent focus:border-accent"
                aria-label="Translated poem"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCopyToClipboard}
                aria-label="Copy translated poem"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleUseTranslatedPoem} variant="outline" className="mt-2 font-headline text-base h-11">
              Use Translated Poem in Editor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
