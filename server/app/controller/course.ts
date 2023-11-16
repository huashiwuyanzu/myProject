import { validParams } from 'app/utils/util';
import fs from 'fs';
import { Controller } from 'egg';
const keyArrInCourse = ['id', 'courseId', 'courseName', 'invitationCode', 'courseIntroduction', 'userId', 'startYear', 'endYear', 'coursePicture'];

export default class CourseController extends Controller {
  async getCourseList(): Promise<void> {
    // 学生或老师获取课程数据
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['userId', 'roleType'];
    const validValues = [
      { keyName: 'roleType', values: ['1', '2'] },
    ];
    if (!validParams(params as any, isRequireArr, validValues)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      if (params.roleType === '2') {
        const { result, length } = await ctx.service.course.findWithOptions(params);
        ctx.success(0, '接口调用成功', { record: result, length });
      } else if (params.roleType === '1') {
        const { result, length } = await ctx.service.course.findWithOptionsByStudent(params);
        ctx.success(0, '接口调用成功', { record: result, length });
      }
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async getCourseListByAdmin(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    try {
      const { result, length } = await ctx.service.course.findWithOptions(params);
      ctx.success(0, '接口调用成功', { record: result, length });
    } catch {
      ctx.throw(500, '服务器错误');
    }
  }

  async updateSingleCourse(): Promise<void> {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const isRequireArr = ['courseId'];
    if (!validParams(params, isRequireArr, undefined, keyArrInCourse)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result: boolean = await ctx.service.course.updateSingle(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '课程不存在';
      ctx.success(code, message);
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async addSingleCourse(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['courseName', 'courseIntroduction', 'userId', 'startYear', 'endYear'];
    if (!validParams(params, isRequireArr, undefined, keyArrInCourse)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      await ctx.service.course.addSingle(params);
      ctx.success(0, '接口调用成功');
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async deleteSingleCourse(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['courseId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result = await ctx.service.course.deleteSingle(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '该课程不存在';
      ctx.success(code, message);
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async updateCoursePicture(): Promise<void> {
    const { ctx } = this;
    if (ctx.request.body.courseId === undefined) {
      ctx.throw(422, '参数错误');
    }
    const fileData = ctx.request.files[0];
    const courseId = ctx.request.body.courseId;
    const newPath = `app/public/coursePicture/${courseId}.jpg`;
    const oldPath = (await ctx.service.course.findSingleByCourseId({ courseId })).coursePicture;
    if (oldPath === 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png') {
      const newCoursePicture = `http://127.0.0.1:7001/public/coursePicture/${courseId}.jpg`;
      await ctx.service.course.updateSingle({ coursePicture: newCoursePicture, courseId });
    } else {
      // eslint-disable-next-line node/prefer-promises/fs
      fs.unlink(newPath, err => {
        if (err) throw err;
      });
    }
    // eslint-disable-next-line node/prefer-promises/fs
    fs.writeFile(newPath, '', err => {
      if (err) throw err;
    });
    const readStream = fs.createReadStream(fileData.filepath);
    const writeFile = fs.createWriteStream(newPath);
    readStream.pipe(writeFile);
    ctx.success(0, '接口调用成功');
  }

  async getSingle(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.query;
    const isRequireArr = ['courseId'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    } try {
      const result = await ctx.service.course.getSingleByCourseId(params);
      delete result.invitationCode;
      const responseData = params.userId === undefined ? result : { courseInfo: result.courseInfo, beJoin: result.beJoin };
      ctx.success(0, '接口调用成功', responseData);
    } catch (e) {
      ctx.throw(500, '服务器错误');
    }
  }

  async joinCourse(): Promise<void> {
    const { ctx } = this;
    const params = ctx.request.body;
    const isRequireArr = ['courseId', 'userId', 'invitationCode'];
    if (!validParams(params, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    } try {
      const result = await ctx.service.course.checkInvitationCode(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '邀请码错误';
      ctx.success(code, message);
    } catch (e) {
      ctx.throw(500, '服务器错误');
    }
  }


}

