declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    WEBHOOK_SECRET: string;
    MONGODB_URI: string;
    UPLOADTHING_TOKEN: string;
    UPLOADTHING_SECRET: string;
    UPLOADTHING_APP_ID: string;
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  }
}
