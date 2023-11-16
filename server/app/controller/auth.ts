import { validParams } from 'app/utils/util';
import { Controller } from 'egg';
import { loginParams, ResponseData } from 'typings/app';


export default class AuthController extends Controller {
  // 登录
  async login(): Promise<void> {
    const { ctx, app } = this;
    const params: loginParams = ctx.request.body;
    const isRequireArr = ['userId', 'password'];
    if (!validParams(params as any, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result: boolean = await ctx.service.auth.check(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '账号或密码错误';
      let tokenStr: string | null = app.jwt.sign({
        userId: params.userId,
      }, app.config.jwt.screct, {
        expiresIn: app.config.jwt.expiresIn,
      });
      tokenStr = result ? tokenStr : null;
      ctx.success(code, message, { tokenStr });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  // 刷新用户状态
  async getMessage(): Promise<void> {
    const { ctx, app } = this;
    const { userId } = ctx.tokenData;
    const tokenStr: string = app.jwt.sign({
      userId,
    }, app.config.jwt.screct, {
      expiresIn: app.config.jwt.expiresIn,
    });
    try {
      const result = await ctx.service.user.findSingleWithUserId({ userId });
      delete result.password;
      ctx.success(0, '接口调用成功', { tokenStr, userInfo: result });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

}

