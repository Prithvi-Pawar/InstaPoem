
'use client';

import Link from 'next/link';
import { PenLine, Home, ListOrdered, CalendarClock, History as HistoryIcon, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'My Poems', icon: ListOrdered },
    { href: '/schedule', label: 'Schedule', icon: CalendarClock },
    // { href: '/history', label: 'History', icon: HistoryIcon }, // My Poems covers history
  ];

  return (
    <header className="bg-card/80 backdrop-blur-md text-card-foreground shadow-md sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline hover:opacity-80 transition-opacity text-primary">
          <PenLine className="w-7 h-7" />
          <span>InstaPoem</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-accent/20 hover:text-accent-foreground",
                  pathname === item.href ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{item.label}</span>
                 <span className="sm:hidden text-xs">{item.label}</span>
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="text-foreground/80 hover:bg-accent/20 hover:text-accent-foreground focus-visible:ring-ring focus-visible:ring-offset-background"
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
```