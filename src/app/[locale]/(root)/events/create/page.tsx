import EventForm from '@/components/shared/EventForm';
import { getSessionUserId } from '@/lib/actions/user.actions';
import { getTranslations } from 'next-intl/server';

const CreateEvent = async () => {
  const userId = await getSessionUserId();
  const t = await getTranslations('CreateForm');

  if (!userId) {
    return <h1>Error, no userId found</h1>;
  }

  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>
          {t('create')}
        </h3>
      </section>

      <div className='wrapper my-8'>
        <EventForm userId={userId} type='Create'></EventForm>
      </div>
    </>
  );
};

export default CreateEvent;
