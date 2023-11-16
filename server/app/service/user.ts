import { Service } from 'egg';
import bcrypt from 'bcryptjs';
import { filterSomeKey, fixSqlStr } from 'app/utils/util';
const keyArr = ['id', 'userId', 'userName', 'password', 'roleType', 'userPicture'];


export default class UserService extends Service {
  async addSingle(data): Promise<boolean> {
    const { userId, roleType, userName } = data;
    await this.app.mysql.insert('user', {
      userName,
      userId,
      password: bcrypt.hashSync('123asdASD', 10),
      roleType,
    });
    return true;
  }

  async findSingleWithUserId(data): Promise<any> {
    const { userId } = data;
    const result = await this.app.mysql.get('user', { userId });
    return result;
  }

  async findWithOptions(data): Promise<any> {
    const sqlStr = 'select id, userId, userName, roleType, userPicture from user';
    const { validSqlStr, values } = fixSqlStr(sqlStr, data, keyArr);
    const length = (await this.app.mysql.select('user')).length;
    const result = await this.app.mysql.query(validSqlStr, values);
    return {
      result,
      length,
    };
  }

  async deleteSingle(data): Promise<boolean> {
    const { userId } = data;
    const result = await this.app.mysql.delete('user', {
      userId,
    });
    return result.affectedRows === 1;
  }

  async updateSingle(data): Promise<boolean> {
    const row: any = filterSomeKey(data, keyArr);
    if (row.password !== undefined) {
      row.password = bcrypt.hashSync(row.password, 10);
    }
    const options = { where: { userId: row.userId } };
    const result = await this.app.mysql.update('user', row, options);
    return result.affectedRows === 1;
  }


}
