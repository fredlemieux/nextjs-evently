declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    MONGODB_URI: string;
  }

  // export interface Global {
  //   mongoose: {
  //     conn: null | Mongoose,
  //     promise: Promise<Mongoose>
  //   };
  // }
}
