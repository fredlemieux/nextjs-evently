'use client';

import React from 'react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import type { ToJSON } from '@/types/utility.types';
import type { IEventPopulated } from '@/lib/database/models';
import { formatDateTime } from '@/lib/utils';

interface Props {
  event: ToJSON<IEventPopulated>;
}

const AddToCalendarButtonClient = ({ event }: Props) => {
  const startDate = formatDateTime(event.startDateTime).dateOnly;
  const endDate = formatDateTime(event.endDateTime).dateOnly;
  // return (
  //   <AddToCalendarButton
  //     name={event.title}
  //     startDate={formatDateTime(event.startDateTime).dateOnly}
  //     startTime={formatDateTime(event.startDateTime).timeOnly}
  //     endDate={formatDateTime(event.endDateTime).dateOnly}
  //     endTime={formatDateTime(event.endDateTime).timeOnly}
  //     timeZone={'Europe/Madrid'}
  //     location={`${event.location.name} ${event.location.address}`}
  //     options={['Apple', 'Google', 'Microsoft365', 'Yahoo', 'iCal']}
  //   />
  // );
  return (
    <AddToCalendarButton
      name={event.title}
      description={event.description}
      startDate='2022-02-21'
      endDate='2022-03-24'
      startTime='10:13'
      endTime='17:57'
      location='Somewhere over the rainbow'
      options="['Apple','Google','iCal','Microsoft365','Outlook.com','Yahoo']"
      timeZone='Europe/Berlin'
      // trigger='click'
      // inline
      iCalFileName='Reminder-Event'
    />
  );
};

export default AddToCalendarButtonClient;
