import { Context } from 'egg';
export default function checkToken(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.request.header.authorization;
    try {
      const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      ctx.tokenData = decode;
    } catch (e: any) {
      ctx.tokenData = null;
    } finally {
      await next();
    }
  };
}
