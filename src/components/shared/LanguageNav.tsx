import Image from 'next/image';

import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export const LanguageNav = async () => {
  const locale = await getLocale();

  return (
    <Select>
      <SelectTrigger
        withIcon={false}
        value={locale}
        className='flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-0'
      >
        {locale === 'en' ? (
          <Image
            src='/assets/icons/british.svg'
            width={48}
            height={48}
            className='h-full w-full object-cover'
            alt='British flag'
          />
        ) : (
          <Image
            src='/assets/icons/spanish.svg'
            width={48}
            height={48}
            className='h-full w-full object-cover'
            alt='British flag'
          />
        )}
      </SelectTrigger>
      <SelectContent>
        <Link
          className='flex flex-row items-center gap-1'
          href='/'
          locale={locale === 'en' ? 'es' : 'en'}
        >
          {locale === 'en' ? (
            <>
              <div className='flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-0'>
                <Image
                  src='/assets/icons/spanish.svg'
                  width={48}
                  height={48}
                  className='h-9 w-9'
                  alt='Spanish flag'
                />
              </div>
              <p>Cambiar al español</p>
            </>
          ) : (
            <>
              <div className='flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-0'>
                <Image
                  src='/assets/icons/british.svg'
                  width={48}
                  height={48}
                  className='h-9 w-9'
                  alt='Spanish flag'
                />
              </div>
              <p>Switch to English</p>
            </>
          )}
        </Link>
      </SelectContent>
    </Select>
  );
};

export default LanguageNav;
