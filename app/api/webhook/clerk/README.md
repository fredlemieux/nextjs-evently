# Clerk

https://clerk.com

Clerk provide a super easy way to add authentication to your application. There are couple of
things we need to do to get setup.

1. Create a user account and get the environment variables detailed in the
   root [readme](./README.md)

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

Once you have these two keys, your app will have authentication enabled, the problem is when you
log in or create a user, you will not be registering that user in your database. To do this you need
to set up a webhook to post a login or register event to you application.

For the dev environment you'll need to expose your localhost using [ngrok](https://ngrok.com/) as
described in the [docs](https://clerk.com/docs/integrations/webhooks/sync-data)

2. Create a webhook and add the static ngrok URL to your webhook prepended with `/api/webhook/clerk`
3. Subscribe to user events (created deleted etc.) see [clerk/route.ts](./route.ts) for events used
4. Copy signing secret and add it to the [.env.local](/.env.local) file

With clerk setup we can create users and they get saved in the local database, see the createUser
method in the [api/clerk/route](route.ts). But what you end up with is a clerkId (the userId in
Clerk)
but also the id of the userObject in Mongo db. In the createUser method, we then post our (MongoDB)
id to Clerk as the userId, saves as public metadata.

Next what we need to do is add this userId to the session token.

5. Customise the session token to include the following:

```json
{
  "userId": "{{user.public_metadata.userId}}"
}
```
