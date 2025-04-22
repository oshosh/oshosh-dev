import { Typography } from '@/components/ui/typography';
import Link from 'next/link';

const NavTitle = () => {
  return (
    <Link href="/" className="text-xl font-semibold">
      <Typography color="secondary">sehyun.</Typography>
      <Typography>dev</Typography>
    </Link>
  );
};

export default NavTitle;
