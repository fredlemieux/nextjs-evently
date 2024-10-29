import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteConfirmation } from '@/components/shared/DeleteConfirmation';

interface EditAndDeleteEventButtonsProps {
  eventId: string;
}

const EditAndDeleteEventButtons = ({
  eventId,
}: EditAndDeleteEventButtonsProps) => {
  return (
    <>
      <Link href={`/events/${eventId}/update`}>
        <Image src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
      </Link>

      <DeleteConfirmation eventId={eventId} />
    </>
  );
};

export default EditAndDeleteEventButtons;
