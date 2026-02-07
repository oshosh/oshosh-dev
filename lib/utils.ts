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

  // 보호할 코드 블록을 저장
  const protectedBlocks: string[] = [];
  let blockIndex = 0;

  const protect = (match: string, prefix: string): string => {
    const placeholder = `__${prefix}_${blockIndex}__`;
    protectedBlocks[blockIndex] = match;
    blockIndex++;
    return placeholder;
  };

  // 1) ```로 감싸진 코드 블록 보호 (가장 먼저 처리)
  sanitized = sanitized.replace(/```[\s\S]*?```/g, (m) => protect(m, 'CODEBLOCK'));

  // 2) 인라인 코드 보호 (`...`)
  sanitized = sanitized.replace(/`[^`]+`/g, (m) => protect(m, 'INLINE'));

  // 3) 중첩 중괄호 {{ ... }} → 텍스트로 이스케이프 (Helm, 템플릿 문법 등)
  sanitized = sanitized.replace(/\{\{[\s\S]*?\}\}/g, (match) => {
    return match.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
  });

  // 4) 짝이 맞는 { ... } 중 유효하지 않은 MDX 표현식 → 이스케이프
  sanitized = sanitized.replace(/\{([^}]*)\}/g, (match, content: string) => {
    const trimmed = content.trim();
    // 빈 중괄호 제거
    if (!trimmed) return '';
    // 공백이 포함되거나 긴 내용은 MDX 표현식이 아님 → 이스케이프
    if (trimmed.includes(' ') || trimmed.length > 50) {
      return `&#123;${content}&#125;`;
    }
    return match;
  });

  // 5) 짝이 안 맞는 단독 { 또는 } 이스케이프
  //    (위에서 짝이 맞는 {}는 이미 처리/제거됨)
  sanitized = sanitized.replace(/(?<![_A-Z0-9])\{(?![_A-Z0-9])/g, '&#123;');
  sanitized = sanitized.replace(/(?<![_A-Z0-9])\}(?![_A-Z0-9])/g, '&#125;');

  // 6) HTML처럼 보이는 태그 중 MDX가 JSX로 해석할 수 있는 것들 이스케이프
  //    (예: <user>, <host>, <service> 등 소문자 커스텀 태그)
  sanitized = sanitized.replace(/<([a-z][a-z0-9-]*)([\s>/])/gi, (match, tag: string, after: string) => {
    // 허용되는 HTML 태그는 그대로 두기
    const allowedTags = new Set([
      'a', 'abbr', 'address', 'article', 'aside', 'b', 'bdi', 'bdo',
      'blockquote', 'br', 'caption', 'cite', 'code', 'col', 'colgroup',
      'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption',
      'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
      'hr', 'i', 'img', 'input', 'ins', 'kbd', 'li', 'main', 'mark',
      'nav', 'ol', 'p', 'picture', 'pre', 'q', 'rp', 'rt', 'ruby',
      's', 'samp', 'section', 'small', 'source', 'span', 'strong', 'sub',
      'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead',
      'time', 'tr', 'u', 'ul', 'var', 'video', 'wbr',
    ]);
    if (allowedTags.has(tag.toLowerCase())) return match;
    return `&lt;${tag}${after}`;
  });

  // 7) 연속 빈 줄 정리
  sanitized = sanitized.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 보호했던 코드 블록 복원
  for (let i = protectedBlocks.length - 1; i >= 0; i--) {
    const block = protectedBlocks[i];
    const prefix = block.startsWith('```') ? 'CODEBLOCK' : 'INLINE';
    sanitized = sanitized.replace(`__${prefix}_${i}__`, block);
  }

  return sanitized;
}
