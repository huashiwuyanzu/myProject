import config from "@/configs/request/config.ts";

const userApi: Record<string, string> = {
    register: '/users',
    getList: '/users',
    delete: '/users',
    update: '/users',
    getSingle: '/users/single',
    updatePic: '/users/picture'
}

export function registerUser(data: Record<string, string | number>) {
    return config({
        url: userApi.register,
        method: 'post',
        data,
    })
}

export function getPageUser(params: Record<string, string | number>) {
    return config({
        url: userApi.getList,
        method: 'get',
        params,
    })
}

export function getSingleUser(params: Record<string, string>) {
    return config({
        url: userApi.getSingle,
        method: 'get',
        params
    })
}

export function deleteSingle(params: { userId: string }) {
    return config({
        url: userApi.delete,
        method: 'delete',
        params
    })
}

export function updateUser(data: Record<string, string | number>) {
    return config({
        url: userApi.update,
        method: 'patch',
        data
    })
}

export function updateUserPicture(data: any) {
    return config({
        url: userApi.updatePic,
        method: 'patch',
        data
    })
}
