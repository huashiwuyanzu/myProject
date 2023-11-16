import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';


export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  config.messageMap = {
    0: '接口调用成功',
    1: 'sql error',
    2: 'server error',
    3: 'invalid token',
  };
  config.serverErrMsg = {
    1: 'sql error',
    2: 'invalid token',
  };
  config.requestErrMsg = {
    415: '错误的请求方式',
    422: '错误的参数',
  };
  config.defaultValue = {
    offset: 0,
    limit: 10,
    orderBy: 'id',
    orderType: 'asc',
  };
  config.keys = appInfo.name + 'boyiao_scnu';
  config.mysql = {
    app: true,
    agent: false,
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: 'boyiao',
      database: 'gradingsystem',
    },
  };
  config.jwt = {
    secret: 'boyiao_scnu',
    expiresIn: 60 * 60 * 10,
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [
      'http://localhost:5173',
    ],
  };
  config.cors = {
    origin: 'http://localhost:5173',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.validate = {
    convert: true,
    validateRoot: true,
  };
  config.multipart = {
    mode: 'file',
  };
  config.middleware = ['processError', 'checkToken', 'throwTokenErr', 'sqlParams'];
  config.processError = {
    enable: true,
    match: '/',
  };
  config.checkToken = {
    enable: true,
    match: ['/users/', '/courses/', '/tests/', '/auth/getMessage/', '/doubts/'],
  };
  config.throwTokenErr = {
    enable: true,
    match: ['/users/', '/courses/', '/tests/', '/auth/getMessage/', '/doubts/'],
  };
  config.sqlParams = {
    enable: true,
    match: ['/users/', '/courses/', '/tests/', '/topics/', '/doubts/'],
  };
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  return {
    ...config,
    ...bizConfig,
  };
};
