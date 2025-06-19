
'use client';

import Link from 'next/link';
import { PenLine, Home, ListOrdered, CalendarClock, Moon, Sun, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader, // Added import
  SheetTitle,  // Added import
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'My Poems', icon: ListOrdered },
    { href: '/schedule', label: 'Schedule', icon: CalendarClock },
  ];

  // Reusable NavLink component for use in both desktop and mobile sheet
  const NavLinkItem = ({ 
    href, 
    label, 
    icon: Icon, 
    onClick,
    isMobile = false 
  }: { 
    href: string; 
    label: string; 
    icon: React.ElementType; 
    onClick?: () => void;
    isMobile?: boolean;
  }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md transition-colors",
        isMobile 
          ? "px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground" // Mobile specific styling
          : "gap-1.5 px-2.5 py-1.5 text-sm font-medium hover:bg-accent/20 hover:text-accent-foreground", // Desktop specific
        pathname === href 
          ? (isMobile ? "bg-primary/20 text-primary font-semibold" : "bg-primary/10 text-primary font-semibold")
          : (isMobile ? "text-foreground/90" : "text-foreground/80 hover:text-primary")
      )}
      aria-current={pathname === href ? "page" : undefined}
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5", isMobile ? "h-6 w-6" : "sm:h-5 sm:w-5")} />
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="bg-card/80 backdrop-blur-md text-card-foreground shadow-md sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline hover:opacity-80 transition-opacity text-primary">
          <PenLine className="w-7 h-7" />
          <span>InstaPoem</span>
        </Link>

        {/* Mobile Navigation: Hamburger Menu & Theme Toggle */}
        <div className="sm:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="text-foreground/80 hover:bg-accent/20 hover:text-accent-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="text-foreground/80 hover:bg-accent/20 hover:text-accent-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-card flex flex-col"> {/* Removed pt-8 */}
                <SheetHeader className="p-4 border-b border-border/50">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 text-xl font-headline text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                            <PenLine className="w-6 h-6" />
                            <span>InstaPoem</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
              <nav className="flex flex-col gap-1 p-4 flex-grow">
                {navItems.map(item => (
                  <NavLinkItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isMobile={true}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
               <div className="p-4 mt-auto border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} InstaPoem</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation: Horizontal Links & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map(item => (
              <NavLinkItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isMobile={false}
              />
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
