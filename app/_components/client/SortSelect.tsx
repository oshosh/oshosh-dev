'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || 'latest';

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);

    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={sort} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 방식 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">
          <Typography variant="small">최신순</Typography>
        </SelectItem>
        <SelectItem value="oldest">
          <Typography variant="small">오래된순</Typography>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
