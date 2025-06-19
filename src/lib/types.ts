
export interface PoemHistoryItem {
  id: string;
  photoDataUri: string;
  photoFileName?: string;
  poem: string;
  caption: string; // Added for Instagram caption, defaults to poem
  hashtags: string[];
  createdAt: string; // ISO string for date
  scheduledAt?: string; // ISO string for date and time
}
```