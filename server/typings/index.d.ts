import 'egg';

declare module 'egg' {
  interface Application {
    mysql: any,
    jwt: any,
    messageMap: { text: string },
  }

  interface ResponseData {
    code: number,
    message: string,
    data?: {
      tokenStr?: string | null,
      record?: Array<any>,
      userInfo?: Object,
      length?: number,
      testInfo?: Object,
    }
  }

  interface OptionsForPageQuery {
    offset?: number,
    limit?: number,
    orderBy?: string,
    orderType?: string,
  }
}
