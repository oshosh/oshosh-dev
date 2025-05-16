'use client';

import { useActiveSection } from '@/hooks/use-active-section';
import { cn, extractIds } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

interface TableOfContentsProps {
  toc: TocEntry[];
  isMobile?: boolean;
}

export function BlogTableOfContents({ toc, isMobile = false }: TableOfContentsProps) {
  const sectionIds = useMemo(() => extractIds(toc), [toc]);
  const { activeId, navigateToSection } = useActiveSection({
    sectionIds,
  });

  if (!toc?.length) return null;

  const handleTocClick = (id: string) => {
    navigateToSection(id);
  };

  // 목차 링크 렌더링 함수
  function TableOfContentsLink({ item, level = 0 }: { item: TocEntry; level?: number }) {
    const isActive = activeId === item.id;

    return (
      <div className="space-y-2">
        <Link
          key={item.id}
          href={`#${item.id}`}
          onClick={() => item.id && handleTocClick(item.id)}
          className={cn(
            'block font-medium transition-colors',
            isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
            isActive && 'border-primary -ml-3 border-l-2 pl-2'
          )}
        >
          {item.value}
        </Link>
        {item.children && item.children.length > 0 && (
          <div className="space-y-2 pl-4">
            {item.children.map((subItem) => (
              <TableOfContentsLink key={subItem.id} item={subItem} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 모바일 목차 렌더링
  if (isMobile) {
    return (
      <div className="sticky top-[var(--sticky-top)] mb-6 md:hidden">
        <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
          <summary className="cursor-pointer text-lg font-semibold">목차</summary>
          <nav className="mt-3 space-y-3 text-sm">
            {toc.map((item) => (
              <TableOfContentsLink key={item.id} item={item} />
            ))}
          </nav>
        </details>
      </div>
    );
  }

  // 데스크톱 목차 렌더링
  return (
    <div className="sticky top-[var(--sticky-top)]">
      <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold">목차</h3>
        <nav className="space-y-3 text-sm">
          {toc.map((item) => (
            <TableOfContentsLink key={item.id} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
