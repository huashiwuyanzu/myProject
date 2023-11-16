import { Controller } from 'egg';
import fs from 'fs';
import { validParams } from 'app/utils/util';
import stringRandom from 'string-random';
import bcrypt from 'bcryptjs';

const keyArr = ['id', 'userId', 'userName', 'password', 'roleType', 'userPicture'];
interface Params {
  id?: string,
  userId?: string,
  userName?: string,
  password?: string,
  roleType?: string,
  userPicture?: string,
  orderBy?: string,
  orderType?: string,
  limit?: number,
  offset?: number,
}

export default class UserController extends Controller {
  async register(): Promise<void> {
    const { ctx } = this;
    const params: Params = ctx.request.body;
    const isRequireArr = ['userId', 'userName', 'roleType'];
    const validValues = [
      { keyName: 'roleType', values: ['1', '2', '3'] },
    ];
    if (!validParams(params as any, isRequireArr, validValues)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      await ctx.service.user.addSingle(params);
      ctx.success(0, '接口调用成功');
    } catch (e: any) {
      ctx.success(-1, '该用户Id已被使用');
    }
  }

  async getSingleUser(): Promise<void> {
    const { ctx } = this;
    const params: Params = ctx.request.query;
    const isRequireArr = ['userId'];
    if (!validParams(params as any, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result = await ctx.service.user.findSingleWithUserId(params);
      ctx.success(0, '接口调用成功', {
        userInfo: result,
      });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async getUserList(): Promise<void> {
    const { ctx } = this;
    const params: Params = ctx.request.query;
    try {
      const { result, length } = await ctx.service.user.findWithOptions(params);
      ctx.success(0, '接口调用成功', {
        record: result,
        length,
      });
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async deleteSingleUser(): Promise<void> {
    const { ctx } = this;
    const params: Params = ctx.request.query;
    const isRequireArr = ['userId'];
    if (!validParams(params as any, isRequireArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result: boolean = await ctx.service.user.deleteSingle(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '用户不存在';
      ctx.success(code, message);
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async updateSingleUser(): Promise<void> {
    const { ctx } = this;
    const params: Params = ctx.request.body;
    const isRequireArr = ['userId'];
    const validValues = [
      { keyName: 'roleType', values: ['1', '2', '3'] },
    ];
    if (!validParams(params as any, isRequireArr, validValues, keyArr)) {
      ctx.throw(422, ctx.helper.requestError[422]);
    }
    try {
      const result: boolean = await ctx.service.user.updateSingle(params);
      const code = result ? 0 : -1;
      const message = result ? '接口调用成功' : '用户不存在';
      ctx.success(code, message);
    } catch (e: any) {
      ctx.throw(500, '服务器错误');
    }
  }

  async updateUserPicture(): Promise<void> {
    const { ctx } = this;
    const userId = ctx.tokenData.userId;
    const fileData = ctx.request.files[0];
    const newPath = `app/public/userPicture/${userId}.jpg`;
    const oldPath = (await ctx.service.user.findSingleWithUserId({ userId })).userPicture;
    if (oldPath === 'https://xsgames.co/randomusers/avatar.php?g=pixel') {
      const newUserPicture = `http://127.0.0.1:7001/public/userPicture/${userId}.jpg`;
      await ctx.service.user.updateSingle({ userPicture: newUserPicture, userId });
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
    ctx.body = {
      code: 0,
      message: '接口调用成功',
    };
  }


  async addPageToMysq2l(): Promise<void> {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    try {
      const teacherId = stringRandom(); // 教师Id
      const password = bcrypt.hashSync('123asdASD', 10); // 统一的密码
      // 插入1个老师
      await conn.insert('user', { userName: '刘海', userId: teacherId, password, roleType: '2' });
      // 为老师开设一门课程
      const courseId = stringRandom();
      const courseName = '数据库可视化';
      const invitationCode = stringRandom();
      const courseIntroduction = '需要提交两份实验 第一份在第十周提交  第二份在十六周前  第一份老师打分  第二份小组互评。';
      const startYear = '1622427218359';
      const endYear = '1622427218359';
      const coursePicture = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png';
      await conn.insert('course', { courseId, courseName, invitationCode, courseIntroduction, userId: teacherId, startYear, endYear, coursePicture });
      // 插入50个学生 并让他们选透明小伞老师的课
      for (let i = 0; i < 50; ++i) {
        const studentId = stringRandom();
        await conn.insert('user', { userName: `学生${i + 1}号`, userId: studentId, password, roleType: '1' });
        await conn.insert('course_student', { courseId, userId: studentId });
      }
      await conn.commit();
      ctx.success(0, 'ok');
    } catch (e) {
      await conn.rollback();
      ctx.throw(500);
    }
  }
  async addPageToMysql11(): Promise<void> {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    try {
      const teacherId = '83F0yuv6'; // 透明小伞老师的Id
      const courseId = 'zmJHlcof'; // 透明小伞老师的课程的Id
      const studentList = await conn.select('course_student', { where: { courseId } }); // 里面有每个学生的userId
      // 为透明小伞老师的编译原理项目课开设一门考试
      const testId = stringRandom();
      const totalScore = 100;
      const startTime = '1622427218359';
      const endTime = '1622427218359';
      const testName = '数据库可视化第一次项目';
      await conn.insert('test', { testId, totalScore, courseId, startTime, endTime, testName });
      // 为透明小伞老师的这门考试加入10道题试题，总分为100
      for (let j = 0; j < 2; ++j) {
        for (let i = 1; i < 6; ++i) {
          const topicId = stringRandom();
          const topicType: string = i.toString();
          const score = 10;
          let topicText;
          let answer;
          let options;
          if (i === 1) {
            topicText = '这门课是不是很容易';
            answer = '正确';
            options = '_';
          } else if (i === 2) {
            topicText = '我帅不帅';
            answer = '帅';
            options = '帅,不帅,一般';
          } else if (i === 3) {
            topicText = '外键的定义条件是什么';
            answer = '条件1,条件2';
            options = '条件1,条件2,条件3,条件4';
          } else if (i === 4) {
            topicText = '你?数据库实验可视化这门课';
            answer = '喜欢';
            options = '_';
          } else if (i === 5) {
            topicText = '做完实验你的心得体会是什么';
            answer = '_';
            options = '_';
          }
          await conn.insert('topic', { topicId, testId, topicType, score, topicText, answer, options });
        }
      }
      await conn.commit();
      ctx.success(0, 'ok');


      // 为这些透明小伞老师的题目模拟答题 客观题有50%的几率答对 主观题的得分是随机的
    } catch (e) {
      await conn.rollback();
      ctx.throw(500);
    }
  }
  async addPageToMysql(): Promise<void> {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    try {
      const teacherId = '71FY2TKr'; // 透明小伞老师的Id
      const courseId = 'zmJHlcof'; // 透明小伞老师的课程的Id
      const testId = 'qoVbTvQp'; // 透明小伞老师的新考试
      const studentList = await conn.select('course_student', { where: { courseId } }); // 里面有每个学生的userId
      const topicList = await conn.select('topic', { where: { testId } });
      for (let i = 0; i < studentList.length; ++i) {
        let totalScore = 0;
        const studentItem = studentList[i];
        for (let j = 0; j < topicList.length; ++j) {
          const probability: number = Math.ceil(Math.random() * 10);
          const topicItem = topicList[j];
          let addNum = 0;
          if (topicItem.topicType === '5') {
            await conn.insert('topic_student', { userId: studentItem.userId, topicId: topicItem.topicId, reply: '这是给小伞老师的答复。', testId, point: probability, status: '1' });
            totalScore += probability;
          } else {
            let reply;
            let point;
            if (probability > 5) {
              reply = topicItem.answer;
              point = 10;
              addNum = 1;
              totalScore += 10;
            } else {
              reply = '错误答案';
              point = 0;
            }
            await conn.update('topic', { submitNumber: topicItem.submitNumber + 1, correctNumber: topicItem.correctNumber + addNum }, { where: { topicId: topicItem.topicId } });
            await conn.insert('topic_student', { userId: studentItem.userId, topicId: topicItem.topicId, reply, testId, point, status: '1' });
          }
        }
        await conn.insert('test_student', { userId: studentItem.userId, testId, score: totalScore, taskStatus: '1' });
      }
      await conn.commit();
      ctx.success(0, 'ok');


      // 为这些透明小伞老师的题目模拟答题 客观题有50%的几率答对 主观题的得分是随机的
    } catch (e) {
      await conn.rollback();
      ctx.throw(500);
    }
  }
}

