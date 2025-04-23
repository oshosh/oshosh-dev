'use client';

import Link from 'next/link';
import { PostCard } from '@/components/features/blog/PostCard';
import { Loader2 } from 'lucide-react';
import { GetPublishedPostsResponse } from '@/lib/notion';
import { useSearchParams } from 'next/navigation';
import { useEffect, use } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetPostsQuery } from '@/app/(home)/_hooks/useGetPostsQuery';

interface PostListProps {
  postsPromise: Promise<GetPublishedPostsResponse>;
}

export default function PostList({ postsPromise }: PostListProps) {
  const initialData = use(postsPromise);
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');
  const sort = searchParams.get('sort');
  const pageSize = 2;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPostsQuery({
    tag: tag || '전체',
    sort: sort || 'latest',
    pageSize,
    initialData,
  });

  const { ref, inView } = useInView({
    threshold: 1,
  });
  // const handleLoadMore = () => {
  //   if (hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {allPosts.map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <PostCard post={post} isFirst={index === 0} />
          </Link>
        ))}
      </div>
      {hasNextPage && !isFetchingNextPage && <div ref={ref} className="h-10" />}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          <span className="text-muted-foreground text-sm">로딩중...</span>
        </div>
      )}
      {/* {hasNextPage && (
        <div>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '로딩중...' : '더보기'}
          </Button>
        </div>
      )} */}
    </div>
  );
}
