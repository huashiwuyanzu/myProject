import { validParams } from 'app/utils/util';
import { Controller } from 'egg';
export default class DoubtController extends Controller {
  async submitByStudent(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['userId', 'testId', 'topicId', 'question'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      await ctx.service.doubt.submitSingleByStudent(params);
      ctx.success(0, '接口调用成功');
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async replyToAll(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['userId', 'testId', 'topicId', 'reply'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    } try {
      await ctx.service.doubt.submitSingleByTeacher(params);
      ctx.success(0, '接口调用成功');
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async getDoubtList(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['topicId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    } try {
      const { result, length } = await ctx.service.doubt.getList(params);
      ctx.success(0, '接口调用成功', { length, record: result });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async replyByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    params.taskStatus = '1';
    const isRequireArr = ['doubtId', 'reply'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    } try {
      await ctx.service.doubt.updateSingle(params);
      ctx.success(0, '接口调用成功');
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }


}

