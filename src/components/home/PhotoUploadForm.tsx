'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePoemFromPhoto } from '@/ai/flows/generate-poem-from-photo';

interface PhotoUploadFormProps {
  onPoemGenerated: (poem: string, photoDataUri: string, photoFileName: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function PhotoUploadForm({ onPoemGenerated, isGenerating, setIsGenerating }: PhotoUploadFormProps) {
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Max 4MB
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, WEBP, or GIF image.",
        });
        return;
      }

      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        setPhotoPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePoem = async () => {
    if (!photoDataUri || !photoFileName) {
      toast({
        variant: "destructive",
        title: "No photo selected",
        description: "Please upload a photo to generate a poem.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generatePoemFromPhoto({ photoDataUri });
      onPoemGenerated(result.poem, photoDataUri, photoFileName);
    } catch (error) {
      console.error("Error generating poem:", error);
      toast({
        variant: "destructive",
        title: "Poem Generation Failed",
        description: "Could not generate poem. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Upload Your Photo</CardTitle>
        <CardDescription>Select an image and let our AI craft a unique poem for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="photo-upload" className="font-headline">Choose Photo</Label>
          <Input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file:font-headline file:text-primary-foreground file:bg-primary file:hover:bg-primary/90 file:rounded-md file:px-3 file:py-1.5 file:mr-3"
            aria-describedby="photo-upload-description"
          />
          <p id="photo-upload-description" className="text-sm text-muted-foreground">Max 4MB. JPG, PNG, WEBP, GIF accepted.</p>
        </div>

        {photoPreviewUrl && (
          <div className="mt-4 border border-border rounded-lg p-2 bg-background/50 animate-fade-in">
            <p className="text-sm font-medium text-center mb-2 font-headline">Photo Preview:</p>
            <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md">
              <Image
                src={photoPreviewUrl}
                alt="Uploaded photo preview"
                layout="fill"
                objectFit="contain"
                data-ai-hint="photo preview"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleGeneratePoem}
          disabled={!photoDataUri || isGenerating}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-6 font-headline"
          aria-label="Generate poem from uploaded photo"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isGenerating ? 'Generating Your Masterpiece...' : 'Generate Poem'}
        </Button>
      </CardContent>
    </Card>
  );
}
