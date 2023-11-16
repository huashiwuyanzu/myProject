import { validParams } from 'app/utils/util';
import { Controller } from 'egg';
export default class TopicController extends Controller {
  async getTopicList(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    } try {
      let result = await ctx.service.topic.findWithOption(params);
      if (params.delete !== '1') {
        result = result.map(item => {
          const option = item;
          delete option.answer;
          return option;
        });
      }
      ctx.success(0, '接口调用成功', { record: result });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async getTopicListByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['testId', 'userId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    } try {
      const { result, length } = await ctx.service.topic.findWithOptionByTeacher(params);
      ctx.success(0, 'ok', {
        record: result,
        length,
      });
    } catch (e) {
      ctx.throw(500, '服务器错误');
    }
  }

  async saveEditByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['testId', 'pointList'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    }
    await ctx.service.topic.updatePointPageByTeacher(params);
    ctx.success(0, '接口调用成功');
  }


}

