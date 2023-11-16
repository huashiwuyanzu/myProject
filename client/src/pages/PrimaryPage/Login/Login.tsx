import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input} from 'antd';
import {login} from "@/api/auth_api.ts"
import {$message, $notification} from "@/utils/render.tsx";
import './Login.scss'
import {getSingleUser} from "@/api/user_api.ts";
import store from "@/redux/store.ts";
import {changeUserInfo} from '@/redux/actions.ts'
import {roleTypeMap, verificateStr} from "@/utils/util.ts";
// 表单字段
type formValue = {
    userId: string,
    password: string
}
// 校验结果
type verificationResults = {
    status: 'error' | undefined,
    msg: string | undefined,
}
// 表单布局
const tailLayout = {
    wrapperCol: {offset: 4, span: 18},
};

// 密码正则校验
function verificatePassword(password: string | undefined) {
    if (password === undefined) {
        return false
    }
    const regularArr = [
        /^[0-9a-zA-Z]{6,12}$/,
        /[0-9]/,
        /[a-z]/,
        /[A-Z]/,
    ]
    return verificateStr(password, regularArr)
}


function Login() {
    const [form] = Form.useForm()
    // 用户名和密码的校验结果
    const [verificationResults_1, setVerificationResults_1] = useState<verificationResults>({
        status: undefined,
        msg: undefined
    })
    const [verificationResults_2, setVerificationResults_2] = useState<verificationResults>({
        status: undefined,
        msg: undefined
    })
    const navigate = useNavigate()


    // 登录
    function summitHanler(value: formValue) {
        const {userId, password} = value
        if (userId === '' || userId === undefined) {
            setVerificationResults_1({
                status: 'error',
                msg: '账号必填'
            })
            return
        } else if (!verificatePassword(password)) {
            setVerificationResults_2({
                status: 'error',
                msg: '密码应为6~12位大小写字母和数字组成'
            })
        } else {
            setVerificationResults_1({
                status: undefined,
                msg: ''
            })
            setVerificationResults_2({
                status: undefined,
                msg: ''
            })
            login(value).then((res: any) => {
                if (res.code === 0) {
                    window.localStorage.setItem('token', res.data.tokenStr)
                    getSingleUser({userId}).then(res => {
                        const userInfo = res.data.userInfo
                        userInfo.roleType = roleTypeMap[userInfo.roleType]
                        store.dispatch(changeUserInfo(userInfo))
                        navigate('/appLayout/user', {
                            replace: true,
                        })
                    })
                } else {
                    $message('error', res.message)
                }
            })
        }
    }


    return (
        <div className='login'>
            <h1>西一宿舍教评系统</h1>
            <Form
                form={form}
                className='antd--form'
                name="control-hooks"
                onFinish={summitHanler}
            >
                <Form.Item
                    name="userId"
                    validateStatus={verificationResults_1.status}
                    help={verificationResults_1.msg}
                    className='antd--form__item'
                >
                    <Input placeholder='请输入用户Id' allowClear/>
                </Form.Item>
                <Form.Item
                    name="password"
                    validateStatus={verificationResults_2.status}
                    help={verificationResults_2.msg}
                    className='antd--form__item'
                >
                    <Input placeholder='请输入密码' allowClear/>
                </Form.Item>
                <Form.Item {...tailLayout} className='antd--form__item'>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    <Button
                        style={{marginLeft: "10px"}}
                        htmlType="button"
                        onClick={() => {
                            form.resetFields()
                        }}>
                        重置
                    </Button>
                    <Button
                        style={{marginLeft: "10px"}}
                        type="link"
                        htmlType='button'
                        onClick={() => {
                            $notification('如需找回密码或注册新用户，请联系管理员进行操作')
                        }}
                    >
                        忘记密码/注册
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
