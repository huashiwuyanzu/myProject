import React, {useEffect, useState} from "react";
import {EditOutlined} from "@ant-design/icons"
import {Card, Avatar, Typography, Col, Row, List, Pagination, Badge, Empty, Divider, Modal} from "antd";
import './User.scss'
import store from "@/redux/store.ts";
import {getWelcome, roleTypeMap} from "@/utils/util.ts";
import {getSingleUser, updateUserPicture} from "@/api/user_api.ts";
import {$message} from "@/utils/render.tsx";
import FormComponent from "@/Component/FormComponent.tsx";
import {WidthForCommonModal, WidthForFormInModal} from "@/configs/globalStyle/config.ts";

const welcomeText = getWelcome(new Date().getHours())

// 用户信息
function useUserInfo(
    getUserInfo: any,
    setVisualForForm: React.Dispatch<boolean>,
    setParamsForForm: React.Dispatch<any>
) {
    // 修改用户头像
    const updatePic = function () {
        const Input: any = document.getElementById('picInput')
        Input.click()
    }
    const submitPicture = function (e: any) {
        console.log(222)
        if (e.target.files.length === 0) {
            return
        }
        console.log(111)
        const formData = new FormData()
        const picData = e.target.files[0];
        formData.append('file', picData);
        updateUserPicture(formData).then((res: any) => {
            if (res.code === 0) {
                $message('success', '更新成功')
                getUserInfo()
            }
        })
    }
    // 修改密码
    const resetPassword = function (value: Record<string, string | number>) {
        console.log(value)
        if (value.newPassword !== value.newPasswordSecond) {
            $message('error', '两次输入不一致，请检查')
            return
        }
    }
    const openForm = function () {
        const options = {
            width: WidthForFormInModal,
            submitButton: {
                text: '修改',
                clickHandler: resetPassword
            },
            cancleButton: {
                clickHandler: () => {
                    setVisualForForm(false)
                }
            },
            Inputs: [
                {
                    name: 'oldPassword',
                    label: '旧密码',
                    type: 'password',
                    allowClear: true,
                    isRequire: true,
                },
                {
                    name: 'newPassword',
                    label: '新密码',
                    type: 'password',
                    allowClear: true,
                    isRequire: true,
                    regularArr: [
                        /^[0-9a-zA-Z]{6,12}$/,
                        /[0-9]/,
                        /[a-z]/,
                        /[A-Z]/,
                    ],
                    message: '新密码应为6~12位大小写字母和数字组成'
                },
                {
                    name: 'newPasswordSecond',
                    label: '确定新密码',
                    type: 'password',
                    allowClear: true,
                    isRequire: true,
                }
            ],
        }
        setParamsForForm(options)
        setVisualForForm(true)
    }
    return {updatePic, submitPicture, openForm}
}

function User() {
    const [userInfo, setUserInfo] = useState<Record<string, any>>({})
    const [userCardLoading] = useState(false)
    const [visualForForm, setVisualForForm] = useState(false)
    const [courseList] = useState([
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ])
    const [paramsForForm, setParamsForForm] = useState<Record<string, any> | undefined>(undefined)
    // 获取用户信息
    const getUserInfo = function () {
        getSingleUser({userId: (store.getState().userInfo.userId) as string}).then((res: any) => {
            const data = res.data.userInfo
            data.roleType = roleTypeMap[data.roleType]
            setUserInfo(data)
        })
    }
    const {updatePic, submitPicture, openForm} = useUserInfo(getUserInfo, setVisualForForm, setParamsForForm)


    // 关闭表单
    const cancleHandler = function () {
        setVisualForForm(false)
    }
    // created
    useEffect(() => {
        getUserInfo()
    }, [])

    return (
        <Row className='user' gutter={10}>
            {/*修改密码的表单*/}
            <Modal
                title='修改密码'
                open={visualForForm}
                onCancel={cancleHandler}
                footer={null}
                centered
                width={WidthForCommonModal}
            >
                <FormComponent formOptions={paramsForForm as undefined}></FormComponent>
            </Modal>
            <Col xs={24} sm={24} md={24} lg={24} xl={16} className='user__left'>
                {/*用户信息*/}
                <Card
                    loading={userCardLoading}
                    title='个人信息'
                    bodyStyle={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    className='userinfo-card'
                    extra={
                        (
                            <div className='userinfo-card__edit'>
                                <a className='a__action' onClick={openForm}>修改密码</a>
                                <Divider type='vertical'></Divider>
                                <a className='a__action'
                                   onClick={updatePic}
                                >修改头像<EditOutlined style={{marginLeft: '5px'}}/></a>
                                <input
                                    onChange={(e) => {
                                        submitPicture(e)
                                    }}
                                    type='file'
                                    id='picInput'
                                    style={{display: 'none'}}
                                    accept=".jpg, .png, .jpeg"/>
                            </div>
                        )
                    }
                >
                    <Avatar size={64} src={userInfo.userPicture}/>
                    <div className='userinfo-card__content'>
                        <div className='userinfo-card__content-name'>{welcomeText}：{userInfo.userName}</div>
                        <div className='userinfo-card__content-role'>教评系统：{userInfo.roleType}</div>
                        <Typography.Text>ID：{userInfo.userId}</Typography.Text>
                    </div>
                </Card>
                {/*相关课程*/}
                <Card
                    title='参与课程'
                    className='course-card'
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={courseList}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar
                                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
                    <Pagination
                        className='course-card__pagination'
                        size="small"
                        defaultCurrent={1}
                        total={50}
                    />
                </Card>
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={8} className='user__right'>
                <Badge.Ribbon text='未处理信息：10'>
                    <Card title="消息列表" className='message-card'>
                        <Empty description='没有新的消息'/>
                        <a className='message-card__allread'>全部已读</a>
                    </Card>
                </Badge.Ribbon>
            </Col>
        </Row>
    )
}

export default User
