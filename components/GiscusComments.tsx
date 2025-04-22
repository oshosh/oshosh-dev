'use client';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
export default function GiscusComments() {
  const { theme } = useTheme();
  return (
    <Giscus
      repo="oshosh/sadf"
      repoId="R_kgDOOabmcw"
      category="Announcements"
      categoryId="DIC_kwDOOabmc84CpL9R"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="ko"
    />
  );
}
