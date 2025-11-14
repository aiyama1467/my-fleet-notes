import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10">
      <div className="flex justify-between h-16 px-4">
        <div className="flex gap-3 items-center">
          <Link href="/">
            <span className="text-sm font-semibold tracking-wide">
              My Fleet Notes
            </span>
          </Link>
          <nav className="text-sm text-white/80">
            <Link className="hover:text-white" href="/fleets">
              Fleets
            </Link>
          </nav>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-[200px] max-w-xs sm:block">
            <form action="#" className="w-full">
              <Input aria-label="Search" placeholder="Search..." />
            </form>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/fleets">New Fleet</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
