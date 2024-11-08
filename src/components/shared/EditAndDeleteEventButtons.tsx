import React from 'react';
import Link from 'next/link';
import { DeleteConfirmation } from '@/components/shared/DeleteConfirmation';
import { PencilIcon } from 'lucide-react';

interface EditAndDeleteEventButtonsProps {
  eventId: string;
}

const EditAndDeleteEventButtons = ({
  eventId,
}: EditAndDeleteEventButtonsProps) => {
  return (
    <div className='flex flex-row gap-1'>
      <Link href={`/events/${eventId}/update`}>
        <PencilIcon className='stroke-purple h-5 w-5' />
      </Link>

      <DeleteConfirmation eventId={eventId} />
    </div>
  );
};

export default EditAndDeleteEventButtons;
