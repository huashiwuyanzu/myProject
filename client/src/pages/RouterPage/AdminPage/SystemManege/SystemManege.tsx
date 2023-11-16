import React, {useEffect, useState} from "react";
import {Table, Card, Divider, Pagination, Space, Popconfirm, Modal, Dropdown} from "antd";
import {getTime, roleTypeMap} from "@/utils/util.ts";
import {getPageUser, registerUser, updateUser} from "@/api/user_api.ts";
import type {MenuProps} from 'antd';
import {deleteSingle} from "@/api/user_api.ts";
import {$message} from "@/utils/render.tsx";
import FormComponent from "@/Component/FormComponent.tsx";
import {radiosAboutRoleType, WidthForCommonModal, WidthForFormInModal} from "@/configs/globalStyle/config.ts";
import {UserAddOutlined, FormOutlined, DownOutlined} from '@ant-design/icons';
import {addSingle, deleteSingleCourse, getPageCourseByAdmin} from "@/api/course_api.ts";

const {Column} = Table


const items: MenuProps['items'] = [
    {
        key: 'user',
        label: (
            <a className='a__action'>用户管理</a>
        ),
        icon: <UserAddOutlined/>
    },
    {
        key: 'course',
        label: (
            <a className='a__action'>课程管理</a>
        ),
        icon: <FormOutlined/>,
    },
];


interface user {
    id: number,
    key?: string,
    roleType: string,
    userId: string,
    userName: string,
    userPicture: null | string
}

interface Course {
    userName: string,
    key?: string,
    userPicture: string,
    courseId: string,
    courseName: string,
    courseIntroduction: string,
    startYear: string,
    endYear: string,
    invitationCode: string
}

// 账号列表
function useUserList(
    getUserList: any,
    pageNumber: number,
    pageSize: number
) {
    // 删除单个用户
    const handleDelete = function (userId: string): void {
        const params = {userId}
        deleteSingle(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '删除成功')
                getUserList({
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                })
            } else {
                $message('error', '操作失败，请重试')
            }
        }).catch(() => {
            $message('error', '操作失败')
        })
    }
    // 重置密码
    const resetPassword = function (userId: string): void {
        updateUser({userId, password: '123asdASD'}).then((res: any) => {
            if (res.code === 0) {
                $message('success', '重置成功')
            } else {
                $message('error', '操作失败，请重试')
            }
        })
    }
    return {handleDelete, resetPassword}
}

