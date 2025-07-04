
'use client';

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem, Quote } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Download, Languages, Loader2, Sparkles, Wand2, Edit2 } from 'lucide-react';
import { generateQuoteFromPoem } from '@/ai/flows/generate-quote-from-poem';
import { translatePoem } from '@/ai/flows/translate-poem-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { toPng } from 'html-to-image';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const emotions = [
  'Love', 'Sadness', 'Happiness', 'Anger', 'Fear', 'Hope', 'Peace / Calm', 'Loneliness', 'Motivation'
];

const languageList = [
    { value: 'Spanish', label: 'Spanish' }, { value: 'French', label: 'French' }, { value: 'German', label: 'German' }, 
    { value: 'Italian', label: 'Italian' }, { value: 'Portuguese', label: 'Portuguese' }, { value: 'Japanese', label: 'Japanese' },
    { value: 'Hindi', label: 'Hindi' }, { value: 'Arabic', label: 'Arabic' }, { value: 'Russian', label: 'Russian' },
    { value: 'Marathi', label: 'Marathi' }, { value: 'Sanskrit', label: 'Sanskrit' },
];

const quoteFonts = [
    { value: 'font-playfair', label: 'Playfair Display' },
    { value: 'font-libre', label: 'Libre Baskerville' },
    { value: 'font-cormorant', label: 'Cormorant Garamond' },
    { value: 'font-georgia', label: 'Georgia' },
    { value: 'font-lora', label: 'Lora' },
    { value: 'font-montserrat', label: 'Montserrat' },
    { value: 'font-italiana', label: 'Italiana' },
];

const authorFonts = [
    { value: 'font-montserrat', label: 'Montserrat' },
    { value: 'font-cormorant', label: 'Cormorant' },
    { value: 'font-raleway', label: 'Raleway' },
    { value: 'font-dancing', label: 'Dancing Script' },
    { value: 'font-allura', label: 'Allura' },
    { value: 'font-lato', label: 'Lato Light' },
    { value: 'font-josefin', label: 'Josefin Sans' },
];

const MinimalLayout = ({ text, author, fontSize, positionX, positionY, onMouseDown, quoteFont, authorFont }: { text: string; author: string, fontSize: number, positionX: number, positionY: number, onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void, quoteFont: string, authorFont: string }) => (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-[400px] w-full flex items-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in relative aspect-square">
        <div 
            onMouseDown={onMouseDown}
            data-draggable="true"
            className="absolute text-center"
            style={{
                left: `${positionX}%`,
                top: `${positionY}%`,
                transform: 'translate(-50%, -50%)',
                width: '90%',
                cursor: 'grab',
            }}
        >
            <p className={cn("leading-relaxed italic", quoteFont)} style={{ fontSize: `${fontSize}px` }}>
                “{text}”
            </p>
            <p className={cn("font-light text-lg mt-4 tracking-wider", authorFont)}>
                - {author}
            </p>
        </div>
    </div>
);

