import GiscusComments from '@/components/GiscusComments';
import { Badge } from '@/components/ui/badge';
import { ScrollProgressBar } from '@/components/ui/scroll-progress-bar';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/date';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { compile } from '@mdx-js/mdx';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { CalendarDays, User } from 'lucide-react';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import withSlugs from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { BlogTableOfContents } from './_components/BlogTableOfContents';
import { PostFooter } from './_components/PostFooter';

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다!!!',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }

  /// 11111

  return {
    title: post.title,
    description: post.description || `${post.title} - OSH 블로그`,
    keywords: post.tags,
    authors: [{ name: post.author || 'OSH' }],
    publisher: 'OSH',
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedDate,
      authors: post.author || 'OSH',
      tags: post.tags,
    },
  };
}

export const generateStaticParams = async () => {
  const { posts } = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

// export const revalidate = 60;

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { markdown, post, previousPost, nextPost } = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { data } = await compile(markdown, {
    rehypePlugins: [
      withSlugs,
      rehypeSanitize,
      withToc,
      withTocExport,
      /** Optionally, provide a custom name for the export. */
      // [withTocExport, { name: 'toc' }],
    ],
  });
  /// 3333
  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 h-1">
        <ScrollProgressBar />
      </div>
      <main className="container py-6 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(80%,_1fr)_240px] md:gap-8">
          <article className="w-full">
            {/* 블로그 헤더 */}
            <header className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  {post.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
              </div>

              {/* 메타 정보 */}
              <div className="text-muted-foreground flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
            </header>

            <Separator className="my-8" />

            <nav className="md:hidden">
              <BlogTableOfContents toc={data?.toc || []} isMobile={true} />
            </nav>

            {/* 블로그 본문 */}

            <section className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
              <MDXRemote
                source={markdown}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [withSlugs, rehypeSanitize, rehypePrettyCode],
                  },
                }}
              />
            </section>

            <Separator className="my-8" />
            <PostFooter previousPost={previousPost} nextPost={nextPost} />
            <div className="mt-8">
              <GiscusComments />
            </div>
          </article>
          <nav className="relative hidden md:block">
            <BlogTableOfContents toc={data?.toc || []} />
          </nav>
        </div>
      </main>
    </>
  );
}
