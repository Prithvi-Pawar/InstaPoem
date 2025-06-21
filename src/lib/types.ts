
export interface Quote {
  id: string; // Unique ID for the quote
  emotion: string;
  text: string;
  translatedText?: string;
  translatedLanguage?: string;
}

export interface PoemHistoryItem {
  id: string;
  photoDataUri?: string; // Optional because it might be stripped from older items in storage
  photoFileName?: string;
  poem: string;
  caption: string; 
  hashtags: string[];
  createdAt: string; // ISO string for date
  scheduledAt?: string; // ISO string for date and time - keeping for now to not break existing data
  quotes?: Quote[]; // Array to store generated quotes
}
