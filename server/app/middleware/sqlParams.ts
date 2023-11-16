import { Context } from 'egg';

export default function processParamsAboutSql(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    // 只针对query参数
    const params = ctx.request.query;
    const { defaultValue } = ctx.app.config;
    params.orderBy = params.orderBy === undefined ? defaultValue.orderBy : params.orderBy;
    params.orderType = params.orderType === undefined ? defaultValue.orderType : params.orderType;
    params.offset = params.offset === undefined ? defaultValue.offset : params.offset;
    params.limit = params.limit === undefined ? defaultValue.limit : params.limit;
    ctx.request.query = params;
    await next();
  };
}
