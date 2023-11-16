import { Service } from 'egg';
import bcrypt from 'bcryptjs';
import { loginParams } from 'typings/app';

export default class UserService extends Service {
  async check(data: loginParams): Promise<boolean> {
    const { userId, password } = data;
    const result = await this.app.mysql.get('user', { userId });
    if (result === null) {
      return false;
    }
    return bcrypt.compareSync(password, result.password);
  }
}
