import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Nav from './Nav';
import NavTitle from '../features/common/NavTitle';

export default function Header() {
  return (
    <header className="bg-background border-inverse-background text-primary-text sticky top-0 z-50 border-b-2">
      <div className="container flex h-[var(--header-height)] items-center px-4">
        <div className="flex w-full items-center justify-between">
          <NavTitle />

          <div className="flex items-center justify-end gap-4">
            <Nav />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