function useCourseList(
    getCourseList: any,
    pageNumber: number,
    pageSize: number
) {
    // 删除单个课程
    const handleDeleteCourse = function (courseId: string): void {
        const params = {courseId}
        deleteSingleCourse(params).then((res: any) => {
            if (res.code === 0) {
                getCourseList({
                    roleType: 3,
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                })
                $message('success', '删除成功')
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        }).catch(() => {
            $message('error', '操作失败')
        })
    }
    return {handleDeleteCourse}
}

// 修改用户信息-注册新账号的表单
function useEditForm(
    getUserList: any,
    setVisualForForm: React.Dispatch<any>,
    setParamsForForm: React.Dispatch<any>,
    setModalTitle: React.Dispatch<string>,
    pageNumber: number,
    pageSize: number,
) {
    let userIdBeRecorded: undefined | string = undefined
    // 提交修改
    const submitHandler = function (value: Record<string, string | number>): void {
        const {roleType, userName} = value
        const params = {
            userId: userIdBeRecorded as string,
            roleType,
            userName
        }
        updateUser(params).then((res: any) => {
            if (res.code === 0) {
                getUserList({
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                })
                $message('success', '修改成功')
                userIdBeRecorded = undefined
                setVisualForForm(false)
            } else {
                $message('error', '操作失败，请重试')
            }
        })
    }
    // 提交注册
    const addHandler = function (value: Record<string, string | number>): void {
        const {roleType, userName, userId} = value
        const params = {
            userId,
            userName,
            roleType
        }
        registerUser(params).then((res: any) => {
            if (res.code === 0) {
                getUserList()
                $message('success', '注册成功')
                userIdBeRecorded = undefined
                setVisualForForm(false)
            } else {
                $message('error', '操作失败，' + res.message)
            }
        })
    }
    // 关闭表单
    const cancleHandler = function (): void {
        userIdBeRecorded = undefined
        setVisualForForm(false)
    }
    // 打开修改表单
    const openEditForm = function (record: user): void {
        setModalTitle('编辑用户信息')
        const options = {
            width: WidthForFormInModal,
            submitButton: {
                text: '修改',
                clickHandler: submitHandler
            },
            cancleButton: {
                clickHandler: cancleHandler
            },
            Inputs: [
                {
                    name: 'userName',
                    initialValue: record.userName,
                    label: '用户名称',
                    allowClear: true,
                    isRequire: true,
                }
            ],
            Radios: [
                {
                    name: 'roleType',
                    initialValue: record.roleType,
                    label: '账号身份',
                    isRequire: true,
                    options: radiosAboutRoleType
                }
            ]
        }
        userIdBeRecorded = record.userId
        setParamsForForm(options)
        setVisualForForm(true)
    }
    // 打开注册表单
    const openAddForm = function (): void {
        setModalTitle('注册新用户')
        const options = {
            width: WidthForFormInModal,
            submitButton: {
                text: '注册',
                clickHandler: addHandler
            },
            cancleButton: {
                clickHandler: cancleHandler
            },
            Inputs: [
                {
                    name: 'userId',
                    label: '账号Id',
                    allowClear: true,
                    isRequire: true,
                    message: '账号Id应为6位英文字母',
                    regularArr: [/^[a-zA-z]{6}$/]
                },
                {
                    name: 'userName',
                    label: '账号名称',
                    allowClear: true,
                    isRequire: true,
                },
            ],
            Radios: [
                {
                    name: 'roleType',
                    label: '账号身份',
                    isRequire: true,
                    options: radiosAboutRoleType
                }
            ]
        }
        setParamsForForm(options)
        setVisualForForm(true)
    }
    return {cancleHandler, submitHandler, openEditForm, openAddForm}
}

// 修改课程信息-新增课程的表单
function useCourseForm(
    getCourseList: any,
    setVisualForForm: React.Dispatch<any>,
    setParamsForForm: React.Dispatch<any>,
    setModalTitle: React.Dispatch<string>,
) {
    // 提交新增课程
    const addHandler = function (value: Record<string, string>): void {
        const params = {
            courseName: value.courseName,
            userId: value.userId,
            courseIntroduction: value.courseIntroduction,
            startYear: value.schoolTime[0].valueOf(),
            endYear: value.schoolTime[1].valueOf()
        }
        addSingle(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '新建成功')
                getCourseList({roleType: 3})
                setVisualForForm(false)
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }
    // 打开新增课程的表单
    const addCourse = function (): void {
        setModalTitle('新增课程')
        const options = {
            width: WidthForFormInModal,
            submitButton: {
                text: '新增',
                clickHandler: addHandler
            },
            Inputs: [
                {
                    name: 'courseName',
                    label: '课程名称',
                    allowClear: true,
                    isRequire: true,
                    maxLength: 20,
                },
                {
                    name: 'userId',
                    label: '任课教师Id',
                    allowClear: true,
                    isRequire: true,
                    regularArr: [/^[a-zA-z]{6}$/],
                    message: '账号Id应为6位英文字母',
                }
            ],
            TextAreas: [
                {
                    name: 'courseIntroduction',
                    label: '课程简介',
                    allowClear: true,
                    isRequire: true,
                    maxLength: 200,
                    showCount: true,
                    autoSize: {minRows: 3, maxRows: 8},
                }
            ],
            RangeDates: [
                {
                    name: 'schoolTime',
                    label: '开始学年与结束学年',
                    isRequire: true,
                    picker: 'year'
                }
            ]
        }
        setParamsForForm(options)
        setVisualForForm(true)
    }

    return {addCourse}
}

function SystemManege() {
    const [userList, setUserList] = useState<Array<user>>([])
    const [courseList, setCourseList] = useState<Array<Course>>([])
    const [lengthOfUserList, setLengthOfUserList] = useState(10)
    const [lengthOfCourseList, setLengthOfCourseList] = useState(10)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [visualForForm, setVisualForForm] = useState(false)
    const [paramsForForm, setParamsForForm] = useState<undefined | Record<string, any>>(undefined)
    const [mode, setMode] = useState<string>('user')
    const [modalTitle, setModalTitle] = useState<undefined | string>(undefined)
    const [currentPage, setCurrentPage] = useState<number>(1)
    // 页面切换
    const paginationHandle = function (page_number: number, page_size: number): void {
        setPageNumber(page_number)
        setPageSize(page_size)
        setCurrentPage(page_number)
        const params: Record<string, string | number> = {
            offset: (page_number - 1) * page_size,
            limit: page_size,
            orderType: 'asc',
            orderBy: 'id',
        }
        if (mode === 'user') {
            getUserList(params);
        } else if (mode === 'course') {
            params.roleType = 3
            getCourseList(params)
        }
    }
    // 获取数据
    const getUserList = function (params: {
        orderBy?: string,
        orderType?: string,
        offset?: number,
        limit?: number
    }): void {
        getPageUser(params).then((res: any) => {
            const data: Array<user> = res.data.record.map((item: any) => {
                const option = item
                option.key = option.userId
                option.roleTypeName = roleTypeMap[option.roleType]
                return option
            })
            setUserList(data)
            setLengthOfUserList(res.data.length > 99 ? res.data.length : 100)
        })
    }
    const getCourseList = function (params: {
        orderBy?: string,
        orderType?: string,
        offset?: number,
        limit?: number
    }): void {
        getPageCourseByAdmin(params).then((res: any) => {
            const data: Array<Course> = res.data.record.map((item: any) => {
                const option = item
                option.key = option.courseId
                return option
            })
            setCourseList(data)
            setLengthOfCourseList(res.data.length > 99 ? res.data.length : 100)
        })
    }
    const {
        handleDelete,
        resetPassword
    } = useUserList(getUserList, pageNumber, pageSize)
    const {
        handleDeleteCourse
    } = useCourseList(getCourseList, pageNumber, pageSize)
    const {
        openEditForm,
        cancleHandler,
        openAddForm
    } = useEditForm(getUserList, setVisualForForm, setParamsForForm, setModalTitle, pageNumber, pageSize);
    const {addCourse} = useCourseForm(getCourseList, setVisualForForm, setParamsForForm, setModalTitle)
    // 用户表格
    const userTable = (
        <Table
            bordered
            dataSource={userList}
            pagination={false}
            footer={() => (<a onClick={openAddForm} className='a__action'>添加账号</a>)}
        >
            <Column title="账号Id" dataIndex="userId" key="userId"/>
            <Column title='账号名称' dataIndex='userName' key='userName'></Column>
            <Column title='账号身份' dataIndex='roleTypeName' key='roleTypeName'></Column>
            <Column
                title="操作"
                key="action"
                render={(_, record) => (
                    <Space size="middle">
                        <Popconfirm
                            title="确定重置此账号的密码吗?"
                            cancelText='取消'
                            okText='确认'
                            onConfirm={() => resetPassword((record as user).userId)}
                        ><a className='a__action'>重置密码</a>
                        </Popconfirm>
                        <Divider type="vertical"/>
                        <a
                            onClick={() => {
                                openEditForm(record as user)
                            }}
                            className='a__action'
                        >编辑信息</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="确定删除此账号吗?"
                            cancelText='取消'
                            okText='确认'
                            onConfirm={() => handleDelete((record as user).userId)}
                        ><a className='a__action__danger'>删除账户</a>
                        </Popconfirm>
                    </Space>
                )}
            />
        </Table>
    )


    // 课程表格
    const courseTable = (
        <Table
            bordered
            dataSource={courseList}
            pagination={false}
            footer={() => (<a onClick={addCourse} className='a__action'>新增课程</a>)}
        >
            <Column title="课程编号" dataIndex="courseId" key="courseId"/>
            <Column title="邀请码" dataIndex="invitationCode" key="invitationCode"/>
            <Column title='课程名称' dataIndex='courseName' key='courseName'></Column>
            <Column title='负责教师' dataIndex='userName' key='userName'></Column>
            <Column
                title="开课学年"
                key="schoolTime"
                render={(_, record) => (
                    <div>{`${getTime((record as any).startYear, 'year')}-${getTime((record as any).endYear, 'year')}`}</div>)}
            />
            <Column
                title="操作"
                key="action"
                render={(_, record) => (
                    <Space size="middle">
                        <Popconfirm
                            title="确定刷新此课程的邀请码吗?"
                            cancelText='取消'
                            okText='确认'
                            onConfirm={() => 1}
                        ><a className='a__action'>刷新邀请码</a>
                        </Popconfirm>
                        <Divider type="vertical"/>
                        <a className='a__action'>编辑信息</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="确定删除此课程吗?"
                            cancelText='取消'
                            okText='确认'
                            onConfirm={() => {
                                handleDeleteCourse((record as any).courseId)
                            }}
                        ><a className='a__action__danger'>删除课程</a>
                        </Popconfirm>
                    </Space>
                )}
            />
        </Table>
    )
    // 模块切换
    const onClick: MenuProps['onClick'] = ({key}) => {
        setCurrentPage(1)
        setPageNumber(1)
        setPageSize(10)
        if (key === 'user') {
            getUserList({})
        } else if (key === 'course') {
            getCourseList({})
        }
        setMode(key)
    };
    // created
    useEffect(() => {
        getUserList({})
        getCourseList({})
    }, [])
    return (
        <div className='userManage'>
            {/*编辑用户信息*/}
            <Modal
                title={modalTitle}
                open={visualForForm}
                onCancel={cancleHandler}
                footer={null}
                centered
                width={WidthForCommonModal}
            ><FormComponent formOptions={paramsForForm as undefined}></FormComponent>
            </Modal>
            {/*用户-课程列表*/}
            <Card
                title={
                    (<Dropdown menu={{items, onClick}}>
                        <a onClick={(e) => e.preventDefault()} className='a__action'>
                            <Space>模块选择<DownOutlined/></Space>
                        </a>
                    </Dropdown>)
                }
            >
                {mode === 'user' ? userTable : courseTable}
                <Pagination
                    total={mode === 'user' ? lengthOfUserList : lengthOfCourseList}
                    current={currentPage}
                    defaultPageSize={10}
                    style={{marginTop: '40px'}}
                    onChange={paginationHandle}
                />
            </Card>
        </div>
    )
}

export default SystemManege
