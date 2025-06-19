
'use client';

import Link from 'next/link';
import { Camera, Home, History as HistoryIcon, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 sm:gap-4">
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
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground focus-visible:ring-primary-foreground focus-visible:ring-offset-primary"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
