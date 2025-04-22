'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TagFilterItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { use } from 'react';
import { Typography } from '@/components/ui/typography';

interface TagSectionProps {
  tags: Promise<TagFilterItem[]>;
  selectedTag: string;
}

export default function TagSection({ tags, selectedTag }: TagSectionProps) {
  const allTags = use(tags);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography as="p" variant="medium" color="secondary">
            태그 목록
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {allTags.map((tag) => (
            <Link href={`?tag=${tag.name}`} key={tag.name}>
              <div
                className={cn(
                  'hover:bg-muted-foreground/10 text-muted-foreground flex items-center justify-between rounded-md p-1.5 text-sm transition-colors',
                  selectedTag === tag.name && 'bg-muted-foreground/10 text-foreground font-medium'
                )}
              >
                <Typography variant="small">{tag.name}</Typography>
                <Typography variant="small">{tag.count}</Typography>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
