
'use client';

import type { PoemHistoryItem, Quote } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'instaPoemHistory';
const MAX_RECENT_WITH_PHOTO_IN_STORAGE = 3; // Keep photo for current/updated + (N-1) most recent others in localStorage

export function usePoemHistory() {
  const [history, setHistory] = useState<PoemHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        // Ensure that items loaded from localStorage are properly typed
        const parsedHistory: PoemHistoryItem[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load poem history from localStorage:', error);
      // If parsing fails or any other error, start with an empty history
      setHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const saveHistoryItem = useCallback((item: PoemHistoryItem) => {
    setHistory(prevHistory_InMemory => {
      const currentItemInHistory = prevHistory_InMemory.find(h => h.id === item.id);
      
      // If item exists and is identical, return previous state to prevent re-render loop.
      if (currentItemInHistory && JSON.stringify(currentItemInHistory) === JSON.stringify(item)) {
        return prevHistory_InMemory;
      }

      // Update in-memory history: new/updated item comes first
      const newInMemoryHistory = [item, ...prevHistory_InMemory.filter(h => h.id !== item.id)];

      // Prepare data for localStorage: strip photoDataUri from older items
      const historyForStorage = newInMemoryHistory.map((hItem, index) => {
        // Keep photoDataUri for the item being saved/updated (it's at index 0 or matches by id)
        // and for a few other most recent items.
        if (hItem.id === item.id || index < MAX_RECENT_WITH_PHOTO_IN_STORAGE) {
          return hItem; 
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { photoDataUri, ...itemWithoutPhoto } = hItem;
        return { ...itemWithoutPhoto, photoDataUri: undefined }; // Remove for older items in storage
      });

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyForStorage));
      } catch (error: any) {
        if (error.name === 'QuotaExceededError' || (error.message && error.message.toLowerCase().includes('quota'))) {
          console.warn('LocalStorage quota exceeded. Attempting to save history without any photoDataUris in storage.');
          // Fallback: try to save without *any* photos in localStorage to prevent data loss for text
          const historyWithoutAnyPhotosForStorage = newInMemoryHistory.map(hItem => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { photoDataUri, ...itemWithoutPhoto } = hItem;
            return { ...itemWithoutPhoto, photoDataUri: undefined };
          });
          try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(historyWithoutAnyPhotosForStorage));
            // Optionally, inform the user that image previews for history might not be available.
          } catch (finalError) {
            console.error('Failed to save history to localStorage even without photos:', finalError);
          }
        } else {
          console.error('Failed to save poem history to localStorage:', error);
        }
      }
      return newInMemoryHistory; // The UI state always reflects the full data for the current session
    });
  }, []);

  const getHistoryItem = useCallback((id: string): PoemHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  const deleteHistoryItem = useCallback((id: string) => {
    try {
      setHistory(prevHistory => {
        const newHistory = prevHistory.filter(item => item.id !== id);
        // Also update localStorage after deleting
        const historyForStorage = newHistory.map((hItem, index) => {
           if (index < MAX_RECENT_WITH_PHOTO_IN_STORAGE) { // Apply same logic for remaining items
            return hItem;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { photoDataUri, ...itemWithoutPhoto } = hItem;
          return { ...itemWithoutPhoto, photoDataUri: undefined };
        });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyForStorage));
        return newHistory;
      });
    } catch (error) {
      console.error('Failed to delete poem history item or update localStorage:', error);
    }
  }, []);

  const saveQuoteToHistory = useCallback((poemId: string, quote: Quote) => {
    const poemItem = getHistoryItem(poemId);
    if (poemItem) {
      const existingQuotes = poemItem.quotes || [];
      const quoteIndex = existingQuotes.findIndex(q => q.id === quote.id);
      let updatedQuotes;
      if (quoteIndex > -1) {
        // Update existing quote
        updatedQuotes = [...existingQuotes];
        updatedQuotes[quoteIndex] = quote;
      } else {
        // Add new quote
        updatedQuotes = [quote, ...existingQuotes];
      }
      const updatedPoemItem = { ...poemItem, quotes: updatedQuotes };
      saveHistoryItem(updatedPoemItem);
    }
  }, [getHistoryItem, saveHistoryItem]);


  return { history, saveHistoryItem, getHistoryItem, deleteHistoryItem, isHistoryLoading, saveQuoteToHistory };
}
