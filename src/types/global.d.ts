// import or exports. That would turn the file into a module and disconnect it from the
// global type declaration namespace. TODO! Why is this required.
export {};

declare global {
  interface CustomJwtSessionClaims {
    userId?: string;
  }
}
