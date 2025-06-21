
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
import { AlertTriangle, Download, Languages, Loader2, Sparkles, Wand2, Palette } from 'lucide-react';
import { generateQuoteFromPoem } from '@/ai/flows/generate-quote-from-poem';
import { translatePoem } from '@/ai/flows/translate-poem-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { Switch } from '@/components/ui/switch';

const emotions = [
  'Love', 'Sadness', 'Happiness', 'Anger', 'Fear', 'Hope', 'Peace / Calm', 'Loneliness', 'Motivation'
];

const languageList = [
    { value: 'Spanish', label: 'Spanish' }, { value: 'French', label: 'French' }, { value: 'German', label: 'German' }, 
    { value: 'Italian', label: 'Italian' }, { value: 'Portuguese', label: 'Portuguese' }, { value: 'Japanese', label: 'Japanese' },
    { value: 'Hindi', label: 'Hindi' }, { value: 'Arabic', label: 'Arabic' }, { value: 'Russian', label: 'Russian' },
    { value: 'Marathi', label: 'Marathi' }, { value: 'Sanskrit', label: 'Sanskrit' },
];

const MinimalLayout = ({ quoteText, author, quoteCardRef }: { quoteText: string; author: string, quoteCardRef: React.RefObject<HTMLDivElement> }) => (
    <div 
        ref={quoteCardRef}
        className="bg-white dark:bg-black text-black dark:text-white min-h-[400px] w-full flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative aspect-square"
    >
        <div className="flex flex-col items-center justify-center text-center">
            <p className="font-playfair italic text-2xl md:text-3xl leading-relaxed">
                “{quoteText}”
            </p>
            <p className="font-cormorant font-light text-base mt-4 tracking-wider">
                - {author}
            </p>
        </div>
    </div>
);

const ArtisticLayout = ({ quoteText, author, imageSrc, imageOrientation, quoteCardRef }: { quoteText: string; author: string; imageSrc: string; imageOrientation: 'vertical' | 'horizontal', quoteCardRef: React.RefObject<HTMLDivElement> }) => (
    <div 
        ref={quoteCardRef}
        className="bg-[#FDFBF6] dark:bg-stone-900 text-stone-800 dark:text-stone-200 min-h-[400px] w-full flex p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative aspect-square overflow-hidden"
    >
        <svg className="absolute w-0 h-0">
            <defs>
                <clipPath id="splash-mask" clipPathUnits="objectBoundingBox">
                    <path d="M0.06,0.37 C-0.1,0.61,0.06,0.92,0.11,0.98 C0.16,1.04,0.3,0.97,0.49,0.98 C0.68,1,0.85,1.01,0.93,0.94 C1.01,0.87,1,0.72,0.98,0.51 C0.97,0.3,0.99,0.11,0.91,0.04 C0.83,-0.03,0.67,0,0.48,0.02 C0.29,0.03,0.14,0,0.1,0.07 C0.06,0.13,0.12,0.27,0.06,0.37 Z"></path>
                </clipPath>
            </defs>
        </svg>
        <div className={cn("w-full h-full flex items-center justify-center gap-6", imageOrientation === 'horizontal' ? 'flex-col' : 'flex-row')}>
            <div className={cn("relative", imageOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full')}>
                <Image 
                    src={imageSrc} 
                    alt="Artistic background" 
                    layout="fill" 
                    objectFit="cover" 
                    className="opacity-90"
                    style={{ clipPath: 'url(#splash-mask)' }}
                />
            </div>
            <div className={cn("relative flex flex-col justify-center", imageOrientation === 'horizontal' ? 'w-full h-1/2 text-center items-center' : 'w-1/2 h-full')}>
                <p className="font-libre text-xl md:text-2xl leading-relaxed">
                    “{quoteText}”
                </p>
                <p className="font-cormorant font-light text-sm mt-4 tracking-wider">
                    - {author}
                </p>
            </div>
        </div>
    </div>
);


function QuoteGenerator() {
  const searchParams = useSearchParams();
  const { getHistoryItem, saveQuoteToHistory, isHistoryLoading } = usePoemHistory();
  const { toast } = useToast();

  const [poemItem, setPoemItem] = useState<PoemHistoryItem | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const [artisticMode, setArtisticMode] = useState(false);
  const [imageOrientation, setImageOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  const quoteCardRef = useRef<HTMLDivElement>(null);
  const poemId = useMemo(() => searchParams.get('fromHistory'), [searchParams]);

  useEffect(() => {
    if (poemId && !isHistoryLoading) {
      const item = getHistoryItem(poemId);
      if (item) {
        setPoemItem(item);
        if (item.photoDataUri) {
          const img = document.createElement('img');
          img.src = item.photoDataUri;
          img.onload = () => {
            if (img.naturalHeight > img.naturalWidth) {
                setImageOrientation('vertical');
            } else {
                setImageOrientation('horizontal');
            }
          };
        }
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
      pixelRatio: 2,
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
    setCurrentQuote(null);
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
          Select an emotion and style to transform a piece of your poem into a powerful, shareable quote.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
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
                    <div className="flex items-center space-x-2">
                        <Switch id="artistic-mode" checked={artisticMode} onCheckedChange={setArtisticMode} />
                        <Label htmlFor="artistic-mode" className="font-medium text-foreground/90">Artistic Style</Label>
                    </div>
                </div>
                <Button onClick={handleGenerateQuote} disabled={!selectedEmotion || isGenerating} className="w-full font-headline py-3 text-lg">
                    {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Generate Quote'}
                </Button>
            </CardContent>
        </Card>

        <div className="space-y-6">
             {isGenerating ? (
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-950 min-h-[400px] w-full flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative aspect-square">
                    <div className="text-center text-muted-foreground">
                        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                        <p className="mt-2 font-medium">Crafting your quote...</p>
                    </div>
                </div>
            ) : currentQuote ? (
                artisticMode ? (
                    <ArtisticLayout 
                        quoteText={currentQuote.text} 
                        author="InstaPoem" 
                        imageSrc={poemItem.photoDataUri!} 
                        imageOrientation={imageOrientation}
                        quoteCardRef={quoteCardRef}
                    />
                ) : (
                    <MinimalLayout 
                        quoteText={currentQuote.text} 
                        author="InstaPoem" 
                        quoteCardRef={quoteCardRef}
                    />
                )
            ) : (
                 <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-950 min-h-[400px] w-full flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative aspect-square">
                    <div className="text-center text-muted-foreground">
                        <p>Your quote will appear here.</p>
                    </div>
                </div>
            )}


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

    