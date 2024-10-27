import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { IEventPopulated } from '@/lib/database/models/event.model';
import { formatDateTime } from '@/lib/utils';
import { DeleteConfirmation } from './DeleteConfirmation';

import type { RecursiveToJSON } from '@/types/utility.types';

type CardProps = {
  event: RecursiveToJSON<IEventPopulated>;
};

const Card = ({ event }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id;

  return (
    <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-md bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className='flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500'
      />

      {isEventCreator && (
        <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-md bg-white p-3 shadow-sm transition-all'>
          <Link href={`/events/${event._id}/update`}>
            <Image
              src='/assets/icons/edit.svg'
              alt='edit'
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation eventId={event._id.toString()} />
        </div>
      )}

      <div className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'>
        <div className='flex gap-2'>
          <span className='p-semibold-14 text-green-60 w-min rounded-md bg-green-100 px-4 py-1'>
            {event.isFree ? 'FREE' : `$${event.price}`}
          </span>
          <p className='p-semibold-14 line-clamp-1 w-min rounded-md bg-grey-500/10 px-4 py-1 text-grey-500'>
            {event.category.name}
          </p>
        </div>

        <p className='p-medium-16 p-medium-18 text-grey-500'>
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
            {event.title}
          </p>
        </Link>

        <div className='flex-between w-full'>
          <p className='p-medium-14 md:p-medium-16 text-grey-600'>
            {event.organizer.firstName} {event.organizer.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
