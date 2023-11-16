import config from "@/configs/request/config.ts";

const doubeApi: Record<string, string> = {
    addSingle: '/doubts',
    getList: '/doubts',
    replyByTeacher:'/doubts/reply',
    replyToAll:'/doubts/teacher'
}

export function addSingleByStudent(data: Record<string, any>) {
    return config({
        url: doubeApi.addSingle,
        method: 'post',
        data
    })
}

export function addSingleByTeacher(data: Record<string, any>) {
    return config({
        url: doubeApi.replyToAll,
        method: 'post',
        data
    })
}

export function getDoubtList(params: Record<string, any>) {
    return config({
        url: doubeApi.getList,
        method: 'get',
        params
    })
}

export function submitReplyByTeacher(data: Record<string, any>) {
    return config({
        url: doubeApi.replyByTeacher,
        method: 'patch',
        data
    })
}