const ArtisticLayout = ({ text, author, imageSrc, aspectRatio, fontSize, positionX, positionY, onMouseDown, quoteFont, authorFont }: { text: string; author: string; imageSrc: string; aspectRatio: number | null, fontSize: number, positionX: number, positionY: number, onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void, quoteFont: string, authorFont: string }) => (
    <div 
        className="relative w-full overflow-hidden rounded-lg shadow-inner"
        style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: aspectRatio || '1 / 1',
        }}
    >
        <div className="absolute inset-0 bg-black/30" />
        <div 
            className="absolute inset-0 bg-repeat mix-blend-overlay"
            style={{
                backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY2IiIiPj4+BgYF9fX1cXFxycnKvr6+uru+Hc3w5AAAAEXRSTlMAw8i/6LLA9O4S2dO0W1lVGC436gAAAOVJREFUeNrt1slOAkEURdGY0BptGABt3v//n/R3RpAQoGO6k9k/vC5sO3s7j2w+sQvI5hQ2kC4nC4V0I9/g0D5F4KR4qC4c2pT2vQoB5+o6wQ8f0FBd6DRk7u8UDax1qGZzI9nIqQ3i5bQ3QyDYi4w5jX1Wn3UaB5A5jT5sC6vSgD2EMh9e4nlyT4Ugl+eHwzxTTnwzEbgnA4YyqD/fOAPgC/wzxr0DzcL3ri8JcNpgyyI+dLTAmfJDNMGVCREpP2gSQJ0QET7v74fCfjwJp5yH2p4cR+iTqjYCQo2kAEj2d+OKQG7om4S4T1sV0C5f2hCw2hChAOT54Am1Wb4sRqCgAc2gQzGkQ3Ec6JkC3IuKB3wJpE2QCwDZoBLD4kQWY0wAMmJMyAm0SZAeYk2gAMi5M0WkFmmLAAmU0ydJgEmsm2ALiZdkBZmQxNwmok2gA0JJoA5GTaABzkfJgArcn2gD4s/pA3A5MEiQhGgw2QGajv+wA8Bms2e+nANg2A7M9sL4PAHbyX2sB8Bw4z2BB8CgENz5eNFZ68w3sS7CgQ3TzwwL8x/g1IuI5e2w/5wJAB4yfrxfe2wQYAEi+qgY+r33kAAAAAElFTkSuQmCC')`,
                opacity: 0.15,
            }}
        />
        <div 
            onMouseDown={onMouseDown}
            data-draggable="true"
            className="absolute z-10 text-center text-white"
            style={{ 
                left: `${positionX}%`,
                top: `${positionY}%`,
                transform: 'translate(-50%, -50%)',
                width: '90%',
                textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
                cursor: 'grab'
            }}
        >
            <div>
                <p className={cn("leading-relaxed", quoteFont)} style={{ fontSize: `${fontSize}px` }}>
                    “{text}”
                </p>
                <p className={cn("font-light text-lg mt-4 tracking-wider", authorFont)}>
                    - {author}
                </p>
            </div>
        </div>
    </div>
);


