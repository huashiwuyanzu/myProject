import {useEffect, useState} from "react";
import {
    Table,
    Card,
    Avatar,
    Row,
    Col,
    Drawer,
    Tag,
    Typography,
    Tooltip,
    Modal,
    Empty,
    Button,
    Popconfirm,
    Image,
    Divider
} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import store from "@/redux/store.ts";
import {addSingle, getPageCourse, updateCourse, updateCoursePicture} from "@/api/course_api.ts";
import {
    WidthForCommonDrawer, WidthForCommonModal,
    WidthForFormInDrawer,
} from "@/configs/globalStyle/config.ts";
import {getTime} from "@/utils/util.ts";
import {collectTestByTeacher, getPageTestByStudent, getPageTestByTeacher} from "@/api/test_api.ts";
import FormComponent from "@/Component/FormComponent.tsx";
import {$message} from "@/utils/render.tsx";
import globalCss from '@/configs/globalStyle/global.module.css'
import {useNavigate} from "react-router-dom";
import './CourseArr.scss'

const {Title, Paragraph} = Typography;
const {Column} = Table
const {Meta} = Card

interface CourseInfo {
    courseId: string,
    courseIntroduction: string,
    courseName: string,
    endYear: string,
    startYear: string,
    invitationCode: string,
    userPicture: string,
    coursePicture: string,
    userName: string
}

interface TestInfo {
    testName: string,
    startTime: string,
    endTime: string,
    totalScore: string
}

function useStudent() {
    // 开始考试
    const toExamOnline = function (testId: string, courseName: string) {
        window.open(`http://localhost:5173/examOnline?testId=${testId}&courseName=${courseName}`, '_blank')
    }
    return {toExamOnline}
}

function useTeacher(
    courseInfo: any,
    getTestList: any
) {
    // 发布测试
    const toCreateTest = function (courseId: string, courseName: string) {
        window.open(`http://localhost:5173/createTest?courseId=${courseId}&courseName=${courseName}`, '_blank')
    }
    // 收卷
    const collectTest = function (testId: string) {
        const params = {testId}
        collectTestByTeacher(params).then((res: any) => {
            if (res.code === 0) {
                getTestList(courseInfo.courseId)
                $message('success', '成功交卷')
            } else {
                $message('error', '操作出错，请稍后重试')
            }
        })
    }
    // 评卷
    const toMarkOnline = function (testId: string) {
        window.open(`http://localhost:5173/markOnline?testId=${testId}`, '_blank')
    }
    return {collectTest, toMarkOnline, toCreateTest}
}

