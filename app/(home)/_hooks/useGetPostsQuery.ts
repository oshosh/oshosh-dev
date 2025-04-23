import { GetPublishedPostsResponse } from '@/lib/notion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../_lib';

interface GetPostsProps {
  tag: string;
  sort: string;
  pageSize: number;
  initialData: Promise<GetPublishedPostsResponse>;
}

export const useGetPostsQuery = ({ tag, sort, pageSize, initialData }: GetPostsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', tag, sort, pageSize],
    queryFn: (props) => {
      const pageParam = props.pageParam as string | undefined;

      return fetchPosts({ tag, sort, pageSize, pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialData],
      pageParams: [undefined],
    },
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage };
};
