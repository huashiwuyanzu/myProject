import 'egg';
declare module 'egg' {
  interface paramsForOptionsFindInCourse {
    limit: string,
    offset: string,
    orderType: string,
    orderBy: string,
    courseId?: string,
    courseName?: string,
    invitationCode?: string,
    teacherId?: string,
    startYear?: string,
    endYear?: string,
  }

  interface UpdateSingleParams {
    courseName?: string,
    courseId?: string,
    courseIntroduction?: string,
    coursePicture?: string,
    invitationCode?: string,
  }
}
