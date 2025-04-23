'use client';
import Image from 'next/image';

export function ProfileImage() {
  return (
    <Image
      priority
      src="/images/unnamed.jpg"
      alt="OSH"
      width={144}
      height={144}
      className="object-cover"
    />
  );
}
