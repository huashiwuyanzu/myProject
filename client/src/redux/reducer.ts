import constant from './constant.ts'


interface UserInfo {
    id?: undefined | number,
    userId?: undefined | string,
    userName?: undefined | string,
    userPicture?: undefined | string,
    roleType?: undefined | string
}

interface ActionInRedux {
    type: string,
    data: number | string | UserInfo
}

interface State {
    count: number,
    lastPage: string | undefined,
    userInfo: UserInfo
}

const initState: State = {
    count: 1,
    lastPage: undefined,
    userInfo: {
        id: undefined,
        userId: undefined,
        userName: undefined,
        userPicture: undefined,
        roleType: undefined
    },
}

function reducer(preState = initState, action: ActionInRedux)
    : State {
    const {type, data} = action
    switch (type) {
        case constant.ADD_COUNT:
            return {...initState, count: (initState.count as number) + (data as number)}
        case constant.CHANGE_LASTPAGE:
            return {...initState, lastPage: data as string}
        case constant.CHANGE_USERINFO:
            return {...initState, userInfo: data as UserInfo}
        default:
            return preState
    }
}

export default reducer
