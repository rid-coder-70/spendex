export {};

declare global {
  namespace Express {
    interface Request {
      user?: import('./index').User;
    }
  }
}