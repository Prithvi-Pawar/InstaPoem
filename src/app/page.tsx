
'use client';

import { useState, useEffect, useRef } from 'react';
import PhotoUploadForm from '@/components/home/PhotoUploadForm';
import PoemDisplayEditor from '@/components/home/PoemDisplayEditor';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem } from '@/lib/types';
import { Sparkles as SparklesIcon } from 'lucide-react';

export default function HomePage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [editedPoem, setEditedPoem] = useState<string>('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  
  const [currentPoemId, setCurrentPoemId] = useState<string | null>(null);
  const [currentPoemCreatedAt, setCurrentPoemCreatedAt] = useState<string | null>(null);
  
  const { saveHistoryItem, getHistoryItem, isHistoryLoading } = usePoemHistory();
  const poemSectionRef = useRef<HTMLDivElement>(null);

  // Ref to track if the initial load from history URL parameter has been processed for a specific ID
  const initialLoadFromHistoryProcessed = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const historyId = params.get('fromHistory');

    // Only process if:
    // 1. historyId exists in the URL.
    // 2. We haven't already processed *this specific* historyId.
    // 3. Poem history itself is not currently loading.
    if (historyId && initialLoadFromHistoryProcessed.current !== historyId && !isHistoryLoading) {
      const item = getHistoryItem(historyId);
      if (item) {
        setPhotoDataUri(item.photoDataUri);
        setPhotoFileName(item.photoFileName || 'historical_photo.jpg');
        setGeneratedPoem(item.poem); 
        setEditedPoem(item.poem); // Set editor content
        setCurrentPoemId(item.id);
        setCurrentPoemCreatedAt(item.createdAt);
        
        initialLoadFromHistoryProcessed.current = historyId; // Mark this ID as processed

        setTimeout(() => {
          poemSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      // Always clear the URL param after attempting to process
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [getHistoryItem, isHistoryLoading]); // Dependencies

  const handlePhotoChanged = (newPhotoDataUri: string | null, newPhotoFileName: string | null) => {
    setPhotoDataUri(newPhotoDataUri);
    setPhotoFileName(newPhotoFileName);
    setGeneratedPoem(null);
    setEditedPoem('');
    setCurrentPoemId(null);
    setCurrentPoemCreatedAt(null);
    initialLoadFromHistoryProcessed.current = null; // Reset when photo changes
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
        caption: poem, 
        hashtags: [], 
        createdAt: createdAtToUse,
        scheduledAt: undefined, 
      };
      saveHistoryItem(historyItem);
      setTimeout(() => {
        poemSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Auto-save edited poem to history
  useEffect(() => {
    // Only save if there's an active poem session, photo URI exists, and poem has meaningful content.
    if (currentPoemId && currentPoemCreatedAt && photoDataUri && editedPoem.trim() !== '') {
      const existingItem = getHistoryItem(currentPoemId); // Fetch to preserve hashtags/scheduledAt
      const historyItem: PoemHistoryItem = {
        id: currentPoemId,
        photoDataUri: photoDataUri,
        photoFileName: photoFileName,
        poem: editedPoem, 
        caption: editedPoem, 
        hashtags: existingItem?.hashtags || [], 
        createdAt: currentPoemCreatedAt,
        scheduledAt: existingItem?.scheduledAt,
        quotes: existingItem?.quotes || [], // Preserve existing quotes
      };
      saveHistoryItem(historyItem);
    }
  }, [editedPoem, currentPoemId, currentPoemCreatedAt, photoDataUri, photoFileName, saveHistoryItem, getHistoryItem]);


  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-background via-background to-secondary/10 dark:from-background dark:via-background dark:to-secondary/5 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mx-auto mb-6 gap-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64"
              height="64"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary opacity-80"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span className="text-5xl font-headline text-primary opacity-80">Poem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-headline font-bold mb-4 text-primary dark:text-primary-foreground">
            Transform Your Image into Poetry
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 mb-10 max-w-xl mx-auto">
            Upload. Inspire. Translate. Share.
          </p>
          
          <PhotoUploadForm
            currentPhotoDataUri={photoDataUri}
            currentPhotoFileName={photoFileName}
            onPhotoChanged={handlePhotoChanged}
            onPoemGenerated={handlePoemGenerated}
            isGenerating={isGeneratingPoem}
            setIsGenerating={setIsGeneratingPoem}
          />
        </div>
      </section>

      {isGeneratingPoem && (
        <section className="text-center py-10 animate-fade-in">
           <SparklesIcon className="w-12 h-12 text-primary mx-auto animate-ping mb-4" />
           <p className="text-xl text-foreground/90 font-headline">AI is crafting your poem...</p>
           <p className="text-md text-muted-foreground">This might take a few moments.</p>
        </section>
      )}

      {/* Poem Result Section - only shown if a photo has been processed and poem generated */}
      {photoDataUri && generatedPoem !== null && !isGeneratingPoem && (
        <section ref={poemSectionRef} className="animate-fade-in scroll-mt-20">
          <PoemDisplayEditor
            photoDataUri={photoDataUri}
            photoFileName={photoFileName}
            poem={generatedPoem}
            editedPoem={editedPoem}
            onPoemChange={setEditedPoem}
            currentPoemId={currentPoemId}
          />
        </section>
      )}
    </div>
  );
}
