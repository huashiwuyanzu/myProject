import { Service } from 'egg';
import { filterSomeKey, fixSqlStr } from 'app/utils/util';
import { UpdateSingleParams } from 'typings/app';
import stringRandom from 'string-random';
const keyArray = [
  'id',
  'courseName',
  'courseId',
  'courseIntroduction',
  'userId',
  'startYear',
  'endYear',
  'coursePicture',
];

export default class CourseService extends Service {
  async findWithOptions(data): Promise<any> {
    const validData = data;
    const sqlStr = 'select userName,userPicture,coursePicture,courseId,courseName,courseIntroduction,startYear,endYear,invitationCode from course left join user on user.userId=course.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, validData, keyArray, 'course');
    const result = await this.app.mysql.query(validSqlStr, values);
    const length = result.length;
    return { result, length };
  }

  async findSingleByCourseId(data): Promise<any> {
    const { courseId } = data;
    const result = await this.app.mysql.get('course', { courseId });
    return result;
  }

  async findWithOptionsByStudent(data): Promise<any> {
    const validData = data;
    const sqlStr = 'select userName,userPicture,coursePicture,course.courseId,courseName,courseIntroduction,startYear,endYear,invitationCode from course left join course_student on course.courseId=course_student.courseId left join user on course.userId=user.userId';
    const { validSqlStr, values } = fixSqlStr(sqlStr, validData, keyArray, 'course_student');
    const result = await this.app.mysql.query(validSqlStr, values);
    const length = result.length;
    return { result, length };
  }

  async updateSingle(data: UpdateSingleParams): Promise<boolean> {
    const row: any = filterSomeKey(data, keyArray);
    const options = { where: { courseId: row.courseId } };
    const result = await this.app.mysql.update('course', row, options);
    return result.affectedRows === 1;
  }

  async addSingle(data): Promise<boolean> {
    const { courseName, courseIntroduction, userId, startYear, endYear } = data;
    const courseId = stringRandom();
    const invitationCode = stringRandom();
    const result = await this.app.mysql.get('course', { courseId });
    if (result !== null) { return false; }
    await this.app.mysql.insert('course', { courseName, invitationCode, startYear, endYear, userId, courseId, courseIntroduction });
    return true;
  }

  async deleteSingle(data): Promise<boolean> {
    const { courseId } = data;
    const result = await this.app.mysql.delete('course', {
      courseId,
    });
    return result.affectedRows === 1;
  }

  async getSingleByCourseId(data): Promise<any> {
    const { courseId } = data;
    const result = await this.app.mysql.get('course', { courseId });
    if (data.userId === undefined) {
      return result;
    }
    const status = await this.app.mysql.get('course_student', { courseId, userId: data.userId });
    return { courseInfo: result, beJoin: status !== null };
  }

  async checkInvitationCode(data): Promise<boolean> {
    const { courseId, userId, invitationCode } = data;
    const courseInfo = await this.app.mysql.get('course', { courseId });
    if (invitationCode !== courseInfo.invitationCode) return false;
    await this.app.mysql.insert('course_student', { courseId, userId });
    return true;
  }
}
