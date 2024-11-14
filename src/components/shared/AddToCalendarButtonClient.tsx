'use client';
// AddToCalendarButton has to be rendered on the client

import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { formatDateTime } from '@/lib/utils';

import type { ToJSON } from '@/types/utility.types';
import type { IEventPopulated } from '@/lib/database/models';

interface Props {
  event: ToJSON<IEventPopulated>;
}

const AddToCalendarButtonClient = ({ event }: Props) => {
  const start = formatDateTime(event.startDateTime);
  const end = formatDateTime(event.endDateTime);

  return (
    <AddToCalendarButton
      name={event.title}
      description={event.description}
      startDate={start.dateIso}
      startTime={start.timeOnly}
      endDate={end.dateIso}
      endTime={end.timeOnly}
      location={`${event.location.name}, ${event.location.address}`}
      options="['Google','Apple','iCal','Microsoft365','Outlook.com','Yahoo']"
      timeZone='Europe/Madrid'
      iCalFileName={event.title}
    />
  );
};

export default AddToCalendarButtonClient;
