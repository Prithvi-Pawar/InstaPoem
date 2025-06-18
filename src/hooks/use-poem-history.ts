'use client';

import type { PoemHistoryItem } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'instaPoemHistory';

export function usePoemHistory() {
  const [history, setHistory] = useState<PoemHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load poem history from localStorage:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const saveHistoryItem = useCallback((item: PoemHistoryItem) => {
    try {
      setHistory(prevHistory => {
        const newHistory = [item, ...prevHistory.filter(h => h.id !== item.id)];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error('Failed to save poem history to localStorage:', error);
    }
  }, []);

  const getHistoryItem = useCallback((id: string): PoemHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  const deleteHistoryItem = useCallback((id: string) => {
    try {
      setHistory(prevHistory => {
        const newHistory = prevHistory.filter(item => item.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error('Failed to delete poem history item from localStorage:', error);
    }
  }, []);

  return { history, saveHistoryItem, getHistoryItem, deleteHistoryItem, isHistoryLoading };
}
