import App from '@/pages/App/App.tsx'
import {getMessage} from "@/api/auth_api.ts";
import {changeUserInfo} from "@/redux/actions.ts";
import store from "@/redux/store.ts";
import {findIndexByKey, roleTypeMap} from "@/utils/util.ts";
import {routerGuard} from "@/configs/router/config.tsx";

const token = window.localStorage.getItem('token')

const guard = routerGuard()

if (findIndexByKey(guard, 'path', window.location.pathname) === -1) {
    window.location.replace('/appLayout/user')
}
if (window.location.pathname !== '/login' && window.location.pathname !== '/myResult' && token !== null) {
    // 此处await处理  确保登陆后的页面每次刷新都能拿到userInfo和token
    await new Promise((resolve, reject) => {
        getMessage().then(res => {
            window.localStorage.setItem('token', res.data.tokenStr)
            const {userInfo} = res.data
            userInfo.roleType = roleTypeMap[userInfo.roleType]
            store.dispatch(changeUserInfo(userInfo))
            resolve(null)
        }).catch(() => {
            alert('登陆已过期，请重新登录')
            window.location.replace('/myResult?status=403')
            reject()
        })
    })
}
// 处理特定的一级路由和权限路由
const indirectRoutes = ['/examDetail', 'createTest', 'markOnline', '/examOnline']
const roleRoutes = ['/appLayout/user', '/appLayout/courseArr', '/appLayout/systemManage']
if (indirectRoutes.indexOf(window.location.pathname) !== -1 && window.localStorage.getItem('path') !== window.location.pathname) {
    window.location.replace('/appLayout/user')
} else if (roleRoutes.indexOf(window.location.pathname) !== -1) {
    const index = findIndexByKey(guard, 'path', window.location.pathname)
    const roleRouteItem = guard[index]
    const {role} = roleRouteItem
    if (role.indexOf((store.getState().userInfo.roleType) as string) === -1) {
        window.location.replace('/appLayout/user')

    }
}


function Root() {
    return (
        <div className='root'>
            <App></App>
        </div>
    )
}

export default Root
