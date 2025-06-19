
'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Sparkles, Loader2, FileImage, Image as ImageIcon } from 'lucide-react';
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
  
  // Effect to clear file input if currentPhotoDataUri is cleared from HomePage
  useEffect(() => {
    if (!currentPhotoDataUri && fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [currentPhotoDataUri]);


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div 
          className={`p-6 border-2 border-dashed rounded-lg transition-colors
            ${dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/70"}
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
            className="flex flex-col items-center justify-center space-y-3 cursor-pointer h-48"
          >
            {currentPhotoDataUri ? (
              <div className="relative w-full h-full max-h-48 overflow-hidden rounded-md">
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
                <ImageIcon className={`w-16 h-16 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-center font-headline ${dragActive ? "text-primary" : "text-foreground"}`}>
                  Drag image here or <span className="text-accent font-semibold">click to browse</span>.
                </p>
                <p id="photo-upload-description" className="text-sm text-muted-foreground">Max 10MB. JPG, PNG, WEBP, GIF.</p>
              </>
            )}
          </Label>
        </div>
        
        {currentPhotoDataUri && currentPhotoFileName && (
            <div className="p-4 bg-muted/30 text-sm text-muted-foreground text-center truncate">
                Selected: <span className="font-medium text-foreground">{currentPhotoFileName}</span>
            </div>
        )}

        <div className="p-6 border-t border-border">
          <Button
            onClick={handleGeneratePoem}
            disabled={!currentPhotoDataUri || isGenerating}
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
        </div>
      </CardContent>
    </Card>
  );
}
