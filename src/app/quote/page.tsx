
'use client';

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem, Quote } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Download, Languages, Loader2, Sparkles, Wand2, PenLine } from 'lucide-react';
import { generateQuoteFromPoem } from '@/ai/flows/generate-quote-from-poem';
import { translatePoem } from '@/ai/flows/translate-poem-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';

const emotions = [
  'Love', 'Sadness', 'Happiness', 'Anger', 'Fear', 'Hope', 'Peace / Calm', 'Loneliness', 'Motivation'
];

const languageList = [
    { value: 'Spanish', label: 'Spanish' }, { value: 'French', label: 'French' }, { value: 'German', label: 'German' }, 
    { value: 'Italian', label: 'Italian' }, { value: 'Portuguese', label: 'Portuguese' }, { value: 'Japanese', label: 'Japanese' },
    { value: 'Hindi', label: 'Hindi' }, { value: 'Arabic', label: 'Arabic' }, { value: 'Russian', label: 'Russian' },
];

const fontList = [
    { value: 'font-body', label: 'Serif (Alegreya)'},
    { value: 'font-headline', label: 'Sans-serif (Belleza)'},
    { value: '[font-family:cursive]', label: 'Cursive' },
    { value: 'font-mono', label: 'Monospace' },
];

function QuoteGenerator() {
  const searchParams = useSearchParams();
  const { getHistoryItem, saveQuoteToHistory, isHistoryLoading } = usePoemHistory();
  const { toast } = useToast();

  const [poemItem, setPoemItem] = useState<PoemHistoryItem | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('font-body');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const quoteCardRef = useRef<HTMLDivElement>(null);
  const poemId = useMemo(() => searchParams.get('fromHistory'), [searchParams]);

  useEffect(() => {
    if (poemId && !isHistoryLoading) {
      const item = getHistoryItem(poemId);
      if (item) {
        setPoemItem(item);
      }
    }
  }, [poemId, isHistoryLoading, getHistoryItem]);
  
  const handleDownloadImage = useCallback(() => {
    if (quoteCardRef.current === null) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find quote card to download.' });
      return;
    }

    toast({ title: 'Generating image...', description: 'Your download will start shortly.' });

    toPng(quoteCardRef.current, { 
      cacheBust: true, 
      pixelRatio: 2, // Higher resolution
      style: {
        margin: '0',
        // Inlining styles for download to ensure consistency
      }
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      const fileName = currentQuote?.text.substring(0, 20).replace(/\s+/g, '_').toLowerCase() || 'instapoem_quote';
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Failed to download image', err);
      toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not create the image. Please try again.' });
    });
  }, [quoteCardRef, currentQuote, toast]);

  const handleGenerateQuote = async () => {
    if (!poemItem || !selectedEmotion) {
        toast({ variant: 'destructive', title: 'Please select an emotion first.' });
        return;
    }
    setIsGenerating(true);
    setCurrentQuote(null); // Clear previous quote
    try {
        const result = await generateQuoteFromPoem({ poemText: poemItem.poem, emotion: selectedEmotion });
        const newQuote: Quote = {
            id: crypto.randomUUID(),
            emotion: selectedEmotion,
            text: result.quote,
        };
        setCurrentQuote(newQuote);
        saveQuoteToHistory(poemItem.id, newQuote);
        toast({ title: 'New quote generated!', description: 'You can now translate or download it.' });
    } catch (error) {
        console.error('Error generating quote:', error);
        toast({ variant: 'destructive', title: 'Quote Generation Failed', description: 'Please try again.' });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleTranslateQuote = async () => {
    if (!currentQuote || !selectedLanguage) {
        toast({ variant: "destructive", title: "Missing quote or language" });
        return;
    }
    setIsTranslating(true);
    try {
        const result = await translatePoem({ poemText: currentQuote.text, targetLanguage: selectedLanguage });
        const updatedQuote = { ...currentQuote, translatedText: result.translatedPoem, translatedLanguage: selectedLanguage };
        setCurrentQuote(updatedQuote);
        if(poemItem) saveQuoteToHistory(poemItem.id, updatedQuote);
    } catch (error) {
         console.error("Error translating quote:", error);
         toast({ variant: "destructive", title: "Translation Failed", description: "Could not translate quote." });
    } finally {
        setIsTranslating(false);
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin" />
        <p>Loading poem data...</p>
      </div>
    );
  }
  
  if (!poemItem) {
    return (
        <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Poem Not Found</AlertTitle>
            <AlertDescription>
                Could not load the poem data. Please go back to the <a href="/history" className="underline">My Poems</a> page and try again.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline text-primary mb-3">Turn Your Poem into a Quote</h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Select an emotion and font to transform a piece of your poem into a powerful, shareable quote.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Panel */}
        <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent flex items-center">
                    <Wand2 className="w-6 h-6 mr-2" />
                    Quote Controls
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={poemItem.photoDataUri || 'https://placehold.co/600x400.png'} alt={poemItem.photoFileName || 'Poem inspiration'} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="emotion-select" className="font-medium text-foreground/90">Choose an emotion</Label>
                        <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                            <SelectTrigger id="emotion-select" className="bg-background/50">
                                <SelectValue placeholder="Select an emotion..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover/80 backdrop-blur-sm">
                                {emotions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="font-select" className="font-medium text-foreground/90">Choose a font style</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                            <SelectTrigger id="font-select" className="bg-background/50">
                                <SelectValue placeholder="Select a font..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover/80 backdrop-blur-sm">
                                {fontList.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={handleGenerateQuote} disabled={!selectedEmotion || isGenerating} className="w-full font-headline py-3 text-lg">
                    {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Generate Quote'}
                </Button>
            </CardContent>
        </Card>

        {/* Right Panel */}
        <div className="space-y-6">
            <div ref={quoteCardRef} className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-950 min-h-[280px] flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative">
                {isGenerating ? (
                    <div className="text-center text-muted-foreground">
                        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                        <p className="mt-2 font-medium">Crafting your quote...</p>
                    </div>
                ) : currentQuote ? (
                    <blockquote className="text-center w-full space-y-6">
                        <p className={cn("text-3xl lg:text-4xl leading-tight text-foreground/90", selectedFont)}>
                            “{currentQuote.text}”
                        </p>
                    </blockquote>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <p>Your quote will appear here.</p>
                    </div>
                )}
                 <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-foreground/40 dark:text-foreground/30">
                    <PenLine className="w-3 h-3"/>
                    <span className="font-headline text-xs">InstaPoem</span>
                 </div>
            </div>

            {currentQuote && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleGenerateQuote} variant="outline" className="flex-1" disabled={isGenerating}>
                            <Wand2 className="w-4 h-4 mr-2"/> Regenerate Quote
                        </Button>
                         <Button onClick={handleDownloadImage} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2"/> Download as Image
                        </Button>
                    </div>

                    <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl text-accent flex items-center gap-2">
                                <Languages className="w-5 h-5" /> Translate Quote
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4 items-end">
                                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                    <SelectTrigger><SelectValue placeholder="Select language..." /></SelectTrigger>
                                    <SelectContent className="bg-popover/80 backdrop-blur-sm">
                                        {languageList.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleTranslateQuote} disabled={!selectedLanguage || isTranslating} className="w-full md:w-auto">
                                    {isTranslating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2"/>}
                                    Translate
                                </Button>
                            </div>
                            {(isTranslating || currentQuote.translatedText) && (
                                <div className="pt-2">
                                    {isTranslating ? (
                                        <Skeleton className="h-20 w-full" />
                                    ) : (
                                       <Textarea 
                                            value={currentQuote.translatedText} 
                                            readOnly 
                                            rows={3} 
                                            className="bg-muted/50 text-base leading-relaxed p-3 rounded-md shadow-inner"
                                       />
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
    return (
        <Suspense fallback={<div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>}>
            <QuoteGenerator />
        </Suspense>
    )
}
