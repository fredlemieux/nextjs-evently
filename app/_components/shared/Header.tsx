import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '../ui/button';
import NavItems from './NavItems';
import MobileNav from './MobileNav';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href={'/'} className="flex flex-row">
          <Image
            src={'/assets/images/logo.png'}
            width={48}
            height={48}
            alt="Logo Eventos Rincon"
          />
          <h1 className="h3-bold ml-2">Eventos Rincon</h1>
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems/>
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/"></UserButton>
            <MobileNav/>
          </SignedIn>

          <SignedOut>
            <Button asChild className="rounded-md" size={'lg'}>
              <Link href={'/sign-in'}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
