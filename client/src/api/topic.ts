import config from "@/configs/request/config.ts";

const topicApi: Record<string, string> = {
    getList: '/topics',
    getListByTeacher: '/topics/teacher',
    saveEdit: '/topics',
}

export function getPageTopic(params: Record<string, string | number>) {
    return config({
        url: topicApi.getList,
        method: 'get',
        params
    })
}

export function getPageTopicByTeacher(params: Record<string, string | number>) {
    return config({
        url: topicApi.getListByTeacher,
        method: 'get',
        params
    })
}

export function saveEditByTeacher(data: Record<string, any>) {
    return config({
        url: topicApi.saveEdit,
        method: 'patch',
        data
    })
}

