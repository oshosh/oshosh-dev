import metadata from '@/lib/metadata';
import { getPublishedPosts } from '@/lib/notion';
import RSS from 'rss';

export async function GET() {
  try {
    // RSS 피드 설정
    const feed = new RSS({
      title: 'OSHOSH 블로그',
      description: '웹 개발자 OSH의 기술 블로그 #Web #Frontend #Developer',
      site_url: metadata.meta.url,
      feed_url: `${metadata.meta.url}/rss.xml`,
      language: 'ko-KR',
      pubDate: new Date(),
      copyright: `Copyright © ${new Date().getFullYear()} osh`,
    });

    // 블로그 포스트 가져오기
    const { posts } = await getPublishedPosts({ pageSize: 100 });

    // 각 포스트를 RSS 피드에 추가
    posts.forEach((post) => {
      feed.item({
        title: post.title,
        description: post.description || '',
        url: `${metadata.meta.url}/blog/${post.slug}`,
        author: post.author || 'osh',
        date: new Date(post.date || new Date()),
        categories: post.tags || [],
        // 썸네일 이미지가 있는 경우
        ...(post.coverImage && { enclosure: { url: post.coverImage } }),
      });
    });

    // XML 형식으로 반환
    return new Response(feed.xml({ indent: true }), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('RSS 피드 생성 오류:', error);
    return new Response('RSS 피드 생성 중 오류가 발생했습니다', { status: 500 });
  }
}
