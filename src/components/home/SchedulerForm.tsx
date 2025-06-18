
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarClock, Hash, Send, Loader2 } from 'lucide-react';
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
}

export default function SchedulerForm({ 
  currentPoem, 
  currentPhotoDataUri, 
  currentPhotoFileName, 
  onPostScheduled,
  currentPoemId,
  currentPoemCreatedAt
}: SchedulerFormProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState<string>(''); // HH:mm format
  const [hashtags, setHashtags] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const [clientLoaded, setClientLoaded] = useState(false);
  useEffect(() => {
    setClientLoaded(true);
    // Set default time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0); // Round to the hour
    setScheduledTime(format(now, 'HH:mm'));
    setScheduledDate(now);
  }, []);


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

    setIsScheduling(true);

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
      id: currentPoemId || crypto.randomUUID(), // Use existing ID if available
      photoDataUri: currentPhotoDataUri,
      photoFileName: currentPhotoFileName ?? 'uploaded-photo.jpg',
      poem: currentPoem,
      hashtags: hashtags.split(',').map(h => h.trim()).filter(h => h),
      createdAt: currentPoemCreatedAt || new Date().toISOString(), // Use existing createdAt if available
      scheduledAt: finalScheduledDateTime.toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onPostScheduled(newHistoryItem);
    toast({
      title: "Post Scheduled!",
      description: `Your poem will be "posted" on ${format(finalScheduledDateTime, "PPP p")}.`,
    });
    
    // Reset form fields, but not the core poem ID/createdAt from props
    setScheduledDate(undefined);
    setScheduledTime('');
    setHashtags('');
    
    setIsScheduling(false);
  };

  if (!clientLoaded) {
    return (
      <Card className="w-full shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Schedule Your Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Schedule Your Post</CardTitle>
        <CardDescription>Set the date, time, and hashtags for your Instagram post.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="schedule-date" className="font-headline flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary" /> Schedule Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-base",
                    !scheduledDate && "text-muted-foreground"
                  )}
                  aria-label="Pick a date to schedule your post"
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-time" className="font-headline flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary" /> Schedule Time
            </Label>
            <Input
              id="schedule-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="h-12 text-base"
              aria-label="Pick a time to schedule your post"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hashtags" className="font-headline flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" /> Hashtags
          </Label>
          <Input
            id="hashtags"
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="e.g., #poetry, #art, #instapoem (comma separated)"
            className="h-12 text-base"
            aria-label="Enter hashtags for your post, separated by commas"
          />
        </div>

        <Button
          onClick={handleSchedulePost}
          disabled={!currentPoem || !currentPhotoDataUri || isScheduling}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6 font-headline"
          aria-label="Schedule this post"
        >
          {isScheduling ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isScheduling ? 'Scheduling...' : 'Schedule Post'}
        </Button>
      </CardContent>
    </Card>
  );
}
