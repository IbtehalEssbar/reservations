'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const hideButtons = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  return (
    <header className="flex justify-between items-center p-4 h-16">

      <div className="flex items-center gap-2">
        {!hideButtons && (
          // <SignedOut>
          <Show when="signed-out">
            <Link href="/sign-in">
              <button className="bg-transparent text-[#6c47ff] rounded-full font-medium text-sm h-10 px-4 border border-[#6c47ff] cursor-pointer">
                Se connecter
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                Créer un compte
              </button>
            </Link>
            </Show>
          // </SignedOut>
        )}

        <Show when="signed-in">
          <UserButton />
          </Show>
        {/* </SignedIn> */}
      </div>
    </header>
  );
}