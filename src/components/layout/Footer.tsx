
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <p className="text-sm">Loved by 10K+ poets (example social proof)</p>
          {/* Add Twitter/Instagram testimonials here if desired */}
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <Link href="/about-us" className="text-sm hover:text-primary transition-colors">About Us</Link>
          <Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
        </div>
        <p className="text-xs">
          Powered by Firebase & AI Magic. &copy; 2024 InstaPoem.
        </p>
      </div>
    </footer>
  );
}
