import config from "@/configs/request/config.ts";

const authApi: Record<string, string> = {
    login: '/auth/login',
    getMessage: '/auth/getMessage',
}

export function login(data: Record<string, string>) {
    return config({
        url: authApi.login,
        method: 'post',
        data,
    })
}

export function getMessage() {
    return config({
        url: authApi.getMessage,
        method: 'get'
    })
}


