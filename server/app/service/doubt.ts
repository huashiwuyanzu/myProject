import { Service } from 'egg';
import stringRandom from 'string-random';
import { filterSomeKey, fixSqlStr } from 'app/utils/util';
const keyArr = ['id', 'userId', 'doubtId', 'topicId', 'testId', 'question', 'reply', 'taskStatus'];

export default class DoubtService extends Service {
  async submitSingleByStudent(data): Promise<boolean> {
    const doubtId = stringRandom();
    const { userId, testId, topicId, question } = data;
    await this.app.mysql.insert('doubt', { doubtId, userId, testId, topicId, question });
    return true;
  }
  async submitSingleByTeacher(data): Promise<boolean> {
    const doubtId = stringRandom();
    const { userId, testId, topicId, reply } = data;
    await this.app.mysql.insert('doubt', { doubtId, userId, testId, topicId, reply, taskStatus: '2' });
    return true;
  }

  async getList(data): Promise<any> {
    const sqlStr = 'select doubtId, topicId, question, reply, taskStatus, user.userName, user.userPicture from doubt left join user on doubt.userId=user.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, ['topicId'], undefined, false);
    const result = await this.app.mysql.query(validSqlStr, values);
    return { result, length: result.length };
  }

  async updateSingle(data): Promise<boolean> {
    const row = filterSomeKey(data, keyArr);
    const options = { where: { doubtId: data.doubtId } };
    await this.app.mysql.update('doubt', row, options);
    return true;
  }
}
