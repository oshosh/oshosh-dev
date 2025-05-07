import { redirect } from 'next/navigation';

export default function Blog() {
  // 블로그 slug 가 없다면 메인으로 리다이렉트
  redirect('/');
}
