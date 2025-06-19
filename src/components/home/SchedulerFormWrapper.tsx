
'use client';

import SchedulerForm from './SchedulerForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { PoemHistoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SchedulerFormWrapperProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentPoem: string;
  currentPhotoDataUri: string | null;
  currentPhotoFileName: string | null;
  onPostScheduled: (scheduledItem: PoemHistoryItem) => void;
  currentPoemId: string | null;
  currentPoemCreatedAt: string | null;
  initialCaption: string;
}

export default function SchedulerFormWrapper({
  isOpen,
  setIsOpen,
  ...props
}: SchedulerFormWrapperProps) {
  if (!props.currentPoemId) return null; // Don't render if there's no active poem

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-headline text-xl text-primary">Schedule Your Poem to Post</DialogTitle>
          <DialogDescription className="text-sm">
            Set the caption, date, time, and hashtags for your Instagram post.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
            <SchedulerForm {...props} />
        </div>
        <DialogClose asChild>
            <Button type="button" variant="ghost" className="absolute right-4 top-4 h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
