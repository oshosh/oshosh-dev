'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useOs } from '@/hooks/use-os';
import { useHotkeys } from '@/hooks/useHotKeys';
import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Search() {
  const initialText = {
    ios: 'Cmd + K',
    mac: 'Cmd + K',
    macos: 'Cmd + K',
    windows: 'Ctrl + K',
    win64: 'Ctrl + K',
    android: 'Ctrl + K',
    default: 'Ctrl + K',
  };

  const { keyName } = useOs(initialText);
  const router = useRouter();
  useHotkeys(
    [
      {
        match: ['ctrl+k', 'command+k'],
        callback: () => {
          router.push('/search');
        },
      },
    ],
    []
  );

  return (
    <>
      <Button
        className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5"
        onClick={() => router.push('/search')}
      >
        <SearchIcon className="h-4 w-4" />
        <Typography variant="xsmall">포스트 검색...</Typography>
        <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
          <Typography variant="small">{keyName}</Typography>
        </kbd>
      </Button>
    </>
  );
}
