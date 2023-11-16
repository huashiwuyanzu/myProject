import {useEffect, useState} from "react";
import {Result, Button} from "antd";
import {ResultStatusType} from "antd/es/result";
import {getSearchInUrl} from "@/utils/util.ts";
import {useNavigate} from "react-router-dom";
import './MyResult.scss'

const statusMap: Record<string, string> = {
    404: '页面丢失，请稍后重试',
    403: '身份过期，请重新登录',
    500: '服务器错误',
    1: '操作成功'
}
const textMap: Record<string, string> = {
    403: '重新登陆',
    404: '返回首页',
    500: '返回首页',
    1: '返回'
}


function MyResult() {
    const statusInUrl: string = getSearchInUrl(window.location.href).status
    const [status, setStatus] = useState<string>('500')
    const [notice, setNotice] = useState<string>('服务器出错')
    const [textInButton, setTextInButton] = useState<string>('返回首页')
    const navigate = useNavigate()
    useEffect(() => {
        if (statusInUrl === '1') {
            setStatus('success')
        } else if (statusInUrl === '404' || statusInUrl === '403') {
            setStatus(statusInUrl)
        } else {
            setStatus('500')
        }
        setNotice(statusMap[statusInUrl])
        setTextInButton(textMap[statusInUrl])
    }, [status])

    // 跳转回响应的页面
    function handleError() {
        console.log(statusInUrl)
        if (statusInUrl === '403') {
            navigate('/login')
        }
        if (statusInUrl === '1') {
            navigate('/appLayout/courseArr', {
                replace: true
            })
        }
    }

    return (
        <div className='error'>
            <Result
                status={status as ResultStatusType}
                title={status}
                subTitle={notice}
                extra={<Button type="primary" onClick={handleError}>{textInButton}</Button>}
            />
        </div>
    )
}

export default MyResult
