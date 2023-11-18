import React from 'react'
import {useNavigate} from "react-router-dom";
import AppLayout from "@/pages/PrimaryPage/AppLayout/AppLayout.tsx";
import {RouterAuth} from "@/pages/RouterAuth.tsx";
import Login from "@/pages/PrimaryPage/Login/Login.tsx"
import MyResult from "@/pages/PrimaryPage/MyResult/MyResult.tsx"
import User from '@/pages/RouterPage/CommonPage/User/User.tsx'
import {
    UserOutlined,
    SettingOutlined,
    OrderedListOutlined,
} from "@ant-design/icons";
import {getMessage} from "@/api/auth_api.ts";
import {roleTypeMap} from "@/utils/util.ts";
import store from "@/redux/store.ts";
import {changeUserInfo} from "@/redux/actions.ts";
// 懒加载
const CourseArr = React.lazy(() => import("@/pages/RouterPage/MultiplexPage/CourseArr/CourseArr.tsx"))
const SystemManege = React.lazy(() => import("@/pages/RouterPage/AdminPage/SystemManege/SystemManege.tsx"))
const ExamOnline = React.lazy(() => import("@/pages/RouterPage/StudentPage/ExamOnline/ExamOnline.tsx"))
const CreateTest = React.lazy(() => import("@/pages/RouterPage/TeacherPage/CreateTest/CreateTest.tsx"))
const ExamDetail = React.lazy(() => import("@/pages/RouterPage/MultiplexPage/ExamDetail/ExamDetail.tsx"))
const MarkOnline = React.lazy(() => import("@/pages/RouterPage/TeacherPage/MarkOnline/MarkOnline.tsx"))

// 路由表项
type routeItem = {
    path: string,
    element?: React.ReactNode | React.LazyExoticComponent<() => JSX.Element>
    children?: Array<routeItem>,
    icon?: React.ReactNode,
    label?: string,
    isRedirect?: boolean,
    guard?: string,
    role?: Array<string>
}
// 路由配置
const routeArray: Array<routeItem> = [
    // 登录
    {
        path: '/login',
        element: <Login/>,
        guard: 'direct',
        role: ['学生', '教师', '管理员']
    },
    // 首页下的二级路由
    // 侧边导航栏的处理,侧边导航栏对应的是一级路由AppLayout下的二级路由
    {
        path: '/appLayout',
        element: <RouterAuth><AppLayout/></RouterAuth>,
        children: [
            {
                path: 'user',
                element: <User/>,
                icon: <UserOutlined/>,
                label: '个人信息',
                guard: 'direct',
                role: ['学生', '教师', '管理员']
            },
            {
                path: 'systemManage',
                element: <SystemManege/>,
                icon: <SettingOutlined/>,
                label: '系统管理',
                guard: 'direct',
                role: ['管理员']
            },
            {
                path: 'courseArr',
                element: <CourseArr/>,
                icon: <OrderedListOutlined/>,
                label: '课程列表',
                guard: 'direct',
                role: ['学生', '教师']
            },
        ]
    },
    // 详情
    {
        path: '/examDetail',
        element: <RouterAuth><ExamDetail/></RouterAuth>,
        guard: 'indirect',
        role: ['学生', '教师']
    },
    // 新增考试
    {
        path: '/createTest',
        element: <CreateTest/>,
        guard: 'indirect',
        role: ['教师']
    },
    // 在线评卷
    {
        path: '/markOnline',
        element: <MarkOnline/>,
        guard: 'indirect',
        role: ['教师']
    },
    // 考试
    {
        path: '/examOnline',
        element: <ExamOnline/>,
        guard: 'indirect',
        role: ['学生']
    },
    // 结果
    {
        path: '/myResult',
        element: <MyResult/>,
        guard: 'indirect',
        role: ['学生', '教师', '管理员']
    },
]

const routerGuard = function () {
    // 打开网站根目录进行鉴权
    const token = window.localStorage.getItem('token')
    const pathName = window.location.pathname // 根目录下的路径
    if (pathName === '/') {
        if (token === null) {
            window.location.replace('http://127.0.0.1:5173/login')
        } else {
            getMessage().then(res => {
                window.localStorage.setItem('token', res.data.tokenStr)
                const {userInfo} = res.data
                userInfo.roleType = roleTypeMap[userInfo.roleType]
                store.dispatch(changeUserInfo(userInfo))
                window.location.replace('http://127.0.0.1:5173/appLayout/user')
            })
        }
    }
    const guardArray: Array<{
        path: string,
        guard: string,
        role: string[],
    }> = []
    routeArray.forEach(item => {
        if (item.children === undefined) {
            const {path, guard, role} = item
            guardArray.push({path, guard: guard as string, role: role as string[]})
        } else {
            const parentPath = item.path;
            item.children.forEach(i => {
                const {guard, role, path} = i
                guardArray.push({
                    path: parentPath + '/' + path,
                    guard: guard as string,
                    role: role as string[],
                })
            })
        }
    })
    return guardArray;
}

// 处理主页面下的侧边栏菜单
const childrenForAppLayout: routeItem[] = ((routeArray[1].children) as Array<routeItem>).filter(item => {
    console.log(item)
    return item.isRedirect === undefined
})
const asideConfig = childrenForAppLayout.map(item => {
    const option = {
        label: item.label,
        key: item.path,
        icon: item.icon,
        role: item.role
    };
    return option
})

const useMyNavigate = function () {
    const navigate = useNavigate()
    const myNavigate = function (path: string, options?: Record<string, any>, params?: Record<string, string>) {
        window.localStorage.setItem('path', path)
        if (params === undefined) {
            navigate(path, options)
        } else {
            let url = path + '?';
            for (const key in params) {
                url += key + '=' + params[key] + '&'
            }
            url = url.slice(0, url.length - 1)
            navigate(url, options)
        }
    }
    return myNavigate;
}

const openWindowInBlank = function (path: string, options?: Record<string, string>) {
    const baseUrl = 'http://127.0.0.1:5173'
    window.localStorage.setItem('path', path)
    if (options === undefined) {
        window.open(baseUrl + path, 'blank')
    } else {
        let Url = baseUrl + path + '?';
        for (const key in options) {
            Url += `${key}=${options[key]}&`
        }
        Url = Url.slice(0, Url.length - 1)
        window.open(Url, 'blank')
    }
}
const replaceWindow = function (path: string, options?: Record<string, string>) {
    const baseUrl = 'http://127.0.0.1:5173'
    window.localStorage.setItem('path', path)
    if (options === undefined) {
        window.location.replace(baseUrl + path)
    } else {
        let Url = baseUrl + path + '?';
        for (const key in options) {
            Url += `${key}=${options[key]}&`
        }
        Url = Url.slice(0, Url.length - 1)
        window.location.replace(Url)
    }
}


export {routeArray, asideConfig, useMyNavigate, openWindowInBlank, routerGuard, replaceWindow};
