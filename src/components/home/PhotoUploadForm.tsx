
'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Sparkles, Loader2, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePoemFromPhoto } from '@/ai/flows/generate-poem-from-photo';

interface PhotoUploadFormProps {
  currentPhotoDataUri: string | null;
  currentPhotoFileName: string | null;
  onPhotoChanged: (newPhotoDataUri: string | null, newPhotoFileName: string | null) => void;
  onPoemGenerated: (poem: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function PhotoUploadForm({ 
  currentPhotoDataUri,
  currentPhotoFileName,
  onPhotoChanged, 
  onPoemGenerated, 
  isGenerating, 
  setIsGenerating 
}: PhotoUploadFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = useCallback((file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // Max 10MB
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        onPhotoChanged(null, null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, WEBP, or GIF image.",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        onPhotoChanged(null, null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        onPhotoChanged(dataUri, file.name);
      };
      reader.readAsDataURL(file);
    } else {
      onPhotoChanged(null, null);
    }
  }, [onPhotoChanged, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] || null);
  };

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  }, [processFile]);
  
  const handleGeneratePoem = async () => {
    if (!currentPhotoDataUri) {
      toast({
        variant: "destructive",
        title: "No photo selected",
        description: "Please upload a photo to generate a poem.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generatePoemFromPhoto({ photoDataUri: currentPhotoDataUri });
      onPoemGenerated(result.poem);
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
  
  useEffect(() => {
    if (!currentPhotoDataUri && fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [currentPhotoDataUri]);

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl bg-card/70 backdrop-blur-sm border-primary/30">
      <CardContent className="p-6 space-y-6">
        <div 
          className={`p-8 border-2 border-dashed rounded-lg transition-all
            ${dragActive ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/70"}
            ${currentPhotoDataUri ? "border-solid border-primary" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            id="photo-upload-dnd"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            aria-describedby="photo-upload-description"
          />
          <Label 
            htmlFor="photo-upload-dnd" 
            className="flex flex-col items-center justify-center space-y-3 cursor-pointer h-40"
          >
            {currentPhotoDataUri ? (
              <div className="relative w-full h-full max-h-40 overflow-hidden rounded-md">
                <Image
                  src={currentPhotoDataUri}
                  alt={currentPhotoFileName || "Uploaded photo preview"}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                  data-ai-hint="upload preview"
                />
              </div>
            ) : (
              <>
                <UploadCloud className={`w-12 h-12 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-center font-semibold ${dragActive ? "text-primary" : "text-foreground"}`}>
                  Drag image here
                </p>
                <p id="photo-upload-description" className="text-sm text-muted-foreground">
                  or <span className="text-accent font-medium hover:underline">click to browse</span>
                </p>
              </>
            )}
          </Label>
        </div>
        
        {currentPhotoDataUri && currentPhotoFileName && (
            <div className="text-sm text-muted-foreground text-center truncate">
                Selected: <span className="font-medium text-foreground">{currentPhotoFileName}</span>
            </div>
        )}

        <Button
          onClick={handleGeneratePoem}
          disabled={!currentPhotoDataUri || isGenerating}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 font-headline rounded-md"
          aria-label="Generate poem from uploaded photo"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Poem'}
        </Button>
      </CardContent>
    </Card>
  );
}
