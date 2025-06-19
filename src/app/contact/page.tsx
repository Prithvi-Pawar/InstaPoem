// src/app/contact/page.tsx
'use client';

import { Mail, MessageSquare, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Note: Metadata should ideally be exported from a server component or layout if this page is client-rendered.
// For full optimization, you might move metadata to a layout.tsx if this page becomes fully client-side.
// We have removed the metadata export from here as it's a client component.

export default function ContactPage() {
  // Basic form submission handler (does not actually send email)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Thank you for your message! (This is a demo, no email was sent.)');
    // Here you would typically handle form submission, e.g., send data to a backend or email service.
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <Mail className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-headline text-primary mb-3">Contact InstaPoem</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question, feedback, or a feature request, feel free to reach out.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-accent flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Send Us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-medium text-foreground/90">Full Name</Label>
                <Input type="text" id="name" name="name" required className="mt-1 bg-background/50 focus:ring-accent focus:border-accent" />
              </div>
              <div>
                <Label htmlFor="email" className="font-medium text-foreground/90">Email Address</Label>
                <Input type="email" id="email" name="email" required className="mt-1 bg-background/50 focus:ring-accent focus:border-accent" />
              </div>
              <div>
                <Label htmlFor="subject" className="font-medium text-foreground/90">Subject</Label>
                <Input type="text" id="subject" name="subject" required className="mt-1 bg-background/50 focus:ring-accent focus:border-accent" />
              </div>
              <div>
                <Label htmlFor="message" className="font-medium text-foreground/90">Your Message</Label>
                <Textarea id="message" name="message" rows={5} required className="mt-1 bg-background/50 focus:ring-accent focus:border-accent min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-headline py-3">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-accent flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Our Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/80">
              <p>
                <strong>InstaPoem HQ</strong><br />
                123 Creative Lane<br />
                Artville, Imaginaria, 00000
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:hello@instapoem.app" className="text-primary hover:underline">hello@instapoem.app</a> (Conceptual)
              </p>
              <p>
                Please note that this is a conceptual app, and the contact details are illustrative.
              </p>
            </CardContent>
          </Card>
          
           <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-accent">Office Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/80">
              <p>Monday - Friday: 9:00 AM - 5:00 PM (Imaginaria Standard Time)</p>
              <p>Saturday - Sunday: Closed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
