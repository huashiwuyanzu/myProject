import { Application } from 'egg';
export default (app: Application) => {
  const { router, controller } = app;
  // 鉴权
  router.post('/auth/login', controller.auth.login);
  router.get('/auth/getMessage', controller.auth.getMessage);
  // 用户信息
  router.post('/users/', controller.user.register);
  router.get('/users/', controller.user.getUserList);
  router.get('/users/single', controller.user.getSingleUser);
  router.delete('/users/', controller.user.deleteSingleUser);
  router.patch('/users/', controller.user.updateSingleUser);
  router.patch('/users/picture', controller.user.updateUserPicture);
  // 课程列表
  router.get('/courses/', controller.course.getCourseList);
  router.get('/courses/admin', controller.course.getCourseListByAdmin);
  router.get('/courses/single', controller.course.getSingle);
  router.patch('/courses/', controller.course.updateSingleCourse);
  router.post('/courses/', controller.course.addSingleCourse);
  router.delete('/courses/', controller.course.deleteSingleCourse);
  router.patch('/courses/picture', controller.course.updateCoursePicture);
  router.post('/courses/join', controller.course.joinCourse);
  // 测试列表
  router.get('/tests/teacher', controller.test.getTestListByTeacher);
  router.get('/tests/student', controller.test.getTestListByStudent);
  router.post('/tests/', controller.test.createNewTest);
  router.post('/tests/student', controller.test.submitTestByStudent);
  router.get('/tests/single', controller.test.getSingleTest);
  router.patch('/tests/teacher', controller.test.collectTestByTeacher);
  router.get('/tests/submitted', controller.test.getSubmitDataByTeacher);
  router.get('/tests/license', controller.test.getLicenseForFinish);
  router.patch('/tests/finish', controller.test.confirmSubmission);
  // 题目列表
  router.get('/topics/', controller.topic.getTopicList);
  router.get('/topics/teacher', controller.topic.getTopicListByTeacher);
  router.patch('/topics/', controller.topic.saveEditByTeacher);
  // 消息列表
  router.post('/doubts/', controller.doubt.submitByStudent);
  router.get('/doubts/', controller.doubt.getDoubtList);
  router.patch('/doubts/reply', controller.doubt.replyByTeacher);
  router.post('/doubts/teacher', controller.doubt.replyToAll);
  // 批量往数据库添加数据
  router.get('/tomysql/', controller.user.addPageToMysql);
};

