// import { revalidatePath, revalidateTag } from 'next/cache';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const pageId = request.nextUrl.searchParams.get('pageId');

//   if (!pageId) {
//     return NextResponse.json({ revalidated: false, message: 'Missing pageId' }, { status: 400 });
//   }

//   try {
//     // 모든 관련 캐시 무효화
//     revalidateTag('posts');
//     revalidateTag('post-detail');
//     revalidateTag('tags'); // 태그 캐시도 무효화
//     revalidatePath('/', 'page'); // 홈페이지 캐시 무효화
//     revalidatePath('/blog', 'layout');
//     revalidatePath('/blog', 'page'); // 블로그 목록 페이지 캐시 무효화
//     revalidatePath(`/blog/${pageId}`, 'page'); // 특정 블로그 포스트 캐시 무효화

//     return NextResponse.json({
//       revalidated: true,
//       now: new Date(),
//       revalidatePath: `/blog/${pageId}`,
//     });
//   } catch (err) {
//     return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   const { pageId, revalidateKey } = await request.json();

//   if (revalidateKey !== process.env.REVALIDATE_SECRET_KEY) {
//     return NextResponse.json({ revalidated: false, message: 'Invalid key' }, { status: 401 });
//   }

//   try {
//     // 모든 관련 캐시 무효화
//     revalidateTag('posts');
//     revalidateTag('post-detail');
//     revalidateTag('tags'); // 태그 캐시도 무효화
//     revalidatePath('/', 'page'); // 홈페이지 캐시 무효화
//     revalidatePath('/blog', 'layout');
//     revalidatePath('/blog', 'page'); // 블로그 목록 페이지 캐시 무효화
//     revalidatePath(`/blog/${pageId}`, 'page'); // 특정 블로그 포스트 캐시 무효화

//     return NextResponse.json({
//       revalidated: true,
//       now: new Date(),
//       revalidatePath: `/blog/${pageId}`,
//     });
//   } catch (err) {
//     return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
//   }
// }
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('pageId');

  if (!pageId) {
    return NextResponse.json({ revalidated: false, message: 'Missing pageId' }, { status: 400 });
  }

  try {
    // pageId가 'all'이면 전체 무효화
    if (pageId === 'all') {
      revalidateTag('posts');
      revalidateTag('post-detail');
      revalidateTag('tags');
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'layout');
      revalidatePath('/blog', 'page');

      return NextResponse.json({
        revalidated: true,
        now: new Date(),
        message: '전체 캐시 무효화 완료',
        invalidatedPaths: ['/', '/blog', 'posts', 'tags'],
      });
    } else {
      // 특정 페이지만 무효화
      revalidateTag('posts');
      revalidateTag('post-detail');
      revalidateTag('tags');
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'layout');
      revalidatePath('/blog', 'page');
      revalidatePath(`/blog/${pageId}`, 'page');

      return NextResponse.json({
        revalidated: true,
        now: new Date(),
        revalidatePath: `/blog/${pageId}`,
      });
    }
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { pageId, revalidateKey } = await request.json();

  if (revalidateKey !== process.env.REVALIDATE_SECRET_KEY) {
    return NextResponse.json({ revalidated: false, message: 'Invalid key' }, { status: 401 });
  }

  try {
    // pageId가 'all'이면 전체 무효화
    if (pageId === 'all') {
      revalidateTag('posts');
      revalidateTag('post-detail');
      revalidateTag('tags');
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'layout');
      revalidatePath('/blog', 'page');

      return NextResponse.json({
        revalidated: true,
        now: new Date(),
        message: '전체 캐시 무효화 완료',
        invalidatedPaths: ['/', '/blog', 'posts', 'tags'],
      });
    } else {
      // 특정 페이지만 무효화
      revalidateTag('posts');
      revalidateTag('post-detail');
      revalidateTag('tags');
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'layout');
      revalidatePath('/blog', 'page');
      revalidatePath(`/blog/${pageId}`, 'page');

      return NextResponse.json({
        revalidated: true,
        now: new Date(),
        revalidatePath: `/blog/${pageId}`,
      });
    }
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
