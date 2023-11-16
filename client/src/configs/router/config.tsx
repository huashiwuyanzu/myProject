import React from 'react'
import AppLayout from "@/pages/PrimaryPage/AppLayout/AppLayout.tsx";
import Login from "@/pages/PrimaryPage/Login/Login.tsx"
import MyResult from "@/pages/PrimaryPage/MyResult/MyResult.tsx"
import SystemHelp from "@/pages/RouterPage/CommonPage/SystemHelp/SystemHelp.tsx";
import User from '@/pages/RouterPage/CommonPage/User/User.tsx'
import WebsiteAnnouncement from "@/pages/RouterPage/CommonPage/WebsiteAnnouncement/WebsiteAnnouncement.tsx";
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    SettingOutlined,
    ArrowUpOutlined,
    OrderedListOutlined,
    HighlightOutlined
} from "@ant-design/icons";
import Test from "@/test/test.tsx";
// 懒加载
const CourseArr = React.lazy(() => import("@/pages/RouterPage/MultiplexPage/CourseArr/CourseArr.tsx"))
const SystemManege = React.lazy(() => import("@/pages/RouterPage/AdminPage/SystemManege/SystemManege.tsx"))
const ProjectSubmit = React.lazy(() => import("@/pages/RouterPage/StudentPage/ProjectSubmit/ProjectSubmit.tsx"))
const ExamOnline = React.lazy(() => import("@/pages/RouterPage/StudentPage/ExamOnline/ExamOnline.tsx"))
const ProjectEvalute = React.lazy(() => import("@/pages/RouterPage/TeacherPage/ProjectEvalute/ProjectEvalute.tsx"))
const CreateTest = React.lazy(() => import("@/pages/RouterPage/TeacherPage/CreateTest/CreateTest.tsx"))
const ExamDetail = React.lazy(() => import("@/pages/RouterPage/MultiplexPage/ExamDetail/ExamDetail.tsx"))
const MarkOnline = React.lazy(()=> import("@/pages/RouterPage/TeacherPage/MarkOnline/MarkOnline.tsx"))

// 路由表项
type routeItem = {
    path: string,
    element?: React.ReactNode | React.LazyExoticComponent<() => JSX.Element>
    children?: Array<routeItem>,
    icon?: React.ReactNode,
    label?: string,
    isRedirect?: boolean,
    superior?: string,
    guard?: Array<string>,
    role?: Array<string>
    errorHandle?: string,
}
// 路由配置
const routeArray: Array<routeItem> = [
    // 首页下的二级路由
    // 侧边导航栏的处理,侧边导航栏对应的是一级路由AppLayout下的二级路由
    {
        path: '/appLayout',
        element: <AppLayout/>,
        role: ['admin', 'teacher', 'student'],
        children: [
            {
                path: 'user',
                element: <User/>,
                icon: <UserOutlined/>,
                label: '个人信息',
                role: ['admin', 'teacher', 'student'],
            },
            {
                path: 'userManage',
                element: <SystemManege/>,
                icon: <SettingOutlined/>,
                label: '系统管理',
                role: ['admin'],
            },
            {
                path: 'courseArr',
                element: <CourseArr/>,
                icon: <OrderedListOutlined/>,
                label: '课程列表',
                role: ['admin', 'teacher', 'student'],
            },
            {
                path: 'projectSubmit',
                element: <ProjectSubmit/>,
                icon: <ArrowUpOutlined/>,
                label: '项目提交',
                role: ['student'],
            },
            {
                path: 'projectEvalute',
                element: <ProjectEvalute/>,
                icon: <HighlightOutlined/>,
                label: '项目评测',
                role: ['teacher'],
            },
            {
                path: 'websiteAnnouncement',
                element: <WebsiteAnnouncement/>,
                icon: <NotificationOutlined/>,
                label: '网站公告',
                role: ['admin', 'teacher', 'student'],
            },
            {
                path: 'systemHelp',
                element: <SystemHelp/>,
                icon: <LaptopOutlined/>,
                label: '系统帮助',
                role: ['admin', 'teacher', 'student'],
            },
            {
                path: 'test',
                element: <Test/>,
            },
            {
                path: '',
                element: <User/>,
                isRedirect: true,
            }
        ]
    },
    // 详情
    {
        path: '/examDetail',
        element: <ExamDetail/>,
        role: ['admin', 'teacher', 'student'],
    },
    // 新增考试
    {
        path: '/createTest',
        element: <CreateTest/>,
        role: ['teacher'],
    },
    // 在线评卷
    {
        path:'/markOnline',
        element:<MarkOnline/>,
        role:['teacher']
    },
    // 登录
    {
        path: '/login',
        element: <Login/>,
        role: ['admin', 'teacher', 'student'],
        guard: ['/appLayout'],
        errorHandle: 'back'
    },
    // 结果
    {
        path: '/myResult',
        element: <MyResult/>,
        role: ['admin', 'teacher', 'student'],
    },
    // 考试
    {
        path: 'examOnline',
        element: <ExamOnline/>,
        role: ['student'],
    },
    {
        path: '/',
        element: <Login/>,
        isRedirect: true,
    }
]


const childrenForAppLayout: routeItem[] = ((routeArray[0].children) as Array<routeItem>).filter(item => {
    return item.isRedirect === undefined
})
const asideConfig = childrenForAppLayout.map(item => {
    const option = {
        label: item.label,
        key: item.path,
        icon: item.icon
    };
    return option
})


export {routeArray, asideConfig};
