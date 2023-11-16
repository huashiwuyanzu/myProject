import config from "@/configs/request/config.ts";

const testApi: Record<string, string> = {
    getListByTeacher: '/tests/teacher',
    getListByStudent: '/tests/student',
    create: '/tests',
    getSingle: '/tests/single',
    submitByStudent: '/tests/student',
    collectByTeacher: '/tests/teacher',
    getSubmittedByTeacher: '/tests/submitted',
    getLicense: '/tests/license',
    confirmFinish: '/tests/finish'
}

export function getPageTestByTeacher(params: Record<string, string | number>) {
    return config({
        url: testApi.getListByTeacher,
        method: 'get',
        params
    })
}

export function getPageTestByStudent(params: Record<string, string | number>) {
    return config({
        url: testApi.getListByStudent,
        method: 'get',
        params
    })
}

export function createSingle(data: Record<string, any>) {
    return config({
        url: testApi.create,
        method: 'post',
        data
    })
}

export function getSingleTest(params: Record<string, any>) {
    return config({
        url: testApi.getSingle,
        method: 'get',
        params
    })
}

export function submitTestByStudent(data: Record<string, any>) {
    return config({
        url: testApi.submitByStudent,
        method: 'post',
        data
    })
}

export function collectTestByTeacher(data: Record<string, any>) {
    return config({
        url: testApi.collectByTeacher,
        method: 'patch',
        data
    })
}

export function getSubmittedTestByTeacher(params: Record<string, any>) {
    return config({
        url: testApi.getSubmittedByTeacher,
        method: 'get',
        params
    })
}

export function getLicenseByTeacher(params: Record<string, any>) {
    return config({
        url: testApi.getLicense,
        method: 'get',
        params
    })
}

export function confirmFinishByTeacher(data: Record<string, any>) {
    return config({
        url: testApi.confirmFinish,
        method: 'patch',
        data
    })
}
