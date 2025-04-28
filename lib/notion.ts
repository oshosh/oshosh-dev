import type { FilesPropertyValue, Post, TagFilterItem } from '@/types/blog';
import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  PersonUserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { unstable_cache } from 'next/cache';
import { NotionToMarkdown } from 'notion-to-md';
import { cloudinaryApi } from './cloudinary';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

export const convertNotionImageToPermanent = async (
  imageUrl: string,
  pageId: string
): Promise<string> => {
  // 이미 cloudinary URL이면 변환하지 않음
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // 만료 시간이 있는 노션 이미지를 Cloudinary로 변환
  return await cloudinaryApi.convertToPermanentImage(imageUrl, `${pageId}_cover_image`);
};

async function getCoverImage(
  cover: PageObjectResponse['cover'] | FilesPropertyValue,
  pageId: string
): Promise<string> {
  if (!cover) return '';

  let imageUrl = '';

  switch (cover.type) {
    case 'external':
      imageUrl = cover.external.url;
      break;
    case 'files': {
      imageUrl = cover.files[0]?.file?.url || '';
      // 노션 파일 URL이면 영구 URL로 변환
      if (imageUrl && imageUrl.includes('prod-files-secure.s3.us-west-2.amazonaws.com')) {
        const cloudinaryUrl = await convertNotionImageToPermanent(imageUrl, pageId);

        // 중요: 노션 API를 통해 커버 이미지를 external 타입으로 업데이트
        try {
          await notion.pages.update({
            page_id: pageId,
            cover: {
              type: 'external',
              external: {
                url: cloudinaryUrl,
              },
            },
          });

          await notion.pages.update({
            page_id: pageId,
            properties: {
              cover: {
                files: [
                  {
                    name: `images-m-${pageId}`,
                    type: 'external',
                    external: {
                      url: cloudinaryUrl,
                    },
                  },
                ],
              },
            },
          });

          console.log('커버 이미지를 external 타입으로 업데이트 완료');
        } catch (error) {
          console.error('커버 이미지 업데이트 실패:', error);
        }

        imageUrl = cloudinaryUrl;
      }
      break;
    }
    default:
      return '';
  }

  return imageUrl;
}

async function getPostMetadata(page: PageObjectResponse): Promise<Post> {
  const { properties } = page;

  console.log('page.cover', properties.cover);
  // 커버 이미지 처리
  const coverImage =
    page.cover?.type === 'external'
      ? page.cover.external.url
      : properties.cover?.type === 'files'
        ? await getCoverImage(page.properties.cover as FilesPropertyValue, page.id)
        : '';

  return {
    id: page.id,
    title:
      properties.Title.type === 'rich_text'
        ? (properties.Title.rich_text[0]?.plain_text ?? '')
        : '',
    description:
      properties.Description.type === 'rich_text'
        ? (properties.Description.rich_text[0]?.plain_text ?? '')
        : '',
    coverImage,
    tags:
      properties.Tags.type === 'multi_select'
        ? properties.Tags.multi_select.map((tag) => tag.name)
        : [],
    author:
      properties.Author.type === 'people'
        ? ((properties.Author.people[0] as PersonUserObjectResponse)?.name ?? '')
        : '',
    date: properties.Date.type === 'date' ? (properties.Date.date?.start ?? '') : '',
    modifiedDate: page.last_edited_time,
    slug:
      properties.Slug.type === 'title'
        ? (properties.Slug.title[0]?.plain_text ?? page.id)
        : page.id,
  };
}

export const getPostBySlug = async (
  slug: string
): Promise<{
  markdown: string;
  post: Post | null;
}> => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Published',
          },
        },
      ],
    },
  });
  console.log('response???????????????????????????????????', response);
  if (!response.results[0]) {
    return {
      markdown: '',
      post: null,
    };
  }

  const mdBlocks = await n2m.pageToMarkdown(response.results[0].id);
  console.log('mdBlocks???????????????????????????????????', mdBlocks);
  const { parent } = n2m.toMarkdownString(mdBlocks);
  console.log('parent', parent);
  return {
    markdown: parent,
    post: await getPostMetadata(response.results[0] as PageObjectResponse),
  };

  // return getPageMetadata(response);
};

export interface GetPublishedPostsParams {
  tag?: string;
  sort?: string;
  pageSize?: number;
  startCursor?: string;
}
export interface GetPublishedPostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const getPublishedPosts = unstable_cache(
  async ({
    tag = '전체',
    sort = 'latest',
    pageSize = 2,
    startCursor,
  }: GetPublishedPostsParams = {}): Promise<GetPublishedPostsResponse> => {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
          ...(tag && tag !== '전체'
            ? [
                {
                  property: 'Tags',
                  multi_select: {
                    contains: tag,
                  },
                },
              ]
            : []),
        ],
      },
      sorts: [
        {
          property: 'Date',
          direction: sort === 'latest' ? 'descending' : 'ascending',
        },
      ],
      page_size: pageSize,
      start_cursor: startCursor,
    });
    // console.log('notion getPublishedPosts', JSON.stringify(response.results[0]));

    const posts = await response.results.filter(
      (page): page is PageObjectResponse => 'properties' in page
    );

    const mapToPost = await Promise.all(posts.map(getPostMetadata));

    return {
      posts: mapToPost,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  },
  undefined,
  {
    tags: ['posts'],
  }
);

export const getTags = async (): Promise<TagFilterItem[]> => {
  const { posts } = await getPublishedPosts({ pageSize: 100 });

  // 모든 태그를 추출하고 각 태그의 출현 횟수를 계산
  const tagCount = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  // TagFilterItem 형식으로 변환
  const tags: TagFilterItem[] = Object.entries(tagCount).map(([name, count]) => ({
    id: name,
    name,
    count,
  }));

  // "전체" 태그 추가
  tags.unshift({
    id: 'all',
    name: '전체',
    count: posts.length,
  });

  // 태그 이름 기준으로 정렬 ("전체" 태그는 항상 첫 번째에 위치하도록 제외)
  const [allTag, ...restTags] = tags;
  const sortedTags = restTags.sort((a, b) => a.name.localeCompare(b.name));

  return [allTag, ...sortedTags];
};

export interface CreatePostParams {
  title: string;
  tag: string;
  content: string;
}

export const createPost = async ({ title, tag, content }: CreatePostParams) => {
  const response = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID!,
    },
    properties: {
      Title: {
        rich_text: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: content,
            },
          },
        ],
      },
      Tags: {
        multi_select: [{ name: tag }],
      },
      Status: {
        select: {
          name: 'Published',
        },
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });

  return response;
};
