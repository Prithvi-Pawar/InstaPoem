
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, Languages, Loader2, Copy, Check, CalendarDays, ScrollText } from 'lucide-react';
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
  photoFileName: string | null;
  poem: string | null; 
  editedPoem: string;
  onPoemChange: (newPoem: string) => void;
  onSchedulePost: () => void;
}

export default function PoemDisplayEditor({ 
  photoDataUri, 
  photoFileName, 
  poem, 
  editedPoem, 
  onPoemChange,
  onSchedulePost
}: PoemDisplayEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [translatedPoem, setTranslatedPoem] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [showTranslationSection, setShowTranslationSection] = useState(false);

  const languages = [
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Sanskrit', label: 'Sanskrit' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Korean', label: 'Korean' },
  ];

  const { toast } = useToast();

  useEffect(() => {
    // Reset translation state if the base poem or photo changes
    setSelectedLanguage('');
    setTranslatedPoem(null);
    setShowTranslationSection(false);
  }, [photoDataUri, poem]);

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

  const handleCopyToClipboard = (textToCopy: string, type: 'original' | 'translated') => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      if (type === 'original') {
        setCopiedOriginal(true);
        setTimeout(() => setCopiedOriginal(false), 2000);
      } else {
        setCopiedTranslated(true);
        setTimeout(() => setCopiedTranslated(false), 2000);
      }
      toast({ title: "Copied to clipboard!" });
    }
  };
  
  if (!photoDataUri || poem === null) {
    return null; 
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Left Column: Image */}
          <div className="space-y-2">
            <Label className="font-headline text-md text-foreground/90 block text-center md:text-left">Your Inspiration</Label>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-border/30 shadow-md">
              <Image
                src={photoDataUri}
                alt={photoFileName || "User uploaded photo"}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="user photo"
              />
            </div>
             {photoFileName && <p className="text-xs text-muted-foreground text-center truncate pt-1">Photo: {photoFileName}</p>}
          </div>
          
          {/* Right Column: Poem Editor and Actions */}
          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="poem-editor" className="font-headline text-md text-foreground/90 flex items-center gap-1.5">
                <ScrollText className="w-5 h-5 text-primary" />
                Generated Poem
                </Label>
                <Textarea
                id="poem-editor"
                value={editedPoem}
                onChange={(e) => onPoemChange(e.target.value)}
                placeholder="Your poem will appear here. Edit as you like!"
                rows={10}
                className="w-full bg-background/70 focus:ring-accent focus:border-accent text-base font-body leading-relaxed p-3 rounded-md shadow-inner border-border/50 min-h-[200px] max-h-[300px] overflow-y-auto"
                aria-label="Poem editor"
                />
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyToClipboard(editedPoem, 'original')} 
                    className="text-xs text-muted-foreground hover:text-primary"
                    disabled={!editedPoem}
                >
                    {copiedOriginal ? <Check className="mr-1.5 h-3 w-3 text-green-500" /> : <Copy className="mr-1.5 h-3 w-3" />}
                    Copy Original
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="font-headline text-sm flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => setShowTranslationSection(!showTranslationSection)}
              >
                <Languages className="mr-2 h-4 w-4" /> Translate Poem
              </Button>
              <Button 
                variant="default" 
                className="font-headline text-sm flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={onSchedulePost}
                aria-label="Schedule this post"
              >
                <CalendarDays className="mr-2 h-4 w-4" /> Schedule Post
              </Button>
            </div>
             {/* Share to Instagram Button - Placeholder */}
            <Button 
                variant="outline" 
                className="font-headline text-sm w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
                disabled 
                title="Share to Instagram (Feature coming soon)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram mr-2 h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Share to Instagram (Soon)
            </Button>
          </div>
        </div>

        {showTranslationSection && (
          <div className="animate-fade-in pt-4 mt-4 border-t border-border/30">
            <Separator className="my-4 bg-border/30" />
            <h3 className="font-headline text-lg text-primary mb-3 flex items-center gap-2">
              <Languages className="w-5 h-5" /> Translate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="language-select-inline" className="text-sm font-medium">Target Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language-select-inline" className="w-full mt-1 h-10 text-sm">
                    <SelectValue placeholder="Select language..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/45 backdrop-blur-sm">
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value} className="text-sm">{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                  onClick={handleTranslatePoem}
                  disabled={!selectedLanguage || isTranslating || !editedPoem}
                  className="w-full md:w-auto h-10 text-sm font-headline"
              >
                  {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                  {isTranslating ? 'Translating...' : `Translate to ${selectedLanguage || '...'}`}
              </Button>
            </div>

            {translatedPoem && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Translated Poem ({selectedLanguage})</Label>
                <Textarea 
                    value={translatedPoem} 
                    readOnly 
                    rows={8} 
                    className="bg-muted/50 text-base leading-relaxed p-3 rounded-md shadow-inner border-border/50 min-h-[150px] max-h-[250px] overflow-y-auto"
                />
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyToClipboard(translatedPoem, 'translated')}
                    className="text-xs text-muted-foreground hover:text-primary"
                >
                    {copiedTranslated ? <Check className="mr-1.5 h-3 w-3 text-green-500" /> : <Copy className="mr-1.5 h-3 w-3" />}
                    Copy Translated Poem
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs ml-2 border-accent text-accent hover:bg-accent/10 hover:text-accent"
                    onClick={() => {
                        onPoemChange(translatedPoem);
                        toast({ title: "Translated poem applied to editor." });
                    }}
                >
                    Use Translation in Editor
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
