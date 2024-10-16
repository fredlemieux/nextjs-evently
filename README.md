# EventosRincon - Events listing for the humble sea side pueblo of Rincon de la Victoria

Forked from [NextJS Evently](https://github.com/Muhammad-Sabir/nextjs-evently), a very special
thanks to [Muhammad-Sabir](https://github.com/Muhammad-Sabir) for generously sharing this repo.❤️

## Introduction

Welcome to Evently, an event management website developed using Next.js. This application allows
users to discover, explore, and manage events seamlessly. You can access the live deployment of
Evently at [https://nextjs-evently-sabir.vercel.app/](https://nextjs-evently-sabir.vercel.app/).

## Features

- **Event Discovery:** Browse through a wide range of events by searching and filtering.
- **User Authentication:** Create an account or log in to access personalized features.
- **Event Details:** View detailed information about each event, including date, time, location, and
  description.
- **Event Registration:** Register for events you're interested in attending.
- **Create Your Own Event:** Host and manage your events on Evently.
- **Attendee Tracking:** Monitor the list of attendees for your events.
- **Payment Management:** Keep track of the money paid by attendees for your events.

## Technologies Used

- **Next.js:** A React framework for building server-side rendered and static web applications.
- **Vercel:** Hosting platform for serverless deployment of web applications.
- **Clerk:** Clerk provides a set of hooks and helpers that you can use to access the active
  session and user data in the application.
- **MongoDB:** NoSQL database for data storage
- **Docker:** For the development environment, but feel free to just run the app locally too

## TODOS

- [ ] Setup Multi Stage build for Docker
- [ ] Clean up dev environment (clear db and users)
- [ ] Highlight active Form item
- [ ] Set up Image Upload
- [ ] Google maps API for location
- [ ] Map out app architecture
- [ ] Testing setup
- [ ] Github actions for tests
- [ ] Plan next steps

## Project Structure

- [/app](/app) is where all application folders are stored all "\_" private prefixed folders are
  non-route
  - [/\_components](/app/_components) app-wide reusable components are stored here
  - [/\_contants](/app/_constants) app-wide constants are stored here
  - [/\_lib](/app/_lib)
  - [/\_types](/app/_types) app-wide types are stored here
  - [(auth)](</app/(auth)>) auth routes
  - [(root)](</app/(root)>) UI routes
  - [api](/app/api) api routes (no pages) -[moddleware.ts](/src/middleware.tse.ts) todo! read clerk docs

### Authentication

The app is authenticated using [Clerk](https://clerk.com) please refer to the clear webhook
[README.md](./app/api/webhook/clerk/README.md).

### File Upload

Pictures are uploaded using [UploadThing](https://uploadthing.com/) please refer to the /uploadthing
api route [README.md]()

## Getting Started

To run Evently locally, follow these steps:

### First Time

1. Clone the repository:

```bash
git clone https://github.com/Muhammad-Sabir/nextjs-evently.git
```

2. Navigate to the project directory:

```
cd nextjs-evently
```

3. Install dependencies:

```
npm install
```

4. Copy [.env.template](/.env.template) as `.env.local`
5. Setup [Clerk](clerk.com/) account, and add keys to `.env.local` file

### Start Development

6. Run the development server:

```
docker compose up
```

5. Open your browser and go to http://localhost:3000

## Hosting

The easiest way to host is to use [Varcel](https://vercel.com/)
and [MongoDB Atlas](https://cloud.mongodb.com):

- Create a DB in Atlas
- Ensure you have connections from anywhere enabled!!! TODO! Lock this down
- Create an account
- Import the github project
- Use all default builds
- Make sure you assign all ENV VARS!

## Troublehoot

501 Timeout from Varcel, I got this error due to not enabling connections from anywhere for the
database. The logs wheren't very helpful, TODO! learn about how to debug using Varcel Logs?!
