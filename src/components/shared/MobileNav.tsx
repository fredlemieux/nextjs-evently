import Image from 'next/image';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NavItems from './NavItems';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@clerk/nextjs';

const MobileNav = () => {
  return (
    <nav className='md:hidden'>
      <Sheet>
        <SheetTrigger className='align-middle'>
          <MenuIcon />
        </SheetTrigger>

        <SheetContent className='flex flex-col gap-6 bg-white md:hidden'>
          <div className='flex flex-row items-center'>
            <Image
              src={'/assets/images/logo.png'}
              width={48}
              height={48} // TODO! required height and width
              className='h-10 w-10'
              alt='Logo Eventos Rincon'
            />
            <h1 className='h3-bold ml-2'>Menu</h1>
          </div>

          <Separator className='border border-gray-50'></Separator>

          <div className='flex flex-1 flex-col justify-between'>
            <NavItems />
            <SignOutButton>
              <Button />
            </SignOutButton>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
