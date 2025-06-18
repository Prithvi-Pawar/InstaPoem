
'use client';

import { useState, useEffect } from 'react';
import PhotoUploadForm from '@/components/home/PhotoUploadForm';
import PoemDisplayEditor from '@/components/home/PoemDisplayEditor';
import SchedulerForm from '@/components/home/SchedulerForm';
import { usePoemHistory } from '@/hooks/use-poem-history';
import type { PoemHistoryItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [editedPoem, setEditedPoem] = useState<string>('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  
  const [currentPoemId, setCurrentPoemId] = useState<string | null>(null);
  const [currentPoemCreatedAt, setCurrentPoemCreatedAt] = useState<string | null>(null);
  
  const { saveHistoryItem, getHistoryItem } = usePoemHistory();

  // Check for query param to load from history
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
      }
      // Clean the URL
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

    if (!idToUse) { // New poem session for the current photo
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
        hashtags: [], // Initially no hashtags
        createdAt: createdAtToUse,
        scheduledAt: undefined, // Not scheduled yet
      };
      saveHistoryItem(historyItem);
    }
  };

  // Save subsequent edits or applied translations to history
  useEffect(() => {
    if (currentPoemId && currentPoemCreatedAt && photoDataUri && editedPoem && 
        (editedPoem !== generatedPoem || !generatedPoem) // Condition to save if edited or loaded from history and then edited
    ) {
      const historyItem: PoemHistoryItem = {
        id: currentPoemId,
        photoDataUri: photoDataUri,
        photoFileName: photoFileName,
        poem: editedPoem, // Save the latest edited version
        hashtags: [], // Hashtags are only added during scheduling
        createdAt: currentPoemCreatedAt,
        scheduledAt: undefined, // Not scheduled yet
      };
      saveHistoryItem(historyItem);
    }
  }, [editedPoem, currentPoemId, currentPoemCreatedAt, photoDataUri, photoFileName, generatedPoem, saveHistoryItem]);


  const handlePostScheduled = (scheduledItem: PoemHistoryItem) => {
    // The scheduledItem from SchedulerForm should now have the correct id and createdAt.
    saveHistoryItem(scheduledItem);
    // Optionally reset main page state after scheduling
    // setPhotoDataUri(null);
    // setPhotoFileName(null);
    // setGeneratedPoem(null);
    // setEditedPoem('');
    // setCurrentPoemId(null);
    // setCurrentPoemCreatedAt(null);
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-headline text-primary mb-2 text-center">Create Your InstaPoem</h1>
        <p className="text-lg text-foreground/80 text-center mb-8 max-w-2xl mx-auto">
          Turn your photos into beautiful poetry. Upload an image, let our AI inspire you, then schedule your masterpiece for Instagram.
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

      {photoDataUri && generatedPoem !== null && (
        <div className="animate-fade-in">
           <Separator className="my-8 bg-primary/30 h-0.5" />
          <PoemDisplayEditor
            photoDataUri={photoDataUri}
            poem={generatedPoem}
            editedPoem={editedPoem}
            onPoemChange={setEditedPoem}
          />
        </div>
      )}

      {photoDataUri && editedPoem && (
         <div className="animate-fade-in">
          <Separator className="my-8 bg-primary/30 h-0.5" />
          <SchedulerForm
            currentPoem={editedPoem}
            currentPhotoDataUri={photoDataUri}
            currentPhotoFileName={photoFileName}
            onPostScheduled={handlePostScheduled}
            currentPoemId={currentPoemId}
            currentPoemCreatedAt={currentPoemCreatedAt}
          />
        </div>
      )}
    </div>
  );
}
