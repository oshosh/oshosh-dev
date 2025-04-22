import { Typography } from '@/components/ui/typography';
import { Github, Rss } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const menuItems = [
    { icon: Rss, label: 'RSS', href: '/rss.xml', external: true },
    { icon: Github, label: 'Github', href: 'https://github.com/oshosh', external: true },
  ];

  return (
    <footer className="border-t">
      <div className="container flex h-16 flex-col justify-center gap-1 space-x-1">
        <div className="flex gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              {...(item.external && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
        <Typography as="p" variant="small">
          Copyright © 2025 osh
        </Typography>
        <Typography as="p" variant="small">
          oshosh.dev
        </Typography>
      </div>
    </footer>
  );
}
