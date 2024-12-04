import * as z from 'zod';

export const eventFormSchema = z
  .object({
    name: z.string().min(3, 'Event name must be at least 3 characters'),
    description: z
      .string()
      .min(3, 'Description must be at least 3 characters')
      .max(1500, 'Description must be less than 1500 characters'),
    location: z
      .string()
      .min(3, 'Location must be at least 3 characters')
      .max(400, 'Location must be less than 400 characters'),
    imageUrl: z.string(),
    startDateTime: z
      .date()
      .refine((startDateTime) => startDateTime > new Date(), {
        message: 'Start of event cannot be in the past',
      }),
    endDateTime: z.date(),
    categoryId: z.string().min(1, 'Please select a category'),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url().or(z.string().max(0)),
  })
  .refine((data) => data.endDateTime > data.startDateTime, {
    message: "End cannot before the start! It's impossible.",
    path: ['endDateTime'],
  });
