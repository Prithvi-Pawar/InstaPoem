
// src/app/privacy/page.tsx
import type { Metadata } from 'next';
import { ShieldCheck, FileText } from 'lucide-react';

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
          Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
        </p>
      </header>

      <section className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/30 space-y-6">
        <div>
          <h2 className="text-2xl font-headline text-accent mb-3 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-accent" />
            Introduction
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Welcome to InstaPoem. We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Information We Collect</h2>
          <p className="text-foreground/90 leading-relaxed">
            When you use InstaPoem, we may collect the following information:
          </p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2 pl-4">
            <li><strong>Images You Upload:</strong> Images are processed to generate poems and are temporarily stored for this purpose. We do not claim ownership of your images.</li>
            <li><strong>Generated Poems & Edits:</strong> Poems you generate, edit, and save are stored locally in your browser's storage to provide the "My Poems" history feature.</li>
            <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our application to help us improve our services. This does not include personally identifiable information.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">How We Use Your Information</h2>
          <p className="text-foreground/90 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2 pl-4">
            <li>Provide, operate, and maintain our services (poem generation, translation, scheduling).</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our services.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Data Storage and Security</h2>
          <p className="text-foreground/90 leading-relaxed">
            Your poem history, including associated images (for recent items) and text, is stored in your browser's local storage. This data is not automatically transmitted to our servers beyond the necessary processing for AI features. 
            We implement a variety of security measures to maintain the safety of your personal information when you use our service, but remember that no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Third-Party Services</h2>
          <p className="text-foreground/90 leading-relaxed">
            We use third-party AI models (e.g., via Genkit) to power poem generation and translation. These services process the data you provide (images, text) to fulfill your requests. Their use of your information is governed by their respective privacy policies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Your Privacy Rights</h2>
          <p className="text-foreground/90 leading-relaxed">
            You have the right to access, update, or delete the information stored in your browser's local storage by clearing your browser data or using the "Delete" functionality within the "My Poems" section of the app.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Changes to This Policy</h2>
          <p className="text-foreground/90 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-headline text-accent mb-3">Contact Us</h2>
          <p className="text-foreground/90 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through the "Contact" page.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </section>
    </div>
  );
}
