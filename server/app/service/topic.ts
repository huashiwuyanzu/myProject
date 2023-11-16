import { fixSqlStr, polymerizeArr } from 'app/utils/util';
import { Service } from 'egg';


export default class TopicServer extends Service {

  async findWithOption(data): Promise<any> {
    const sqlStr = 'select * from topic where testId = ?';
    const result = await this.app.mysql.query(sqlStr, data.testId);
    return result;
  }

  async findWithOptionByTeacher(data): Promise<any> {
    const sqlStr = 'select topic.id, topic.topicId, topicType, score, topicText, answer, options, reply, point from topic_student left join topic on topic.topicId=topic_student.topicId left join user on topic_student.userId=user.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, ['testId', 'userId'], 'topic_student', false);
    const result = await this.app.mysql.query(validSqlStr, values);
    const length = result.length;
    return { result, length };
  }

  async updatePointPageByTeacher(data): Promise<boolean> {
    const { testId, pointList } = data;
    const conn = await this.app.mysql.beginTransaction();
    try {
      for (let i = 0; i < pointList.length; ++i) {
        const pointItem = pointList[i];
        const { userId, topicId, point } = pointItem;
        const row = { point, status: '1' };
        const options = { where: { userId, topicId } };
        await conn.update('topic_student', row, options);
      }
      const updateTime: string = Date.parse(String(new Date())).toString();
      const testRow = { updateTime };
      const testOptions = { where: { testId } };
      await conn.update('test', testRow, testOptions);
      await conn.commit();
      return true;
    } catch (e: any) {
      await conn.rollback();
      this.ctx.throw(500, '服务端出错');
    }
  }
}

