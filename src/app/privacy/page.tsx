
// src/app/privacy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, FileText, Server, BrainCircuit, UserCog } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - InstaPoem',
  description: 'Understand how InstaPoem handles your data and respects your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <ShieldCheck className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-headline text-primary mb-3">Privacy Policy</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Your privacy is fundamental to your creative expression. This policy outlines how we handle your information with transparency and respect.
        </p>
        <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <div className="space-y-8 max-w-4xl mx-auto">
        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-accent" />
            The Short Version
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Your creative work—your photos, poems, and quotes—is yours. We use AI services to help you create, but your history is stored directly on your device in your browser's local storage. We do not create user accounts or store your creations on our servers.
          </p>
        </section>

        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-4 flex items-center">
            <Server className="w-6 h-6 mr-3 text-accent" />
            Information We Collect & How We Use It
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            When you use InstaPoem, certain data is processed to make the magic happen:
          </p>
          <ul className="list-disc list-inside space-y-3 text-foreground/80 pl-4">
            <li>
              <strong>Images You Upload:</strong> Your images are sent to a third-party AI service (Google Gemini) to generate a poem. We do not store, view, or claim ownership of your images after this process is complete.
            </li>
            <li>
              <strong>Poem and Quote Text:</strong> The text you generate, edit, or translate is also sent to the AI service to fulfill your request (e.g., "translate this poem"). This data is not used for any other purpose.
            </li>
            <li>
              <strong>Your Creative History:</strong> To provide the "My Poems" and "My Quotes" features, we save your work (including the generated poem, quotes, image filename, and a temporary link to the image for recent items) directly into your browser's <strong>local storage</strong>. This data remains on your computer and is not uploaded to our servers.
            </li>
          </ul>
        </section>

        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-4 flex items-center">
            <BrainCircuit className="w-6 h-6 mr-3 text-accent" />
            Third-Party AI Services
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            We use Genkit to interact with Google's Gemini AI models. These models process your uploaded images and text prompts to generate poems, quotes, and translations. Their use of data is governed by their respective privacy policies. We only send the data necessary to fulfill your creative request.
          </p>
        </section>

        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-4 flex items-center">
            <UserCog className="w-6 h-6 mr-3 text-accent" />
            Your Control & Data Rights
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            You are in full control of your data stored on your device. You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-4">
            <li><strong>Delete Individual Items:</strong> Use the "Delete" button in the "My Poems" or "My Quotes" sections to remove specific items from your history.</li>
            <li><strong>Clear All Data:</strong> Clear your browser's site data for InstaPoem to permanently erase your entire history.</li>
          </ul>
        </section>

        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-3">Changes to This Policy</h2>
          <p className="text-foreground/90 leading-relaxed">
            We may update this privacy policy from time to time to reflect changes in our services. We will notify you of any significant changes by posting the new policy on this page.
          </p>
        </section>
        
        <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30">
          <h2 className="text-2xl font-headline text-accent mb-3">Contact Us</h2>
          <p className="text-foreground/90 leading-relaxed">
            If you have any questions about this Privacy Policy, please get in touch via our <Link href="/contact" className="text-primary underline hover:text-accent">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
