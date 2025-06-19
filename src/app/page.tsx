
'use client';

import { useState, useEffect, useRef } from 'react';
import PhotoUploadForm from '@/components/home/PhotoUploadForm';
import PoemDisplayEditor from '@/components/home/PoemDisplayEditor';
import SchedulerFormWrapper from '@/components/home/SchedulerFormWrapper';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sparkles as SparklesIcon, FileImage, UploadCloud } from 'lucide-react';

export default function HomePage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [editedPoem, setEditedPoem] = useState<string>('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  
  const [currentPoemId, setCurrentPoemId] = useState<string | null>(null);
  const [currentPoemCreatedAt, setCurrentPoemCreatedAt] = useState<string | null>(null);
  
  const { saveHistoryItem, getHistoryItem } = usePoemHistory();
  const poemSectionRef = useRef<HTMLDivElement>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
        
        setTimeout(() => {
          poemSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    if (!idToUse) { // Only generate new ID and timestamp if it's a truly new poem session
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
        caption: poem, // Default caption to poem
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

  useEffect(() => {
    if (currentPoemId && currentPoemCreatedAt && photoDataUri && editedPoem && 
        (editedPoem !== generatedPoem || !generatedPoem) // Check if editedPoem actually changed
    ) {
      const existingItem = getHistoryItem(currentPoemId);
      const historyItem: PoemHistoryItem = {
        id: currentPoemId,
        photoDataUri: photoDataUri,
        photoFileName: photoFileName,
        poem: editedPoem, 
        caption: editedPoem, // Update caption if poem is edited
        hashtags: existingItem?.hashtags || [], 
        createdAt: currentPoemCreatedAt,
        scheduledAt: existingItem?.scheduledAt,
      };
      saveHistoryItem(historyItem);
    }
  }, [editedPoem, currentPoemId, currentPoemCreatedAt, photoDataUri, photoFileName, generatedPoem, saveHistoryItem, getHistoryItem]);

  const handlePostScheduled = (scheduledItem: PoemHistoryItem) => {
    saveHistoryItem(scheduledItem);
    setIsScheduleModalOpen(false); // Close modal on successful schedule
  };
  
  const openScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };


  return (
    <div className="space-y-12 md:space-y-16">
      <section className="text-center py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-headline font-bold mb-4 text-primary dark:text-primary-foreground">
            Transform Your Image into Poetry
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 mb-8 max-w-xl mx-auto">
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

      {photoDataUri && generatedPoem !== null && !isGeneratingPoem && (
        <section ref={poemSectionRef} className="animate-fade-in scroll-mt-20">
          <PoemDisplayEditor
            photoDataUri={photoDataUri}
            photoFileName={photoFileName}
            poem={generatedPoem}
            editedPoem={editedPoem}
            onPoemChange={setEditedPoem}
            onSchedulePost={openScheduleModal}
          />
        </section>
      )}

      {photoDataUri && editedPoem && !isGeneratingPoem && currentPoemId && (
         <SchedulerFormWrapper
            isOpen={isScheduleModalOpen}
            setIsOpen={setIsScheduleModalOpen}
            currentPoem={editedPoem}
            currentPhotoDataUri={photoDataUri}
            currentPhotoFileName={photoFileName}
            onPostScheduled={handlePostScheduled}
            currentPoemId={currentPoemId}
            currentPoemCreatedAt={currentPoemCreatedAt}
            initialCaption={editedPoem}
          />
      )}
    </div>
  );
}
