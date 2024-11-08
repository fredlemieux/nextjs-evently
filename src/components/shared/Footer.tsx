import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row'>
        <Link href={'/'} className='flex flex-row'>
          <Image
            src={'/assets/images/logo.png'}
            width={48}
            height={48} // TODO! required height and width
            className='h-10 w-10'
            alt='Logo Eventos Rincon'
          />
          <h1 className='h3-bold ml-2'>Eventos Rincon</h1>
        </Link>

        <p>2023 Eventos Rincon. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
