declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    WEBHOOK_SECRET: string;
    MONGODB_URI: string;
    MONGO_DEBUG?: string;
    UPLOADTHING_TOKEN: string;
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  }
}
