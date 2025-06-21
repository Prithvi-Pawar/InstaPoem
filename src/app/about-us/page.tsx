
// src/app/about-us/page.tsx
import type { Metadata } from 'next';
import { Users, Info, Heart, Globe, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - InstaPoem',
  description: 'Learn more about the vision and passion behind InstaPoem.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <Users className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-headline text-primary mb-3">About InstaPoem</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          We believe that art is hidden in plain sight. Our journey began with a simple idea: what if every picture could tell a story, not just in pixels, but in poetry?
        </p>
      </header>

      <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30 mb-12">
        <h2 className="text-3xl font-headline text-accent mb-6 flex items-center">
          <Info className="w-7 h-7 mr-3 text-accent" />
          Our Mission
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-6">
          At InstaPoem, our mission is to unlock the poetic potential within every image. We provide a seamless and inspiring platform to transform your visual moments into lyrical art. We are committed to empowering your creativity by enabling you to:
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <Heart className="w-10 h-10 text-primary mb-3"/>
            <h3 className="text-xl font-headline text-foreground mb-2">Create & Refine</h3>
            <p className="text-foreground/80">Generate unique, AI-crafted poems from your photos and edit them to perfection, capturing your precise emotion and style.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Globe className="w-10 h-10 text-primary mb-3"/>
            <h3 className="text-xl font-headline text-foreground mb-2">Translate & Connect</h3>
            <p className="text-foreground/80">Break language barriers by translating your poetic creations, sharing your unique perspective with a global audience.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Share2 className="w-10 h-10 text-primary mb-3"/>
            <h3 className="text-xl font-headline text-foreground mb-2">Design & Share</h3>
            <p className="text-foreground/80">Turn your favorite lines into beautiful, shareable quote images, customized with fonts and styles for social media.</p>
          </div>
        </div>
      </section>

       <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
        <h2 className="text-3xl font-headline text-accent mb-6 text-center">The Team</h2>
        <p className="text-foreground/90 leading-relaxed max-w-3xl mx-auto text-center">
          InstaPoem is brought to life by a small, passionate team of developers, designers, and AI enthusiasts who share a profound love for both visual arts and the timeless power of words. We are dedicated to building a tool that feels both magical and personal, and we are constantly working to improve the platform and introduce new features to enhance your creative experience. Thank you for being part of our story.
        </p>
      </section>
    </div>
  );
}
