import config from "@/configs/request/config.ts";

const courseApi: Record<string, string> = {
    getList: '/courses',
    getListByAdmin: '/courses/admin',
    update: '/courses',
    add: '/courses',
    delete: '/courses',
    updatePicture: '/courses/picture',
    getSingle: '/courses/single',
    join: '/courses/join'
}

export function getPageCourse(params: Record<string, string | number>) {
    return config({
        url: courseApi.getList,
        method: 'get',
        params
    })
}

export function getSingleCourse(params: Record<string, string>) {
    return config({
        url: courseApi.getSingle,
        method: 'get',
        params
    })
}


export function getPageCourseByAdmin(params: Record<string, string | number>) {
    return config({
        url: courseApi.getListByAdmin,
        method: 'get',
        params
    })
}

export function updateCourse(data: Record<string, string | number>) {
    return config({
        url: courseApi.update,
        method: 'patch',
        data
    })
}

export function addSingle(data: Record<string, any>) {
    return config({
        url: courseApi.add,
        method: 'post',
        data
    })
}

export function joinCourse(data: Record<string, any>) {
    return config({
        url: courseApi.join,
        method: 'post',
        data
    })
}

export function deleteSingleCourse(params: Record<string, string>) {
    return config({
        url: courseApi.delete,
        method: 'delete',
        params
    })
}


export function updateCoursePicture(data: Record<string, any>) {
    return config({
        url: courseApi.updatePicture,
        method: 'patch',
        data
    })
}
