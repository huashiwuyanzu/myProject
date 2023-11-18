import axios from 'axios'
import {replaceWindow} from "@/configs/router/config.tsx";

// 开发环境下的基础URL
const baseUrl: string = import.meta.env.VITE_BASEURL; //http://127.0.0.1:7001
// 准备路由实例

// 自定义axios实例
const config = axios.create({
    baseURL: baseUrl,
    timeout: 6000,
})
// 响应拦截
const correctnessHandler = function (response: any) {
    return response.data
}
// 错误拦截
const errorHandler = function (error: any) {
    if (error.response.status === 403) {
        // token过期
        // TOTO
    } else if (error.response.status === 404) {
        // 页面丢失
        replaceWindow('/myResult',{status:'404'})
    } else {
        // replaceWindow('/myResult',{status:'500'})
    }
    window.localStorage.setItem('path', '/myResult')
    return Promise.reject(error)
}
// 配置请求和响应拦截
config.interceptors.response.use(correctnessHandler, errorHandler)
config.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

export default config
