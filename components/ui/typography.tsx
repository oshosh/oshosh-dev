import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      inlineCode: 'rounded bg-muted px-1.5 py-1 font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      medium: 'text-base font-semibold',
      small: 'text-sm font-medium leading-none ',
      muted: 'text-sm text-muted-foreground',
    },
    color: {
      default: 'text-primary-text',
      secondary: 'text-primary-text-secondary',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'large',
    color: 'default',
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export function Typography({
  className,
  variant,
  color,
  as: Comp = 'span',
  ...props
}: TypographyProps) {
  return <Comp className={cn(typographyVariants({ variant, color }), className)} {...props} />;
}
