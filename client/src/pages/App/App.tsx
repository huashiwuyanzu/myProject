import {Suspense} from "react";
import {useRoutes} from "react-router-dom";
import {ConfigProvider, Spin, theme} from 'antd'
import {routeArray} from "@/configs/router/config.tsx";
import '@/pages/App/App.scss'

// 状态更新和根路径重定向的逻辑
// if (window.localStorage.getItem('token') !== null) {
//     // token是否还有效，如果有效直接跳转到首页
//     getMessage().then(res => {
//         window.localStorage.setItem('token', res.data.tokenStr)
//         store.dispatch(changeUserInfo(res.data.record[0]))
//         window.location.replace('/appLayout/user')
//     })
// }
// 首次登陆的逻辑

function App() {
    // console.log(window.location.href)
    // 此处做路由守卫
    // 1.路由守卫匹配  如果失败，进行失败处理；否则更新redux的lastPage并进入新页面
    // console.log(window.location.pathname)
    // console.log(store.getState())
    // console.log(routeArray)
    // console.log('进入到新页面,' + window.location.href)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const routes = useRoutes(routeArray)
    return (
        <div className='app'>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1EC771B7',
                    },
                    components: {
                        Layout: {
                            siderBg: 'white',
                            headerBg: 'white'
                        },
                        Result: {
                            iconFontSize: 100
                        },
                        Carousel: {
                            dotWidth: 0,
                            dotHeight: 0,
                            dotActiveWidth: 0,
                        }
                    }
                }}
            >
                <Suspense fallback={<div><Spin></Spin></div>}>
                    {routes}
                </Suspense>
            </ConfigProvider>
        </div>
    )
}

export default App
