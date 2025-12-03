import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navItems = [
  { href: '/fleets', label: 'Fleets' },
  { href: '/tasks', label: 'Tasks' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border">
      <div className="flex justify-between h-16 px-4">
        <div className="flex gap-8 items-center">
          <Link href="/">
            <span className="font-semibold tracking-wide">My Fleet Notes</span>
          </Link>
          <nav className="flex text-xs gap-2 items-center">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-[200px] max-w-xs sm:block">
            <form action="#" className="w-full">
              <Input aria-label="Search" placeholder="Search..." />
            </form>
          </div>
          <Button asChild size="sm">
            <Link href="/fleets">New Fleet</Link>
          </Button>
          <SignOutButton>
            <Button size="sm" variant="outline">
              ログアウト
            </Button>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