function CourseArr() {
    const {roleType, userId} = store.getState().userInfo
    const [courseList, setCourseList] = useState<Array<CourseInfo> | undefined>(undefined)
    const [courseInfo, setCourseInfo] = useState<CourseInfo | undefined>(undefined)
    const [testList, setTestList] = useState<Array<TestInfo> | undefined>(undefined)
    const [drawerBeRender, setDrawerBeRender] = useState(false)
    const [formDrawerBeRender, setFormDrawerBeRender] = useState(false)
    const [paramsForForm, setParamsForForm] = useState<undefined | Record<string, any>>(undefined)
    const [showModal, setShowModal] = useState<boolean>(false)
    const navigate = useNavigate()

    // 查看考试详情
    const toExamDetail = function (testId: string) {
        navigate(`/examDetail?testId=${testId}&userId=${userId}&roleType=${roleType}`)
    }
    // 获取课程下的考试数据
    const getTestList = function (courseId: string): void {
        const params: Record<string, string | number> = {courseId}
        if (roleType === '教师') {
            getPageTestByTeacher(params).then((res: any) => {
                const data = res.data.record.map((item: any) => {
                    const option = item
                    option.key = item.testId
                    return option
                })
                setTestList(data)
            })
        } else if (roleType === '学生') {
            params.userId = userId as string
            getPageTestByStudent(params).then((res: any) => {
                const data = res.data.record.map((item: any) => {
                    const option = item
                    option.key = item.testId
                    return option
                })
                setTestList(data)
            })
        }
    }
    // 查看课程详情
    const getCourseDetail = function (item: CourseInfo): void {
        setCourseInfo(item)
        getTestList(item.courseId)
        setDrawerBeRender(true)
    }
    // 打开修改课程的表单
    const openFormDrawer = function (courseInfo: CourseInfo): void {
        const formOptions = {
            width: WidthForFormInDrawer,
            Inputs: [
                {
                    name: 'courseId',
                    label: '课程编号',
                    initialValue: courseInfo.courseId,
                    disabled: true
                },
                {
                    name: 'courseName',
                    label: '课程名称',
                    allowClear: true,
                    initialValue: courseInfo.courseName,
                    isRequire: true,
                    maxLength: 20,
                    showCount: true
                },
                {
                    name: 'invitationCode',
                    label: '课程邀请码',
                    allowClear: true,
                    initialValue: courseInfo.invitationCode,
                    isRequire: true,
                    regularArr: [/^[A-Za-z]{6}$/],
                    message: '邀请码应为6个英文字母'
                }
            ],
            TextAreas: [
                {
                    name: 'courseIntroduction',
                    label: '课程简介',
                    allowClear: true,
                    initialValue: courseInfo.courseIntroduction,
                    isRequire: true,
                    maxLength: 200,
                    showCount: true
                }
            ],
            submitButton: {
                text: '确定',
                clickHandler: editHandler,
            },
            cancleButton: {
                text: '返回',
                clickHandler: () => {
                    setFormDrawerBeRender(false)
                }
            }
        }
        setParamsForForm(formOptions)
        setFormDrawerBeRender(true)
    }
    // 修改课程封面
    const submitPicture = function (e: any) {
        if (e.target.files.length === 0) {
            return
        }
        const formData = new FormData()
        const picData = e.target.files[0];
        formData.append('file', picData)
        formData.append('courseId', (courseInfo?.courseId) as string)
        updateCoursePicture(formData).then((res: any) => {
            if (res.code === 0) {
                $message('success', '操作成功')
            } else {
                $message('error', '操作失败，稍后重试')
            }
        })
    }
    // 提交修改课程信息的表单
    const editHandler = function (value: any): void {
        const params = value
        updateCourse(params).then((res: any) => {
            if (res.code === 0) {
                setCourseInfo({...value, userName: courseInfo?.userName})
                getPageCourse({userId: userId as string, roleType: '2'}).then((res: any) => {
                    setCourseList(res.data.record)
                    $message('success', '课程数据更新成功')
                    setFormDrawerBeRender(false)

                })
            } else {
                $message('error', '更新出错，请稍后重试')
            }
        })
    }
    const {toExamOnline} = useStudent()
    const {collectTest, toMarkOnline, toCreateTest} = useTeacher(courseInfo, getTestList)
    // 课程列表
    let cardList;
    if (courseList === undefined || (courseList.length === 0)) {
        cardList = (
            <Empty
                className={globalCss.center}
                style={{minHeight: '90vh', width: '100%'}}
                description={roleType === '教师' ? <div><a onClick={() => {
                    setShowModal(true)
                }}>创建课程</a></div> : '暂未加入课程'}
                image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        )
    } else {
        cardList = courseList?.map((item: CourseInfo) => {
            return (
                <Col md={20} lg={7} xl={7} xxl={5}
                     key={item.courseId} style={{marginTop: '30px'}}>
                    <Card
                        cover={<Image height={170} src={item.coursePicture} style={{objectFit: 'cover'}}/>}
                        actions={[<a onClick={() => {
                            getCourseDetail(item)
                        }}>查看详情</a>]}
                    ><Meta
                        style={{height: '130px'}}
                        avatar={<Avatar src={item.userPicture}/>}
                        title={item.courseName}
                        description={item.courseIntroduction.length > 50 ? item.courseIntroduction.slice(0, 51) + '……' : item.courseIntroduction}/>
                    </Card>
                </Col>
            )
        })
    }
    // 课程详情信息
    let courseDetail;
    if (roleType === '教师') {
        courseDetail = (
            <Drawer
                placement="right"
                open={drawerBeRender}
                width={WidthForCommonDrawer}
                extra={
                    <div>
                        <Button size='small' onClick={() => {
                            openFormDrawer(courseInfo as CourseInfo)
                        }}>修改基本信息</Button>
                        <Divider type='vertical'></Divider>
                        <Button size='small'
                                onClick={() => {
                                    (document.getElementById('picInput') as any).click()
                                }}>封面更改</Button>
                        <input
                            onChange={(e) => {
                                submitPicture(e)
                            }}
                            type='file'
                            id='picInput'
                            style={{display: 'none'}}
                            accept=".jpg, .png, .jpeg"/>
                    </div>
                }
                onClose={() => {
                    setDrawerBeRender(false)
                }}
                title={
                    <div>
                        <Tag color="blue">
                            {`${getTime((courseInfo?.startYear as string), 'year')}-${getTime((courseInfo?.endYear as string), 'year')}`}
                        </Tag>
                        <Tag color="green">课程编码：{courseInfo?.courseId}</Tag>
                        <Tag color="volcano">邀请码：{courseInfo?.invitationCode}</Tag>
                    </div>
                }
            >
                <Typography>
                    <Title level={3}>{`${courseInfo?.courseName}-${courseInfo?.userName}`}</Title>
                    <Paragraph>{courseInfo?.courseIntroduction}</Paragraph>
                </Typography>
                <Table dataSource={testList}
                       pagination={false}
                       bordered
                       title={() => (<span style={{fontWeight: 'bolder'}}>相关测试</span>)}
                       footer={() => (<a className='a__action' onClick={() => {
                           const {courseId, courseName} = courseInfo as CourseInfo
                           toCreateTest(courseId, courseName)
                       }}>发布新测试</a>)}
                       style={{marginTop: '20px'}}
                >
                    <Column title="测试名称" dataIndex="testName" key="testName"/>
                    <Column title='开始时间'
                            key='startTime'
                            render={(item) => (<div>{getTime(item.startTime, 'date')}</div>)}
                    ></Column>
                    <Column title='结束时间'
                            key='endTime'
                            render={(item) => (<div>{getTime(item.endTime, 'date')}</div>)}
                    ></Column>
                    <Column title='提交人数' dataIndex='submitNumber' key='submitNumber'></Column>
                    <Column title='测试总分' dataIndex='totalScore' key='totalScore'></Column>
                    <Column
                        title="操作"
                        key="action"
                        render={(item) => {
                            let action = null;
                            if (item.testStatus === '0' && item.submitNumber !== 0) {
                                action = (
                                    <Popconfirm
                                        onConfirm={() => {
                                            collectTest(item.testId)
                                        }}
                                        title="确认收卷吗？"
                                        description="收卷后，未交卷的学生将无法提交答卷"
                                        okText="确认"
                                        cancelText="取消"
                                        icon={<QuestionCircleOutlined style={{color: 'orange'}}/>}
                                    ><a className='a__action'>收卷</a>
                                    </Popconfirm>
                                )
                            } else if (item.testStatus === '1') {
                                action = (<a className='a__action'
                                             onClick={() => {
                                                 toMarkOnline(item.testId)
                                             }}
                                >改卷</a>)
                            } else if (item.testStatus === '2') {
                                action = (<a className='a__action' onClick={() => {
                                    toExamDetail(item.testId)
                                }}>查看详情</a>)
                            } else {
                                action = (
                                    <Tooltip title="暂无学生提交">
                                        <div>
                                            <a className={globalCss.disabledA}>收卷</a>
                                        </div>
                                    </Tooltip>
                                )
                            }
                            return action
                        }}
                    />
                </Table>
            </Drawer>
        )
    } else if (roleType === '学生') {
        courseDetail = (
            <Drawer
                placement="right"
                open={drawerBeRender}
                width={WidthForCommonDrawer}
                onClose={() => {
                    setDrawerBeRender(false)
                }}
                title={
                    <div>
                        <Tag color="blue">
                            {`${getTime((courseInfo?.startYear as string), 'year')}-${getTime((courseInfo?.endYear as string), 'year')}`}
                        </Tag>
                        <Tag color="green">课程编码：{courseInfo?.courseId}</Tag>
                    </div>
                }
            >
                <Typography>
                    <Title level={3}>{`${courseInfo?.courseName}-${courseInfo?.userName}`}</Title>
                    <Paragraph>{courseInfo?.courseIntroduction}</Paragraph>
                </Typography>
                <Table dataSource={testList}
                       pagination={false}
                       bordered
                       title={() => (<span style={{fontWeight: 'bolder'}}>相关测试</span>)}
                       style={{marginTop: '20px'}}
                >
                    <Column title='测试名称'
                            key='testName'
                            dataIndex='testName'
                    ></Column>
                    <Column title='开始时间'
                            key='startTime'
                            render={(item) => (<div>{getTime(item.startTime, 'date')}</div>)}
                    ></Column>
                    <Column title='结束时间'
                            key='endTime'
                            render={(item) => (<div>{getTime(item.endTime, 'date')}</div>)}
                    ></Column>
                    <Column title='测试总分' dataIndex='totalScore' key='totalScore'></Column>
                    <Column title='我的分数'
                            key='totalScore'
                            render={(item) => {
                                if (item.taskStatus === "1") {
                                    return <div style={{color: '#1EC771B7'}}>{item.score}</div>
                                } else {
                                    return <a className={globalCss.disabledA}>无成绩</a>
                                }
                            }}
                    ></Column>
                    <Column title='状态'
                            key='status'
                            render={(item) => {
                                if (item.taskStatus === -1 && item.testStatus === "0") {
                                    return <a className='a__action' onClick={() => {
                                        toExamOnline(item.testId, courseInfo?.courseName as string)
                                    }}>开始考试</a>
                                } else if (item.taskStatus === "0") {
                                    return <a className={globalCss.disabledA}>教师评卷中</a>
                                } else if (item.taskStatus === "1") {
                                    return <a className='a__action' onClick={() => {
                                        toExamDetail(item.testId)
                                    }}>查看详情</a>
                                } else {
                                    return <a className={globalCss.disabledA}>已结束</a>
                                }
                            }}
                    ></Column>
                </Table>
            </Drawer>
        )
    }

    // 获取课程列表
    const getCourseList = function () {
        const params: Record<string, string | number> = {}
        if (roleType as string === '教师' || roleType as string === '学生') {
            params.userId = userId as string
            params.roleType = roleType === '教师' ? 2 : 1
        }
        getPageCourse(params).then((res: any) => {
            setCourseList(res.data.record)
        })
    }
    // 创建新课程
    const createNewCourse = function (value: any) {
        const params = {
            courseName: value.courseName,
            courseIntroduction: value.courseIntroduction,
            startYear: value.rangeDate[0].valueOf(),
            endYear: value.rangeDate[1].valueOf(),
            userId,
        }
        addSingle(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '创建成功')
                getCourseList()
                setShowModal(false)
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }
    // created
    useEffect(() => {
        getCourseList()
    }, [])
    return (
        <div className='courseArr'>
            {/*创建课程的表单*/}
            <Modal
                title='新建课程'
                open={showModal}
                footer={null}
                centered
                width={WidthForCommonModal}
                onCancel={() => {
                    setShowModal(false)
                }}
            >
                <FormComponent
                    formOptions={{
                        submitButton: {
                            text: '创建',
                            clickHandler: (value) => {
                                createNewCourse(value)
                            },
                        },
                        cancleButton: {
                            text: '取消',
                            clickHandler: () => {
                                setShowModal(false)
                            }
                        },
                        Inputs: [
                            {
                                name: 'courseName',
                                label: '课程名称',
                                allowClear: true,
                                isRequire: true,
                            },
                        ],
                        TextAreas: [
                            {
                                name: 'courseIntroduction',
                                label: '课程简介',
                                rows: 7,
                                maxLength: 200,
                                showCount: true,
                                allowClear: true,
                                isRequire: true,
                            },
                        ],
                        RangeDates: [
                            {
                                name: 'rangeDate',
                                label: '开始-结束学年',
                                isRequire: true,
                                picker: 'year'
                            }
                        ]
                    }}
                ></FormComponent>
            </Modal>
            {/*修改课程消息*/}
            <Drawer
                placement="right"
                open={formDrawerBeRender}
                width={WidthForCommonDrawer}
                title={<div>修改课程信息</div>}
                onClose={() => {
                    setFormDrawerBeRender(false)
                }}
            >
                <FormComponent formOptions={paramsForForm as undefined}></FormComponent>
            </Drawer>
            {/*课程详情信息*/}
            {courseDetail}
            {/*课程数据*/}
            <Row justify={"space-around"} className='courseList'>
                {cardList}
                <Col md={20} lg={7} xl={7} xxl={5} style={{marginTop: '30px'}}>
                    {roleType === '教师' ?
                        <Card
                            cover={<div style={{height: 170}}></div>}
                        >
                            <Empty
                                style={{height: 170}}
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                description={<a
                                    onClick={() => {
                                        setShowModal(true)
                                    }}>新建课程</a>}
                            >
                            </Empty>
                        </Card> : null
                    }
                </Col>
                <Col md={20} lg={7} xl={7} xxl={5} style={{marginTop: '30px'}}></Col>
                <Col md={20} lg={7} xl={7} xxl={5} style={{marginTop: '30px'}}></Col>
            </Row>
        </div>
    )

}

export default CourseArr;
