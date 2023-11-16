import App from '@/pages/App/App.tsx'
import {getMessage} from "@/api/auth_api.ts";
import {changeUserInfo} from "@/redux/actions.ts";
import store from "@/redux/store.ts";
import {roleTypeMap} from "@/utils/util.ts";


// 刷新页面：更新token或者重新登录
const ignoredPath = ['/login', '/error']
if (ignoredPath.indexOf(window.location.pathname) === -1) {
    await new Promise(resolve => {
        getMessage().then(res => {
            window.localStorage.setItem('token', res.data.tokenStr)
            const {userInfo} = res.data
            userInfo.roleType = roleTypeMap[userInfo.roleType]
            store.dispatch(changeUserInfo(userInfo))
            resolve(null)
        })
    })
}

function Root() {
    return (
        <div className='root'>
            <App></App>
        </div>
    )
}

export default Root
