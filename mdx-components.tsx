import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // 코드 강조 스타일링
    code: ({ children, ...props }) => {
      return (
        <code
          {...props}
          className="inline-block rounded border bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        >
          {children}
        </code>
      );
    },
    // 코드 블록 스타일링
    pre: ({ children, ...props }) => {
      return (
        <pre {...props} className="overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          {children}
        </pre>
      );
    },
  };
}
