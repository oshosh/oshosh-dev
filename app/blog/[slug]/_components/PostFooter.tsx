import { Typography } from '@/components/ui/typography';
import { Post } from '@/types/blog';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PostFooterProps {
  previousPost: Post | null;
  nextPost: Post | null;
}

export function PostFooter({ previousPost, nextPost }: PostFooterProps) {
  return (
    <footer className="flex flex-col justify-between gap-4 pb-8 sm:flex-row">
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group bg-tertiary hover:bg-muted flex flex-1 items-center gap-4 rounded-lg p-4 transition-colors"
        >
          <div className="bg-primary/20 text-primary flex shrink-0 items-center justify-center rounded-md p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <Typography variant="xsmall" color="muted">
              이전 포스트
            </Typography>
            <Typography variant="medium" color="tertiaryForeground" className="line-clamp-1 pt-1">
              {previousPost.title}
            </Typography>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group bg-tertiary hover:bg-muted flex flex-1 items-center gap-4 rounded-lg p-4 transition-colors"
        >
          <div className="flex-1 text-right">
            <Typography variant="xsmall" color="muted">
              다음 포스트
            </Typography>
            <Typography variant="medium" color="tertiaryForeground" className="line-clamp-1 pt-1">
              {nextPost.title}
            </Typography>
          </div>
          <div className="bg-primary/20 text-primary flex shrink-0 items-center justify-center rounded-md p-1.5">
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </footer>
  );
}
