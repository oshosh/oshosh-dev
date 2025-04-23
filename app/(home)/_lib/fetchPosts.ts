interface FetchPostsProps {
  tag: string;
  sort: string;
  pageSize: number;
  pageParam: string | undefined;
}

export async function fetchPosts({ tag, sort, pageSize, pageParam }: FetchPostsProps) {
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (sort) params.set('sort', sort);
  if (pageParam) params.set('startCursor', pageParam);
  params.set('pageSize', pageSize.toString());

  const res = await fetch(`/api/posts?${params.toString()}`, {
    next: {
      tags: ['posts'],
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
