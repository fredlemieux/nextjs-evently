'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerLinks } from '@/constants';
import { useTranslations } from 'next-intl';

const NavItems = () => {
  const pathName = usePathname();
  const t = useTranslations('Header');

  return (
    <ul className='md:flex-between item-start flex w-full flex-col gap-5 px-2 md:flex-row'>
      {headerLinks.map((link) => {
        const isActive = pathName == link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && 'text-primary-500'
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{t(link.t)}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
