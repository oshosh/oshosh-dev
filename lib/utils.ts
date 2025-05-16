import { TocEntry } from '@stefanprobst/rehype-extract-toc';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 모든 TOC 항목에서 ID 추출 합니다.
 */
export function extractIds(items: TocEntry[]): string[] {
  const ids: string[] = [];

  function traverse(item: TocEntry) {
    if (item.id) {
      ids.push(item.id);
    }

    if (item.children) {
      item.children.forEach(traverse);
    }
  }

  items.forEach(traverse);
  return ids;
}
