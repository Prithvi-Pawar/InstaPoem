
'use client';

import { useState, useEffect, useRef } from 'react';
import PhotoUploadForm from '@/components/home/PhotoUploadForm';
import PoemDisplayEditor from '@/components/home/PoemDisplayEditor';
import SchedulerForm from '@/components/home/SchedulerForm';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, UploadCloud, Sparkles as SparklesIcon, FileImage, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function HeroSection({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <section className="text-center py-16 md:py-24 bg-gradient-to-br from-[hsl(var(--background-hero-start))] to-[hsl(var(--background-hero-end))] rounded-lg shadow-xl">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6 text-primary dark:text-primary-foreground">
          Transform Images into Poetry
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 mb-10 max-w-2xl mx-auto">
          Upload any image, and our AI crafts a unique poem—ready to share or translate.
        </p>
        <Button 
          size="lg" 
          className="bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse text-lg py-7 px-8 font-headline"
          onClick={onUploadClick}
          aria-label="Upload an image to start generating a poem"
        >
          <CameraIcon className="mr-2 h-6 w-6" />
          Upload Image &amp; Create Poem
        </Button>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [editedPoem, setEditedPoem] = useState<string>('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  
  const [currentPoemId, setCurrentPoemId] = useState<string | null>(null);
  const [currentPoemCreatedAt, setCurrentPoemCreatedAt] = useState<string | null>(null);
  
  const { saveHistoryItem, getHistoryItem } = usePoemHistory();
  const photoUploadSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const historyId = params.get('fromHistory');
    if (historyId) {
      const item = getHistoryItem(historyId);
      if (item) {
        setPhotoDataUri(item.photoDataUri);
        setPhotoFileName(item.photoFileName || 'historical_photo.jpg');
        setGeneratedPoem(item.poem); 
        setEditedPoem(item.poem);
        setCurrentPoemId(item.id);
        setCurrentPoemCreatedAt(item.createdAt);
        // Scroll to photo upload section smoothly after loading from history
        setTimeout(() => {
          photoUploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [getHistoryItem]);

  const handlePhotoChanged = (newPhotoDataUri: string | null, newPhotoFileName: string | null) => {
    setPhotoDataUri(newPhotoDataUri);
    setPhotoFileName(newPhotoFileName);
    setGeneratedPoem(null);
    setEditedPoem('');
    setCurrentPoemId(null);
    setCurrentPoemCreatedAt(null);
  };

  const handlePoemGenerated = (poem: string) => {
    setGeneratedPoem(poem);
    setEditedPoem(poem);

    let idToUse = currentPoemId;
    let createdAtToUse = currentPoemCreatedAt;

    if (!idToUse) {
        idToUse = crypto.randomUUID();
        createdAtToUse = new Date().toISOString();
        setCurrentPoemId(idToUse);
        setCurrentPoemCreatedAt(createdAtToUse);
    }

    if (photoDataUri && idToUse && createdAtToUse) {
      const historyItem: PoemHistoryItem = {
        id: idToUse,
        photoDataUri: photoDataUri,
        photoFileName: photoFileName,
        poem: poem,
        hashtags: [], 
        createdAt: createdAtToUse,
        scheduledAt: undefined, 
      };
      saveHistoryItem(historyItem);
    }
  };

  useEffect(() => {
    if (currentPoemId && currentPoemCreatedAt && photoDataUri && editedPoem && 
        (editedPoem !== generatedPoem || !generatedPoem) 
    ) {
      const historyItem: PoemHistoryItem = {
        id: currentPoemId,
        photoDataUri: photoDataUri,
        photoFileName: photoFileName,
        poem: editedPoem, 
        hashtags: getHistoryItem(currentPoemId)?.hashtags || [], 
        createdAt: currentPoemCreatedAt,
        scheduledAt: getHistoryItem(currentPoemId)?.scheduledAt,
      };
      saveHistoryItem(historyItem);
    }
  }, [editedPoem, currentPoemId, currentPoemCreatedAt, photoDataUri, photoFileName, generatedPoem, saveHistoryItem, getHistoryItem]);

  const handlePostScheduled = (scheduledItem: PoemHistoryItem) => {
    saveHistoryItem(scheduledItem);
  };

  const handleHeroUploadClick = () => {
    photoUploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 md:space-y-16">
      <HeroSection onUploadClick={handleHeroUploadClick} />

      <section ref={photoUploadSectionRef} id="upload-section" className="scroll-mt-20">
        <h2 className="text-3xl font-headline text-primary mb-2 text-center">1. Upload Your Inspiration</h2>
        <p className="text-lg text-foreground/80 text-center mb-8 max-w-2xl mx-auto">
          Choose an image that speaks to you. Our AI will use it as a muse.
        </p>
        <PhotoUploadForm
          currentPhotoDataUri={photoDataUri}
          currentPhotoFileName={photoFileName}
          onPhotoChanged={handlePhotoChanged}
          onPoemGenerated={handlePoemGenerated}
          isGenerating={isGeneratingPoem}
          setIsGenerating={setIsGeneratingPoem}
        />
      </section>

      {isGeneratingPoem && (
        <section className="text-center py-10 animate-fade-in">
           <SparklesIcon className="w-12 h-12 text-primary mx-auto animate-ping mb-4" />
           <p className="text-xl text-foreground/90 font-headline">AI is crafting your poem...</p>
           <p className="text-md text-muted-foreground">This might take a few moments.</p>
        </section>
      )}

      {photoDataUri && generatedPoem !== null && !isGeneratingPoem && (
        <section className="animate-fade-in">
           <Separator className="my-8 bg-primary/30 h-0.5" />
           <h2 className="text-3xl font-headline text-primary mb-2 text-center">2. Review & Refine Your Poem</h2>
           <p className="text-lg text-foreground/80 text-center mb-8 max-w-2xl mx-auto">
             Here's what our AI created. Feel free to edit, translate, or schedule it.
           </p>
          <PoemDisplayEditor
            photoDataUri={photoDataUri}
            photoFileName={photoFileName}
            poem={generatedPoem}
            editedPoem={editedPoem}
            onPoemChange={setEditedPoem}
          />
        </section>
      )}

      {photoDataUri && editedPoem && !isGeneratingPoem && (
         <section className="animate-fade-in">
          <Separator className="my-8 bg-primary/30 h-0.5" />
          <h2 className="text-3xl font-headline text-primary mb-2 text-center">3. Schedule Your Post</h2>
           <p className="text-lg text-foreground/80 text-center mb-8 max-w-2xl mx-auto">
             Get ready to share your creation with the world.
           </p>
          <SchedulerForm
            currentPoem={editedPoem}
            currentPhotoDataUri={photoDataUri}
            currentPhotoFileName={photoFileName}
            onPostScheduled={handlePostScheduled}
            currentPoemId={currentPoemId}
            currentPoemCreatedAt={currentPoemCreatedAt}
          />
        </section>
      )}
    </div>
  );
}
