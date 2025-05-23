'use client';

import PhotoCard from '@/components/features/photo/PhotoCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    if (!open) router.back();
  };

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Photo Card Dialog</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-8">
          <PhotoCard id={'1'} modal={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
