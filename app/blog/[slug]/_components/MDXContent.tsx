import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import withSlugs from 'rehype-slug';

interface MDXContentProps {
  source: string;
}

async function SafeMDXRemote({ source }: MDXContentProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const components = useMDXComponents({});

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [withSlugs, rehypeSanitize, rehypePrettyCode],
        },
      }}
    />
  );
}

function MDXFallback({ source }: MDXContentProps) {
  return (
    <div className="whitespace-pre-wrap rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
      <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
        콘텐츠 렌더링 중 문제가 발생하여 원본 텍스트로 표시합니다.
      </p>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {source}
      </div>
    </div>
  );
}

export default async function MDXContent({ source }: MDXContentProps) {
  try {
    return await SafeMDXRemote({ source });
  } catch (error) {
    console.error('[MDXContent] MDX 렌더링 실패:', error);
    return <MDXFallback source={source} />;
  }
}
