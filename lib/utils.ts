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

/**
 * MDX 표현식 오류를 일으킬 수 있는 패턴들을 정리
 * @see https://github.com/micromark/micromark-extension-mdx-expression/tree/main/packages/micromark-extension-mdx-expression#could-not-parse-expression-with-acorn
 */
export function sanitizeMarkdown(markdown: string): string {
  let sanitized = markdown;

  // 코드 블록을 임시로 보호
  const codeBlocks: string[] = [];
  let blockIndex = 0;

  // ```로 감싸진 코드 블록을 임시로 보호
  sanitized = sanitized.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${blockIndex}__`;
    codeBlocks[blockIndex] = match;
    blockIndex++;
    return placeholder;
  });

  // 인라인 코드 블록도 보호 (백틱으로 감싸진 부분)
  sanitized = sanitized.replace(/`([^`]+)`/g, (match) => {
    const placeholder = `__INLINE_CODE_${blockIndex}__`;
    codeBlocks[blockIndex] = match;
    blockIndex++;
    return placeholder;
  });

  // 잘못된 중괄호 패턴 정리 (예: { } 또는 {text} 등)
  sanitized = sanitized.replace(/\{([^}]*)\}/g, (match, content) => {
    // 유효한 MDX 표현식이 아닌 경우 제거
    if (!content.trim() || content.includes(' ') || content.length > 50) {
      return '';
    }
    return match;
  });

  sanitized = sanitized.replace(/\{\s*\}/g, '');
  sanitized = sanitized.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 코드 블록 복원
  codeBlocks.forEach((block, index) => {
    const placeholder = block.startsWith('```')
      ? `__CODE_BLOCK_${index}__`
      : `__INLINE_CODE_${index}__`;
    sanitized = sanitized.replace(placeholder, block);
  });

  return sanitized;
}
