
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3, Languages, Loader2, Copy, Check, CalendarDays, Share2, Save, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { translatePoem } from '@/ai/flows/translate-poem-flow';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface PoemDisplayEditorProps {
  photoDataUri: string | null;
  photoFileName: string | null;
  poem: string | null; 
  editedPoem: string;
  onPoemChange: (newPoem: string) => void;
}

export default function PoemDisplayEditor({ 
  photoDataUri, 
  photoFileName, 
  poem, 
  editedPoem, 
  onPoemChange 
}: PoemDisplayEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [translatedPoem, setTranslatedPoem] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
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

  useEffect(() => {
    setSelectedLanguage('');
    setTranslatedPoem(null);
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

  const handleCopyToClipboard = (textToCopy: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleUseTranslatedPoem = () => {
    if (translatedPoem) {
      onPoemChange(translatedPoem);
      setIsTranslationModalOpen(false); // Close modal after applying
      toast({ title: "Translated poem applied to editor." });
    }
  };
  
  if (!photoDataUri || poem === null) {
    return null; 
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl bg-card">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="space-y-3">
            <Label className="font-headline text-lg text-foreground/90">Your Inspiration</Label>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border shadow-md">
              <Image
                src={photoDataUri}
                alt={photoFileName || "User uploaded photo"}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="user photo"
              />
            </div>
             {photoFileName && <p className="text-xs text-muted-foreground text-center truncate">Photo: {photoFileName}</p>}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="poem-editor" className="font-headline text-lg text-foreground/90 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Your Poem
            </Label>
            <Textarea
              id="poem-editor"
              value={editedPoem}
              onChange={(e) => onPoemChange(e.target.value)}
              placeholder="Your poem will appear here. Edit as you like!"
              rows={15}
              className="w-full bg-background/80 focus:ring-accent focus:border-accent text-base font-body leading-relaxed p-4 rounded-md shadow-inner border-border"
              aria-label="Poem editor"
            />
          </div>
        </div>

        <Separator className="my-6 bg-border" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Dialog open={isTranslationModalOpen} onOpenChange={setIsTranslationModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-headline text-base h-11 w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                <Languages className="mr-2 h-4 w-4" /> Translate Poem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                  <Languages className="w-6 h-6 text-primary" /> Translate Your Poem
                </DialogTitle>
                <DialogDescription>
                  Select a language to translate your current poem. The translation will appear on the right.
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4 flex-grow overflow-y-auto py-4">
                <div className="space-y-2">
                  <Label className="font-headline">Original Poem</Label>
                  <Textarea value={editedPoem} readOnly rows={10} className="bg-muted/30 text-base leading-relaxed"/>
                </div>
                <div className="space-y-2">
                  <Label className="font-headline">Translated Poem ({selectedLanguage || '...'})</Label>
                  <Textarea value={translatedPoem || ''} readOnly rows={10} className="bg-muted/30 text-base leading-relaxed"/>
                </div>
              </div>
               <div className="space-y-3 mt-auto pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                        <Label htmlFor="language-select-modal" className="font-headline text-sm">Target Language</Label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger id="language-select-modal" className="w-full mt-1 h-11 text-base">
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
                        className="w-full h-11 text-base font-headline"
                    >
                        {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                        {isTranslating ? 'Translating...' : 'Translate'}
                    </Button>
                </div>
                {translatedPoem && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button variant="outline" onClick={() => handleCopyToClipboard(translatedPoem)} className="w-full sm:w-auto h-10 text-base">
                        {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy
                        </Button>
                        <Button onClick={handleUseTranslatedPoem} className="w-full sm:w-auto h-10 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                            <Save className="mr-2 h-4 w-4" /> Use Translation
                        </Button>
                    </div>
                )}
              </div>
              <DialogFooter className="sm:justify-start mt-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    <X className="mr-2 h-4 w-4" /> Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="font-headline text-base h-11 w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
            onClick={() => document.getElementById('scheduling-form')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll to schedule post section"
          >
            <CalendarDays className="mr-2 h-4 w-4" /> Schedule Post
          </Button>
          <Button 
            variant="outline" 
            className="font-headline text-base h-11 w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
            disabled // Disabled for now as functionality is not implemented
            title="Share to Instagram (Feature coming soon)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram mr-2 h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            Share to Instagram
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
