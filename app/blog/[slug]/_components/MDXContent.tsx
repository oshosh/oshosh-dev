import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import withSlugs from 'rehype-slug';

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
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
