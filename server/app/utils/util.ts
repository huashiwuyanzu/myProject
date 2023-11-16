interface Option {
  keyName: string,
  typeName: string,
  isRequire?: boolean | undefined,
  enumValues?: Array<any> | undefined,
}
import { paramsForOptionsFindInCourse } from 'typings/app';

// 校验前端传递的参数
// 四个形参的含义分别是：前端传递的参数，规定的必要的参数，前端传递的参数的枚举值, 以及前端允许传递的参数
function validParams(
  params: Record<string, string | number>,
  isRequireParams?: Array<string>,
  validValues?: Array<{ keyName: string, values: Array<any> }>,
  validKeys?: Array<string>,
): boolean {
  // 校验必要的参数是否都存在
  if (isRequireParams !== undefined) {
    for (let i = 0; i < isRequireParams.length; ++i) {
      if (params[isRequireParams[i]] === undefined) {
        return false;
      }
    }
  }
  // 校验前端传递的参数是否是枚举值
  if (validValues !== undefined) {
    for (let i = 0; i < validValues.length; ++i) {
      const { keyName, values } = validValues[i];
      if (params[keyName] === undefined) {
        continue;
      } else {
        if (values.indexOf(params[keyName]) === -1) {
          return false;
        }
      }
    }
  }
  // 校验传递的参数字段名称是否合法
  if (validKeys !== undefined) {
    for (const key in params) {
      if (validKeys.indexOf(key) === -1) {
        return false;
      }
    }
  }
  return true;
}

// sql语句补全
// 五个参数的含义分别是：待补全的sql语句，拟定的参数，允许存在的查询|更改参数，主表，是否限制返回的数据的数量
function fixSqlStr(
  sqlStr: string,
  options: paramsForOptionsFindInCourse,
  baseKeys: Array<string>,
  tableName?: string,
  filter?: boolean,
) {
  let optionStr = '';
  let validSqlStr = '';
  let { orderBy } = options;
  if (tableName !== undefined) {
    orderBy = tableName + '.' + orderBy;
  }
  const values: Array<string | number> = [];
  for (const key in options) {
    if (baseKeys.indexOf(key) !== -1) {
      if (tableName !== undefined) {
        optionStr += tableName + '.';
      }
      optionStr += key + '=? and ';
      values.push(options[key]);
    }
  }
  if (optionStr !== '') {
    optionStr = optionStr.slice(0, optionStr.length - 4);
    validSqlStr = sqlStr + ' where ' + optionStr;
  } else {
    validSqlStr = sqlStr;
  }
  if (filter !== false) {
    validSqlStr += ` order by ${orderBy} ${options.orderType} limit ${options.offset},${options.limit}`;
  }
  return { validSqlStr, values };
}

// 过滤某些属性
function filterSomeKey(obj, keyArr) {
  const option = {};
  for (const key in obj) {
    if (keyArr.indexOf(key) !== -1) {
      option[key] = obj[key];
    }
  }
  return option;
}


// 根据字段值查找数组中的某个元素
function getElement(arr, key, value): any | null {
  for (let i = 0; i < arr.length; ++i) {
    const option = arr[i];
    if (option[key] === value) {
      return option;
    }
  }
  return null;
}

// 数组中的元素是对象，根据对象身上的单一字段对数组进行聚合
function polymerizeArr(arr: Array<any>, key: string) {
  interface Option {
    keyName: string,
    data: Array<any>
  }
  const newArr: Array<Option> = [];
  arr.forEach(item => {
    const oldOption = getElement(newArr, key, item[key]) as unknown as Option | null;
    const element: Record<string, any> = {};
    for (const keyName in item) {
      if (keyName !== key) { element[keyName] = item[keyName]; }
    }
    if (oldOption === null) {
      const option = {} as unknown as Option;
      option[key] = item[key];
      option.data = [element];
      newArr.push(option);
    } else {
      oldOption.data.push(element);
    }
  });
  return newArr;
}

export { validParams, fixSqlStr, getElement, filterSomeKey, polymerizeArr };
