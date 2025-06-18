
export interface PoemHistoryItem {
  id: string;
  photoDataUri: string;
  photoFileName?: string;
  poem: string;
  hashtags: string[];
  createdAt: string; // ISO string for date
  scheduledAt?: string; // ISO string for date and time
}
