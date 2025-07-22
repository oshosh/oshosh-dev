import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('pageId');

  if (!pageId) {
    return NextResponse.json({ revalidated: false, message: 'Missing pageId' }, { status: 400 });
  }

  try {
    // 모든 관련 캐시 무효화
    revalidateTag('posts');
    revalidateTag('post-detail');
    revalidatePath('/', 'page'); // 홈페이지 캐시 무효화
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${pageId}`, 'page');

    return NextResponse.json({
      revalidated: true,
      now: new Date(),
      revalidatePath: `/blog/${pageId}`,
    });
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
    // 모든 관련 캐시 무효화
    revalidateTag('posts');
    revalidateTag('post-detail');
    revalidatePath('/', 'page'); // 홈페이지 캐시 무효화
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${pageId}`, 'page');

    return NextResponse.json({
      revalidated: true,
      now: new Date(),
      revalidatePath: `/blog/${pageId}`,
    });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
