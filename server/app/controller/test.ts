import { getElement, validParams } from 'app/utils/util';
import { Controller } from 'egg';
export default class TestController extends Controller {
  async getTestListByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['courseId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const { result, length } = await ctx.service.test.findWithOptions(params);
      ctx.success(0, '接口调用成功', {
        record: result,
        length,
      });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async getTestListByStudent(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['userId', 'courseId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const allTest = (await ctx.service.test.findWithOptions(params)).result;
      const submittedTest = (await ctx.service.test.findWithOptionsByStudent(params)).result;
      const result = allTest.map(i => {
        const item = i;
        const option = getElement(submittedTest, 'testId', item.testId);
        if (option === null) {
          item.taskStatus = -1;
          item.score = undefined;
        } else {
          item.taskStatus = option.taskStatus;
          item.score = option.score;
        }
        delete item.submitNumber;
        return item;
      });
      ctx.success(0, '接口调用成功', { record: result, length: result.length });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async createNewTest(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    await ctx.service.test.addSingle(params);
    ctx.success(0, '接口调用成功');
  }
  async getSingleTest(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result = await ctx.service.test.findSingleByTestId(params);
      ctx.success(0, '接口调用成功', { testInfo: result });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }
  async submitTestByStudent(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['testId', 'userId', 'replyList'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    }
    await ctx.service.test.addSingleByStudent(params);
    ctx.success(0, '接口调用成功');
  }
  async collectTestByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    }
    try {
      params.testStatus = '1';
      const result = await ctx.service.test.updateSingle(params);
      const code = result ? 0 : 1;
      const message = result ? '接口调用成功' : '查无考试信息';
      ctx.success(code, message);
    } catch (e) {
      ctx.throw(500, '服务器错误');
    }
  }
  async getSubmitDataByTeacher(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    } try {
      const { length, result } = await ctx.service.test.findSubmitDataByTeacher(params);
      ctx.success(0, '接口调用成功', { record: result, length });
    } catch (e) {
      ctx.throw(500, '服务器错误');
    }
  }
  async getLicenseForFinish(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    params.status = '0';
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    } try {
      const result = await ctx.service.test.getLicense(params);
      const code = result.length === 0 ? 0 : 1;
      const message = result.length === 0 ? '接口调用成功' : '有未保存的批改';
      const data = result.length === 0 ? { license: true } : { license: false };
      ctx.success(code, message, data);
    } catch (e) {
      ctx.throw(500, '服务器出错');
    }
  }
  async confirmSubmission(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['testId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, '参数错误');
    }
    await ctx.service.test.updateTestStatus(params);
    ctx.success(0, '接口调用成功');
  }

}

