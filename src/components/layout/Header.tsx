'use client';

import Link from 'next/link';
import { Camera, Home, History as HistoryIcon } from 'lucide-react'; // Using Camera as a simple logo icon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'History', icon: HistoryIcon },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline hover:opacity-80 transition-opacity">
          <Camera className="w-8 h-8" />
          <span>InstaPoem</span>
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground hover:text-primary",
                pathname === item.href ? "bg-primary-foreground text-primary" : "text-primary-foreground"
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
