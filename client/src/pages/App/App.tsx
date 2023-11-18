import {Suspense} from "react";
import {useRoutes} from "react-router-dom";
import {ConfigProvider, Spin, theme} from 'antd'
import {routeArray} from "@/configs/router/config.tsx";
import '@/pages/App/App.scss'



function App() {
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
