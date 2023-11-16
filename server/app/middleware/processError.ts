import { Context } from 'egg';
import { ResponseData } from 'typings/app';
export default function processError(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err: any) {
      ctx.app.emit('error', err, ctx);
      const status: number = err.status || 500;
      const message: string = err.message || ctx.app.config.messageMap[2];
      const code: number = err.code;
      const errorResponse: ResponseData = {
        code,
        message,
      };
      ctx.status = status;
      ctx.body = errorResponse;
    }
  };
}
