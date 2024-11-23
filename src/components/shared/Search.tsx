'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { Input } from '../ui/input';

const Search = ({
  placeholder = 'Search title...',
}: {
  placeholder?: string;
}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query'],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <Input
      type='text'
      placeholder={placeholder}
      onChange={(e) => setQuery(e.target.value)}
      className='input-field'
      icon={<SearchIcon className='h-6 w-6 stroke-gray-500' />}
    />
  );
};

export default Search;
