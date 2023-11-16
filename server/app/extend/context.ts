interface ResponseData {
  record?: Array<any>;
}
module.exports = {
  success(code = 0, message = '接口调用成功', data: {
    record?: Array<any>,
    length?: number,
    tokenStr?: string | null,
    userInfo?: object,
    testInfo?: object,
  }) {
    this.body = {
      code,
      message,
      data,
    };
  },
};
