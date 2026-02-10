'use client';

import React from 'react';
import Zoom from 'react-medium-image-zoom';
import Image, { ImageProps } from 'next/image';
import 'react-medium-image-zoom/dist/styles.css';

type ZoomImageProps = Omit<ImageProps, 'alt'> & { alt: string };

export function ZoomImage({ className, alt, ...props }: ZoomImageProps) {
  return (
    <div className="my-6 flex justify-center">
      <Zoom zoomMargin={16}>
        <Image
          alt={alt ?? ''}
          {...props}
          className={[
            'h-auto max-w-full cursor-zoom-in rounded-lg',
            'max-h-[60vh] object-contain',
            'md:max-w-2xl',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </Zoom>
    </div>
  );
}
