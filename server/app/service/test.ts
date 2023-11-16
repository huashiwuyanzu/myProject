import { Service } from 'egg';
import { fixSqlStr, filterSomeKey } from 'app/utils/util';
import stringRandom from 'string-random';
const keyArray = [
  'id',
  'testId',
  'testName',
  'courseId',
  'totalScore',
  'startTime',
  'endTime',
  'submitNumber',
  'testStatus',
];


export default class TestService extends Service {
  async findWithOptions(data): Promise<any> {
    const sqlStr = 'select testId,testName,test.courseId,totalScore,startTime,endTime,submitNumber,testStatus from test left join course on test.courseId=course.courseId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, keyArray, 'test');
    const result = await this.app.mysql.query(validSqlStr, values);
    const length = result.length;
    return { result, length };
  }

  async findWithOptionsByStudent(data): Promise<any> {
    const sqlStr = 'select * from test_student where userId=?';
    const result = await this.app.mysql.query(sqlStr, data.userId);
    return { result };
  }

  async addSingle(data): Promise<boolean> {
    const { testInfo, topicList } = data;
    const testId = stringRandom();
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.insert('test', { ...testInfo, testId });
      for (let i = 0; i < topicList.length; ++i) {
        const item = topicList[i];
        const topicId = stringRandom();
        await conn.insert('topic', { ...item, testId, topicId });
      }
      await conn.commit();
      return true;
    } catch (e) {
      await conn.rollback();
      this.ctx.throw(500, '服务端出错');
    }
  }

  async findSingleByTestId(data): Promise<any> {
    const sqlStr = 'select * from test where testId=?';
    const result = await this.app.mysql.query(sqlStr, data.testId);
    return result[0];
  }

  async addSingleByStudent(data): Promise<boolean> {
    const { userId, testId, replyList } = data;
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.insert('test_student', { testId, userId });
      const submitNumber = (await conn.get('test', { testId })).submitNumber + 1;
      await conn.update('test', { submitNumber }, { where: { testId } });
      for (let i = 0; i < replyList.length; ++i) {
        const replyItem = replyList[i];
        let { topicId, reply } = replyItem;
        const topicItem = await conn.get('topic', { topicId });
        const { answer, score, topicType, submitNumber, correctNumber } = topicItem;
        if (topicType === '3') {
          reply = reply.join(',');
        }
        const status = topicType !== '5' ? '1' : '0';
        const addNum = (reply === answer && topicType !== 5) ? 1 : 0;
        const point = (reply === answer && topicType !== 5) ? score : 0;
        await conn.insert('topic_student', { topicId, reply, testId, userId, status, point });
        await conn.update('topic', { submitNumber: submitNumber + 1, correctNumber: correctNumber + addNum }, { where: { topicId } });
      }
      await conn.commit();
      return true;
    } catch (e: any) {
      await conn.rollback();
      this.ctx.throw(500, '服务端出错');
    }
  }

  async getLicense(data): Promise<any> {
    const sqlStr = 'select user.userId, user.userName from user left join topic_student on user.userId=topic_student.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, ['testId', 'status'], 'topic_student', false);
    const results = await this.app.mysql.query(validSqlStr, values);
    return results;
  }

  async updateSingle(data): Promise<boolean> {
    const row: any = filterSomeKey(data, keyArray);
    const option = { where: { testId: row.testId } };
    const result = await this.app.mysql.update('test', row, option);
    return result.affectedRows === 1;
  }

  async findSubmitDataByTeacher(data): Promise<any> {
    const sqlStr = 'select user.userId, userName, score from user left join test_student on user.userId=test_student.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, ['testId'], 'test_student', false);
    const result = await this.app.mysql.query(validSqlStr, values);
    const length = result.length;
    return { result, length };
  }

  async updateTestStatus(data): Promise<boolean> {
    const { testId } = data;
    const conn = await this.app.mysql.beginTransaction();
    try {
      const relpyList = await conn.select('topic_student', { where: { testId } });
      await conn.update('test_student', { taskStatus: '1' }, { where: { testId } });
      await conn.update('test', { testStatus: '2' }, { where: { testId } });
      for (let i = 0; i < relpyList.length; ++i) {
        const replyItem = relpyList[i];
        const { userId, testId, point } = replyItem;
        const prevPoint = (await conn.get('test_student', { userId, testId })).score;
        await conn.update('test_student', { score: prevPoint + point }, { where: { userId, testId } });
      }
      await conn.update('test_student', { taskStatus: '1' }, { where: { testId } });
      await conn.update('test', { testStatus: '2' }, { where: { testId } });
      await conn.commit();
      return true;
    } catch (e) {
      await conn.rollback();
      this.ctx.throw(500, '服务端出错');
    }
  }


}

