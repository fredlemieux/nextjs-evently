import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import NavItems from './NavItems';
import MobileNav from './MobileNav';
import LanguageNav from '@/components/shared/LanguageNav';
import { useTranslations } from 'next-intl';

const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href={'/'} className='flex flex-row items-center'>
          <Image
            src={'/assets/images/logo.png'}
            width={48}
            height={48} // TODO! required height and width
            className='h-10 w-10'
            alt='Logo Eventos Rincon'
          />
          <h1 className='h3-bold ml-2'>Eventos Rincon</h1>
        </Link>

        <SignedIn>
          <nav className='md:flex-between hidden w-full max-w-xs'>
            <NavItems />
          </nav>
        </SignedIn>

        <div className='flex items-center justify-end gap-3'>
          <LanguageNav />
          <SignedIn>
            <div className='flex-center hidden items-center md:flex'>
              <UserButton />
            </div>
            <MobileNav />
          </SignedIn>

          <SignedOut>
            <Button asChild className='rounded-md' size={'lg'}>
              <Link href={'/sign-in'}>{t('login')}</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
