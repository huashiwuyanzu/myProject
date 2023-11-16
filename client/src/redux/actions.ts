import constant from './constant.ts'

export const addCount = function (data: any) {
    return {
        type: constant.ADD_COUNT,
        data,
    }
}
export const changeLastPage = function (data: string) {
    return {
        type: constant.CHANGE_LASTPAGE,
        data,
    }
}
export const changeUserInfo = function (data: {
    userId?: string,
    userName?: string,
    userPic?: string,
    roleType?: string,
}) {
    return {
        type: constant.CHANGE_USERINFO,
        data,
    }
}
