import 'egg';
declare module 'egg' {
  interface paramsForOptionsFindInTest {
    limit: string,
    offset: string,
    orderType: string,
    orderBy: string,
    testId?: string,
    courseId?: string,
    testScore?: string,
    startTime?: string,
    endTime?: string,
  }
}
