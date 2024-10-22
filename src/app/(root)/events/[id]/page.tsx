import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventDetailsData } from '@/lib/actions/event.actions';
import { areDatesTheSame, formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types/parameters.types';
import Image from 'next/image';

const EventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const eventDetailsData = await getEventDetailsData(id, searchParams);

  const { event, relatedEvents } = eventDetailsData;

  return (
    <>
      <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt='hero image'
              width={1000}
              height={1000}
              className='h-full min-h-[300px] object-cover object-center'
            />
          )}

          <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
            <div className='flex flex-col gap-6'>
              <h2 className='h2-bold'>{event.title}</h2>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <p className='p-bold-20 rounded-md bg-green-500/10 px-5 py-2 text-green-700'>
                    {event.isFree ? 'FREE' : `€${event.price}`}
                  </p>
                  <p className='p-medium-16 whitespace-nowrap rounded-md bg-grey-500/10 px-4 py-2.5 text-grey-500'>
                    {event.category.name}
                  </p>
                </div>

                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                  by{' '}
                  <span className='text-primary-500'>
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='flex gap-2 md:gap-3'>
                <Image
                  src='/assets/icons/calendar.svg'
                  alt='calendar'
                  width={32}
                  height={32}
                />
                <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center'>
                  {areDatesTheSame(event.startDateTime, event.endDateTime) ? (
                    <p>
                      {formatDateTime(event.startDateTime).dateOnly} -{' '}
                      {formatDateTime(event.startDateTime).timeOnly} to{' '}
                      {formatDateTime(event.endDateTime).timeOnly}
                    </p>
                  ) : (
                    <p>
                      {formatDateTime(event.startDateTime).dateOnly} -{' '}
                      {formatDateTime(event.startDateTime).timeOnly} to
                      <br />
                      {formatDateTime(event.endDateTime).dateOnly} -{' '}
                      {formatDateTime(event.endDateTime).timeOnly}
                    </p>
                  )}
                </div>
              </div>

              <a
                target='_blank'
                href={event.location.url}
                className='p-regular-20 flex items-center gap-3'
              >
                <Image
                  src='/assets/icons/location.svg'
                  alt='location'
                  width={32}
                  height={32}
                />
                <p className='p-medium-16 lg:p-regular-20'>
                  {event.location.name}
                </p>
              </a>
              {event.url && (
                <a
                  target='_blank'
                  href={event.url}
                  className='p-regular-20 flex items-center gap-3'
                >
                  <Image
                    src='/assets/icons/link-coloured.svg'
                    alt='location'
                    width={32}
                    height={32}
                  />
                  <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>
                    {event.url}
                  </p>
                </a>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600'>Details:</p>
              <p className='p-medium-16 lg:p-regular-18 whitespace-pre-wrap'>
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
        <h2 className='h2-bold'>Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle='No Events Found'
          emptyStateSubtext='Come back later'
          collectionType='All_Events'
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;
