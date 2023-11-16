// 正则校验
function verificateStr(str: string, regularArr: Array<RegExp>): boolean {
    for (let i = 0; i < regularArr.length; ++i) {
        if (!regularArr[i].test(str)) {
            return false
        }
    }
    return true
}

// 获取路径参数
function getSearchInUrl(url: string): any {
    const startIndex: number = String(url).indexOf('?') + 1
    const searchArr: string[] = String(url).slice(startIndex, url.length).split('&')
    const search: Record<string, string> = {}
    searchArr.forEach(item => {
        const index: number = item.indexOf('=')
        const key: string = item.slice(0, index)
        const value: string = item.slice(index + 1, item.length)
        search[key] = value
    })
    return search
}

// 身份判断
const roleTypeMap: Record<string, string> = {
    1: '学生',
    2: '教师',
    3: '管理员'
}
// 提醒判断
const topicTypeMap: Record<string, string> = {
    1: '判断题',
    2: '单选题',
    3: '多选题',
    4: '填空题',
    5: '简答题'
}

// 欢迎语
function getWelcome(hour: number): string {
    if (hour > 5 && hour < 13) {
        return '早上好'
    } else if (hour > 12 && hour < 7) {
        return '下午好'
    } else {
        return '晚上好'
    }
}

// 在对象数组中，根据某个字段的值寻找下标
function findIndexByKey(arr: Array<Record<string, any>>, key: string, value: any) {
    for (let i = 0; i < arr.length; ++i) {
        const item = arr[i];
        if (item[key] === value) {
            return i;
        }
    }
    return -1;
}


// 时间戳转日期
function getTime(timeStamp: string, mode?: string): string {
    const date = new Date(parseInt(timeStamp));
    const year = date.getFullYear(); // 获取年份
    const month = date.getMonth() + 1; // 获取月份，需要加1
    const day = date.getDate(); // 获取日期
    const hour = date.getHours(); // 获取小时
    const minute = date.getMinutes(); // 获取分钟
    const second = date.getSeconds(); // 获取秒数
    if (mode === 'year') {
        return year.toString()
    } else if (mode === 'date') {
        return `${year}-${month}-${day}`
    } else if (mode === 'minute') {
        return `${year}-${month}-${day}  ${hour}:${minute}`
    } else {
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
}


// 统计某个char在string中出现的次数
function countChar(str: string, char: string) {
    let num = 0
    for (let i = 0; i < str.length; ++i) {
        if (str[i] === char) {
            num++;
        }
    }
    return num
}

// 判断数组1是否是包含数组2
function isInclude(arr_1: Array<any>, arr_2: Array<any>, elementType: string) {
    if (elementType === 'string') {
        for (let i = 0; i < arr_2.length; ++i) {
            if (arr_1.indexOf(arr_2[i]) === -1) {
                return false
            }
        }
    }
    return true
}

// 数组根据某个字段来排序
function compare(property: string, type: string) {
    return function (a: any, b: any) {
        const value1 = a[property]
        const value2 = b[property]
        if (type === 'asc') {
            return value1 - value2
        } else if (type === 'desc') {
            return value2 - value1
        }
        return value1 - value2
    }
}


export {
    getSearchInUrl,
    roleTypeMap,
    getWelcome,
    verificateStr,
    getTime,
    countChar,
    isInclude,
    compare,
    topicTypeMap,
    findIndexByKey
}
