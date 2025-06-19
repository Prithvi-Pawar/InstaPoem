
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarClock, Hash, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { PoemHistoryItem } from '@/lib/types';

interface SchedulerFormProps {
  currentPoem: string;
  currentPhotoDataUri: string | null;
  currentPhotoFileName: string | null;
  onPostScheduled: (scheduledItem: PoemHistoryItem) => void;
  currentPoemId: string | null;
  currentPoemCreatedAt: string | null;
  initialCaption: string;
}

export default function SchedulerForm({ 
  currentPoem, 
  currentPhotoDataUri, 
  currentPhotoFileName, 
  onPostScheduled,
  currentPoemId,
  currentPoemCreatedAt,
  initialCaption
}: SchedulerFormProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [caption, setCaption] = useState<string>(initialCaption);
  const [hashtags, setHashtags] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduledSuccess, setIsScheduledSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Default to one hour from now
    now.setMinutes(0); 
    setScheduledTime(format(now, 'HH:mm'));
    setScheduledDate(now);
  }, []);

  useEffect(() => {
    setCaption(initialCaption); // Update caption if initialCaption (poem) changes
  }, [initialCaption]);

  const handleSchedulePost = async () => {
    if (!currentPhotoDataUri || !currentPoem) {
      toast({
        variant: "destructive",
        title: "Missing Content",
        description: "Cannot schedule without a photo and poem.",
      });
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast({
        variant: "destructive",
        title: "Scheduling Incomplete",
        description: "Please select a date and time for your post.",
      });
      return;
    }
     if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Caption Required",
        description: "Please enter a caption for your post.",
      });
      return;
    }


    setIsScheduling(true);
    setIsScheduledSuccess(false);

    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const finalScheduledDateTime = new Date(scheduledDate);
    finalScheduledDateTime.setHours(hours, minutes, 0, 0);
    
    if (finalScheduledDateTime < new Date()) {
      toast({
        variant: "destructive",
        title: "Invalid Schedule Time",
        description: "Scheduled time cannot be in the past.",
      });
      setIsScheduling(false);
      return;
    }

    const newHistoryItem: PoemHistoryItem = {
      id: currentPoemId || crypto.randomUUID(),
      photoDataUri: currentPhotoDataUri,
      photoFileName: currentPhotoFileName ?? 'uploaded-photo.jpg',
      poem: currentPoem,
      caption: caption,
      hashtags: hashtags.split(',').map(h => h.trim()).filter(h => h),
      createdAt: currentPoemCreatedAt || new Date().toISOString(),
      scheduledAt: finalScheduledDateTime.toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onPostScheduled(newHistoryItem);
    toast({
      title: "Post Scheduled!",
      description: `Your poem will be "posted" on ${format(finalScheduledDateTime, "PPP p")}.`,
    });
    
    setIsScheduledSuccess(true);
    setTimeout(() => setIsScheduledSuccess(false), 3000); // Reset success state

    // Don't reset date/time, allow for quick rescheduling or multiple posts
    // setHashtags(''); // Optionally clear hashtags
    
    setIsScheduling(false);
  };
  
  return (
    <div className="space-y-6 p-1"> {/* Reduced padding for modal content */}
        <div className="space-y-2">
            <Label htmlFor="caption" className="font-headline flex items-center gap-2 text-sm">
                Instagram Caption
            </Label>
            <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Your Instagram caption here..."
                rows={4}
                className="text-sm min-h-[100px]"
                aria-label="Instagram caption for your post"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-date" className="font-headline flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-primary" /> Schedule Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 text-sm",
                    !scheduledDate && "text-muted-foreground"
                  )}
                  aria-label="Pick a date to schedule your post"
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card shadow-lg rounded-md" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-time" className="font-headline flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-primary" /> Schedule Time
            </Label>
            <Input
              id="schedule-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="h-10 text-sm"
              aria-label="Pick a time to schedule your post"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hashtags" className="font-headline flex items-center gap-2 text-sm">
            <Hash className="w-4 h-4 text-primary" /> Hashtags
          </Label>
          <Input
            id="hashtags"
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="e.g., #poetry, #art (comma separated)"
            className="h-10 text-sm"
            aria-label="Enter hashtags for your post, separated by commas"
          />
        </div>
        
        <Button
          onClick={handleSchedulePost}
          disabled={!currentPoem || !currentPhotoDataUri || isScheduling}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3 font-headline rounded-md"
          aria-label="Confirm and schedule this post"
        >
          {isScheduling ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : isScheduledSuccess ? (
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-300" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isScheduling ? 'Scheduling...' : isScheduledSuccess ? 'Scheduled Successfully!' : 'Confirm Schedule'}
        </Button>
    </div>
  );
}
