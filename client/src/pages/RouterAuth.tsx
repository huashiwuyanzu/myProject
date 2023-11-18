import {Navigate} from "react-router-dom";

const token = window.localStorage.getItem('token')

function RouterAuth({children}: any) {
    if (token !== null) {
        return <>{children}</>
    } else {
        return <Navigate to='/login'></Navigate>
    }
}




export {RouterAuth}
