import { Context } from 'egg';
export default function throwTokenErr(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    if (ctx.tokenData === null) {
      ctx.throw(403, 'invialed token');
    }
    await next();
  };
}
