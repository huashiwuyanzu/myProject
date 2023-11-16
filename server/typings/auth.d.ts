import 'egg';
declare module 'egg' {
  interface loginParams {
    userId: string,
    password: string,
  }
}
