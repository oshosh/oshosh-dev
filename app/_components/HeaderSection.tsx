import { Typography } from '@/components/ui/typography';
import SortSelect from './client/SortSelect';

interface HeaderSectionProps {
  selectedTag: string;
}

export default function HeaderSection({ selectedTag }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="h2" as="h2" color="secondary">
        {selectedTag === '전체' ? '블로그 목록' : `${selectedTag} 관련 글`}
      </Typography>
      <SortSelect />
    </div>
  );
}
