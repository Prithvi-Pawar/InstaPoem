
// src/app/about-us/page.tsx
import type { Metadata } from 'next';
import { Users, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - InstaPoem',
  description: 'Learn more about InstaPoem and our mission.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <Users className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-headline text-primary mb-3">About InstaPoem</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover the story behind InstaPoem and our passion for blending imagery with the art of poetry.
        </p>
      </header>

      <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
        <h2 className="text-3xl font-headline text-accent mb-6 flex items-center">
          <Info className="w-7 h-7 mr-3 text-accent" />
          Our Mission
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          At InstaPoem, we believe that every image holds a thousand words, waiting to be woven into poetic verse. 
          Our mission is to provide a creative platform where visual inspiration meets lyrical expression, empowering users to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6 pl-4">
          <li>Transform captivating photos into unique, AI-generated poems.</li>
          <li>Edit and refine these poems to perfectly capture their intended meaning and emotion.</li>
          <li>Translate their creations into various languages, sharing their art with a global audience.</li>
          <li>Seamlessly schedule and prepare their poetic masterpieces for social sharing.</li>
        </ul>
        <p className="text-foreground/90 leading-relaxed">
          We are dedicated to fostering a community of creativity, where technology and art converge to unlock new forms of storytelling. 
          Whether you're a seasoned poet or just exploring your artistic side, InstaPoem is here to inspire and assist you on your creative journey.
        </p>
      </section>

       <section className="mt-12 bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
        <h2 className="text-3xl font-headline text-accent mb-6">The Team</h2>
        <p className="text-foreground/90 leading-relaxed">
          InstaPoem was brought to life by a small, passionate team of developers, designers, and AI enthusiasts who share a love for both visual arts and the power of words. We are constantly working to improve the platform and introduce new features to enhance your creative experience.
        </p>
      </section>
    </div>
  );
}
