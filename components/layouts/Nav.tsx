'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useState } from 'react';

export default function Nav() {
  const isMobile = useIsMobile();
  const segment = useSelectedLayoutSegment();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '홈', isActive: segment === null },
    { href: '/blog', label: '블로그', isActive: segment === 'blog' },
    { href: '/about', label: '소개', isActive: segment === 'about' },
  ];

  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <Typography
            color={link.isActive ? 'secondary' : 'default'}
            className={!link.isActive ? 'hover:text-primary-text-secondary' : ''}
          >
            {link.label}
          </Typography>
        </Link>
      ))}
    </>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <Menu className="size-6" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
            <nav className="mt-8 flex flex-col items-start gap-6 text-lg font-bold">
              {renderNavLinks()}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex items-center justify-center gap-10 text-lg font-bold">
          {renderNavLinks()}
        </nav>
      )}
    </>
  );
}