function QuoteGenerator() {
  const searchParams = useSearchParams();
  const { getHistoryItem, saveQuoteToHistory, isHistoryLoading, deleteQuoteFromHistory } = usePoemHistory();
  const { toast } = useToast();

  const [poemItem, setPoemItem] = useState<PoemHistoryItem | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  
  const [editableQuoteText, setEditableQuoteText] = useState('');
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [fontSize, setFontSize] = useState(32);

  const [styleMode, setStyleMode] = useState<'minimal' | 'artistic'>('minimal');
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  
  const [authorText, setAuthorText] = useState('InstaPoem');
  const [quoteFont, setQuoteFont] = useState('font-playfair');
  const [authorFont, setAuthorFont] = useState('font-cormorant');

  const quoteCardRef = useRef<HTMLDivElement>(null);
  const poemId = useMemo(() => searchParams.get('fromHistory'), [searchParams]);

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (poemId && !isHistoryLoading) {
      const item = getHistoryItem(poemId);
      if (item) {
        setPoemItem(item);
        if (item.photoDataUri) {
          const img = new window.Image();
          img.onload = () => {
            if (img.width > 0 && img.height > 0) {
              setImageAspectRatio(img.width / img.height);
            }
          };
          img.src = item.photoDataUri;
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
      const fileName = editableQuoteText.substring(0, 20).replace(/\s+/g, '_').toLowerCase() || 'instapoem_quote';
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Failed to download image', err);
      toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not create the image. Please try again.' });
    });
  }, [quoteCardRef, editableQuoteText, toast]);

  const handleGenerateQuote = async () => {
    if (!poemItem || !selectedEmotion) {
        toast({ variant: 'destructive', title: 'Please select an emotion first.' });
        return;
    }
    setIsGenerating(true);
    setCurrentQuote(null);
    setEditableQuoteText('');
    try {
        const result = await generateQuoteFromPoem({ poemText: poemItem.poem, emotion: selectedEmotion });
        const newQuote: Quote = {
            id: crypto.randomUUID(),
            emotion: selectedEmotion,
            text: result.quote,
        };
        setCurrentQuote(newQuote);
        setEditableQuoteText(newQuote.text);
        saveQuoteToHistory(poemItem.id, newQuote);
        toast({ title: 'New quote generated!', description: 'You can now customize, translate or download it.' });
    } catch (error) {
        console.error('Error generating quote:', error);
        toast({ variant: 'destructive', title: 'Quote Generation Failed', description: 'Please try again.' });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleTranslateQuote = async () => {
    if (!currentQuote || !selectedLanguage || !editableQuoteText) {
        toast({ variant: "destructive", title: "Missing quote or language" });
        return;
    }
    setIsTranslating(true);
    try {
        const result = await translatePoem({ poemText: editableQuoteText, targetLanguage: selectedLanguage });
        const updatedQuote = { ...currentQuote, translatedText: result.translatedPoem, translatedLanguage: selectedLanguage };
        setCurrentQuote(updatedQuote);
        setEditableQuoteText(result.translatedPoem); // Automatically update preview
        if(poemItem) saveQuoteToHistory(poemItem.id, updatedQuote);
    } catch (error) {
         console.error("Error translating quote:", error);
         toast({ variant: "destructive", title: "Translation Failed", description: "Could not translate quote." });
    } finally {
        setIsTranslating(false);
    }
  };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!quoteCardRef.current) return;
        e.preventDefault();
        setIsDragging(true);

        const textElement = e.currentTarget;
        const textRect = textElement.getBoundingClientRect();
        
        dragOffsetRef.current = {
            x: e.clientX - textRect.left,
            y: e.clientY - textRect.top,
        };
        
        textElement.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !quoteCardRef.current) return;
        e.preventDefault();
        const containerRect = quoteCardRef.current.getBoundingClientRect();

        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        
        const textElement = quoteCardRef.current.querySelector('[data-draggable="true"]');
        if (!textElement) return;
        const textRect = textElement.getBoundingClientRect();

        const newCenterX = (relativeX - dragOffsetRef.current.x) + (textRect.width / 2);
        const newCenterY = (relativeY - dragOffsetRef.current.y) + (textRect.height / 2);

        let newPosX = (newCenterX / containerRect.width) * 100;
        let newPosY = (newCenterY / containerRect.height) * 100;

        newPosX = Math.max(0, Math.min(100, newPosX));
        newPosY = Math.max(0, Math.min(100, newPosY));

        setPositionX(newPosX);
        setPositionY(newPosY);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const textElement = quoteCardRef.current?.querySelector('[data-draggable="true"]');
        if (textElement) {
            (textElement as HTMLElement).style.cursor = 'grab';
        }
        document.body.style.cursor = 'default';
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
  
  const rightPanelAspectRatio = (styleMode === 'artistic' && imageAspectRatio) ? imageAspectRatio : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline text-primary mb-3">Turn Your Poem into a Quote</h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Select an emotion and style to transform a piece of your poem into a powerful, shareable quote.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg md:sticky md:top-24">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent flex items-center">
                    <Wand2 className="w-6 h-6 mr-2" />
                    Quote Controls
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div style={{ aspectRatio: imageAspectRatio || 16 / 9 }} className="relative w-full overflow-hidden rounded-md border">
                    <Image src={poemItem.photoDataUri || 'https://placehold.co/600x400.png'} alt={poemItem.photoFileName || 'Poem inspiration'} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="emotion-select" className="font-medium text-foreground/90">Choose an emotion</Label>
                        <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                            <SelectTrigger id="emotion-select" className="bg-background/50">
                                <SelectValue placeholder="Select an emotion..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg">
                                {emotions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="style-select" className="font-medium text-foreground/90">Choose a style</Label>
                        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" id="style-select">
                            <Button 
                                variant={styleMode === 'minimal' ? 'secondary' : 'ghost'}
                                onClick={() => setStyleMode('minimal')}
                                className="w-full h-9"
                            >
                                Minimal
                            </Button>
                            <Button
                                variant={styleMode === 'artistic' ? 'secondary' : 'ghost'}
                                onClick={() => setStyleMode('artistic')}
                                className="w-full h-9"
                            >
                                Artistic
                            </Button>
                        </div>
                    </div>
                </div>
                
                <Button onClick={handleGenerateQuote} disabled={!selectedEmotion || isGenerating} className="w-full font-headline py-3 text-lg">
                    {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Generate Quote'}
                </Button>
            </CardContent>
        </Card>

        <div className="space-y-6">
             <div 
                className="relative"
                ref={quoteCardRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ aspectRatio: rightPanelAspectRatio }}
             >
             {isGenerating ? (
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-950 w-full h-full flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in aspect-square">
                    <div className="text-center text-muted-foreground">
                        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                        <p className="mt-2 font-medium">Crafting your quote...</p>
                    </div>
                </div>
            ) : currentQuote ? (
                styleMode === 'artistic' ? (
                    <ArtisticLayout 
                        text={editableQuoteText} 
                        author={authorText} 
                        imageSrc={poemItem.photoDataUri!} 
                        aspectRatio={imageAspectRatio}
                        fontSize={fontSize}
                        positionX={positionX}
                        positionY={positionY}
                        onMouseDown={handleMouseDown}
                        quoteFont={quoteFont}
                        authorFont={authorFont}
                    />
                ) : (
                    <MinimalLayout 
                        text={editableQuoteText} 
                        author={authorText}
                        fontSize={fontSize}
                        positionX={positionX}
                        positionY={positionY}
                        onMouseDown={handleMouseDown}
                        quoteFont={quoteFont}
                        authorFont={authorFont}
                    />
                )
            ) : (
                 <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-950 w-full flex items-center justify-center p-8 rounded-lg shadow-inner border border-stone-200 dark:border-stone-700/50 animate-fade-in aspect-square">
                    <div className="text-center text-muted-foreground">
                        <p>Your quote will appear here.</p>
                    </div>
                </div>
            )}
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
                            {currentQuote.translatedText && (
                                <div className="pt-2">
                                   <Label>Last Translation ({currentQuote.translatedLanguage})</Label>
                                   <Textarea 
                                        value={currentQuote.translatedText} 
                                        readOnly 
                                        rows={3} 
                                        className="mt-1 bg-muted/50 text-base leading-relaxed p-3 rounded-md shadow-inner"
                                   />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl text-accent flex items-center gap-2">
                                <Edit2 className="w-5 h-5" /> Customize Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="author-editor">Author Name</Label>
                                <Input
                                    id="author-editor"
                                    value={authorText}
                                    onChange={(e) => setAuthorText(e.target.value)}
                                    placeholder="Enter author name..."
                                    className="bg-background/50"
                                    disabled={!currentQuote}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quote-font-select">Quote Font</Label>
                                <Select value={quoteFont} onValueChange={setQuoteFont} disabled={!currentQuote}>
                                    <SelectTrigger id="quote-font-select" className="bg-background/50">
                                        <SelectValue placeholder="Select a font..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover/80 backdrop-blur-sm">
                                        {quoteFonts.map(f => <SelectItem key={f.value} value={f.value} className={f.value}>{f.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author-font-select">Author Font</Label>
                                <Select value={authorFont} onValueChange={setAuthorFont} disabled={!currentQuote}>
                                    <SelectTrigger id="author-font-select" className="bg-background/50">
                                        <SelectValue placeholder="Select a font..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover/80 backdrop-blur-sm">
                                        {authorFonts.map(f => <SelectItem key={f.value} value={f.value} className={f.value}>{f.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quote-editor">Quote Text</Label>
                                <Textarea 
                                    id="quote-editor"
                                    value={editableQuoteText} 
                                    onChange={(e) => setEditableQuoteText(e.target.value)}
                                    placeholder="Generate a quote to start editing..."
                                    rows={4}
                                    className="bg-background/50"
                                    disabled={!currentQuote}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Horizontal Position ({Math.round(positionX)}%)</Label>
                                <Slider 
                                    min={0}
                                    max={100}
                                    step={1} 
                                    value={[positionX]} 
                                    onValueChange={(value) => setPositionX(value[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vertical Position ({Math.round(positionY)}%)</Label>
                                <Slider 
                                    min={0}
                                    max={100}
                                    step={1} 
                                    value={[positionY]} 
                                    onValueChange={(value) => setPositionY(value[0])}
                                />
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="font-size-slider">Font Size ({fontSize}px)</Label>
                                <Slider 
                                    id="font-size-slider"
                                    min={0} 
                                    max={100} 
                                    step={1} 
                                    value={[fontSize]} 
                                    onValueChange={(value) => setFontSize(value[0])}
                                />
                            </div>
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
