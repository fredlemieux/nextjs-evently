import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getEventsByUser } from '@/lib/actions/event.actions';
import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import type { SearchParamProps } from '@/types/parameters.types';

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
          <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
          <Button asChild size='lg' className='button hidden sm:flex'>
            <Link href='/events/create'>Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className='wrapper my-8'>
        <Collection
          data={organizedEvents?.data}
          emptyTitle='No events have been created yet'
          emptyStateSubtext='Go create some now'
          collectionType='Events_Organized'
          limit={3}
          page={eventsPage}
          urlParamName='eventsPage'
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
