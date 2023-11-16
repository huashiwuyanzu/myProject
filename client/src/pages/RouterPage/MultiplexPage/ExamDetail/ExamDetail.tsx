import {
    Card,
    Typography,
    Divider,
    List,
    Avatar,
    Col,
    Row,
    FloatButton,
    Switch,
    Table,
    Dropdown,
    Button,
    Pagination,
    Modal,
    Form,
    Input,
    Progress
} from 'antd'
import {
    EditOutlined,
    NotificationOutlined
} from '@ant-design/icons'
import './ExamDetail.scss'
import {useEffect, useState} from "react";
import * as echarts from 'echarts'
import {
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
} from 'echarts/components';
import {
    ToolboxComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    MarkPointComponent,
} from 'echarts/components';
import {PieChart} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import globalCss from '@/configs/globalStyle/global.module.css'
import {findIndexByKey, getSearchInUrl, topicTypeMap} from "@/utils/util.ts";
import {getSingleTest, getSubmittedTestByTeacher} from "@/api/test_api.ts";
import {$message} from "@/utils/render.tsx";
import {getPageTopic} from "@/api/topic.ts";
import {addSingleByStudent, addSingleByTeacher, getDoubtList, submitReplyByTeacher} from "@/api/doubt_api.ts";
import store from "@/redux/store.ts";

const {TextArea} = Input
const {Column} = Table;
const {Text} = Typography;
echarts.use([
    TitleComponent as any,
    TooltipComponent,
    VisualMapComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);
echarts.use([
    TitleComponent as any,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    MarkPointComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);


let flag = false; // 节流阀

function useViewState() {
    const [testList, setTestList] = useState<Array<any> | undefined>(undefined)
    const [testInfo, setTestInfo] = useState<Record<string, any> | undefined>(undefined)
    const [listForRender, setListForRender] = useState<Array<any> | undefined>(undefined)
    const [mode, setMode] = useState<string>('view')
    // created
    useEffect(() => {
        const search = getSearchInUrl(window.location.href)
        const testId = search.testId
        const params = {testId}
        getSubmittedTestByTeacher(params).then((res: any) => {
            if (res.code === 0) {
                const data = res.data.record.map((item: any) => {
                    const option = item;
                    option.key = item.userId
                    return option
                })
                setTestList(data)
            } else {
                $message('error', '网络繁忙，请稍后重试')
            }
        })
        getSingleTest(params).then((res: any) => {
            if (res.code === 0) {
                setTestInfo(res.data.testInfo)
            } else {
                $message('error', '网络繁忙，请稍后重试')
            }
        })
    }, [])
    // watch
    useEffect(() => {
        setListForRender(testList?.slice(0, 15))
    }, [testList])
    useEffect(() => {
        if (mode !== 'view') {
            return
        }
        const myChartPic = echarts.init(document.getElementById('comprehensivePic'));
        const myChartLine = echarts.init(document.getElementById('comprehensiveLine'));
        const excellentLevel = testInfo?.totalScore * 0.8;
        const goodLevel = testInfo?.totalScore * 0.7;
        const passingLevel = testInfo?.totalScore * 0.6;
        const dataForPic = [
            {value: 0, name: '优秀', weight: 4},
            {value: 0, name: '良好', weight: 3},
            {value: 0, name: '及格', weight: 2},
            {value: 0, name: '不及格', weight: 1},
        ]
        const dataForLine: number[] = []
        let dataForXAxisInLine: Array<any> = [];
        for (let i = 0; i < testInfo?.totalScore; ++i) {
            if (i * 10 <= testInfo?.totalScore) {
                dataForXAxisInLine.push(i * 10);
                dataForLine.push(0);
            } else {
                break;
            }
        }
        dataForXAxisInLine = dataForXAxisInLine.map(item => {
            const startScore = item.toString()
            const endScore = (item + 10).toString()
            return `${startScore}分-${endScore}分`
        })
        testList?.forEach(item => {
            const index = Math.trunc(item.score / 10)
            dataForLine[index] += 1;
            if (item.score >= excellentLevel) {
                dataForPic[0].value += 1;
            } else if (item.score >= goodLevel) {
                dataForPic[1].value += 1;
            } else if (item.score >= passingLevel) {
                dataForPic[2].value += 1;
            } else {
                dataForPic[3].value += 1;
            }
        })
        const optionForPic = {
            title: {
                subtext: '分析结果-1',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '人数',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: dataForPic.sort(function (a, b) {
                        return b.weight - a.weight;
                    }),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        const optionForLine = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dataForXAxisInLine,
            },
            tooltip: {
                trigger: 'axis'
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}人'
                }
            },
            series: [
                {
                    name: '人数',
                    type: 'line',
                    data: dataForLine,
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }
                        ])
                    },
                }
            ],
        }
        myChartPic.setOption(optionForPic)
        myChartLine.setOption(optionForLine)
    }, [testList, testInfo, mode])
    return {testList, testInfo, mode, setMode, listForRender, setListForRender}
}

function useDouptState() {
    const search = getSearchInUrl(window.location.href)
    const [topicList, setTopicList] = useState<Array<any> | undefined>(undefined)
    const [menuItems, setMenuItems] = useState<Array<any>>([
        {
            key: '1',
            label: '判断题',
            children: [],
        },
        {
            key: '2',
            label: '单选题',
            children: [],
        },
        {
            key: '3',
            label: '多选题',
            children: [],
        },
        {
            key: '4',
            label: '填空题',
            children: [],
        },
        {
            key: '5',
            label: '简答题',
            children: [],
        },
    ])
    const [singleTopic, setSingleTopic] = useState<Record<string, any> | undefined>(undefined)
    const [questionList, setQuestionList] = useState<Array<any> | undefined>(undefined)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [topicId, setTopicId] = useState<string | undefined>(undefined)
    const [current, setCuttent] = useState<number>(0)
    const [doubtId, setDoubtId] = useState<undefined | string>(undefined)
    const [form] = Form.useForm();
    const testId = search.testId
    const userId = search.userId
    // 下拉菜单选择题目
    const changeTopic = function (topicId: string) {
        const index = findIndexByKey(topicList as Array<any>, 'topicId', topicId)
        setCuttent(index)
    }
    // 打开评论窗
    const openModal = function (t_Id: string) {
        setTopicId(t_Id)
        setShowModal(true)
    }
    // 关闭评论窗
    const closeModal = function () {
        setShowModal(false)
        form.resetFields()
    }
    // 学生提问|老师单个答复
    const userSubmit = function (value: any) {
        if (value.question !== undefined) {
            const params = {topicId, userId, testId, question: value.question};
            addSingleByStudent(params).then((res: any) => {
                if (res.code === 0) {
                    $message('success', '提交成功')
                    form.resetFields()
                    setShowModal(false)
                    const params = {topicId: ((topicList as any)[current]).topicId}
                    getDoubtList(params).then((res: any) => {
                        setQuestionList(res.data.record)
                    })
                } else {
                    $message('error', '操作失败，请稍后重试')
                }
            })
        } else if (value.reply !== undefined) {
            const params = {doubtId, reply: value.reply}
            submitReplyByTeacher(params).then((res: any) => {
                if (res.code === 0) {
                    $message('success', '提交成功')
                    form.resetFields()
                    setShowModal(false)
                    const params = {topicId: ((topicList as any)[current]).topicId}
                    getDoubtList(params).then((res: any) => {
                        setQuestionList(res.data.record)
                    })
                } else {
                    $message('error', '操作失败，请稍后重试')
                }
            })
        }
    }

    // 教师回复
    const submitReply = function (value: any) {
        setDoubtId(value.doubtId)
        setShowModal(true)
    }
    // watch
    useEffect(() => {
        if (topicList === undefined) {
            return
        } else {
            setSingleTopic(topicList[current])
            const params = {topicId: topicList[current].topicId}
            getDoubtList(params).then((res: any) => {
                setQuestionList(res.data.record)
            })
        }
    }, [current, topicList])
    // created
    useEffect(() => {
        const items = menuItems
        const params = {testId, delete: '1'}
        setCuttent(0)
        getPageTopic(params).then((res: any) => {
            const data = res.data.record
            setTopicList(data)
            data.forEach((item: any) => {
                if (findIndexByKey(items[parseInt(item.topicType) - 1].children, 'key', item.topicId) === -1) {
                    items[parseInt(item.topicType) - 1].children.push({
                        key: item.topicId,
                        label: `第${items[parseInt(item.topicType) - 1].children.length + 1}题`
                    })
                }
            })
            setMenuItems(items)
            getDoubtList({topicId: data[0].topicId}).then((res: any) => {
                setQuestionList(res.data.record)
            })
        })
    }, [])
    return {
        topicList,
        menuItems,
        changeTopic,
        singleTopic,
        form,
        showModal,
        openModal,
        closeModal,
        userSubmit,
        setCuttent,
        current,
        questionList,
        setQuestionList,
        submitReply
    }
}

function ExamDetail() {
    const [roleType] = useState<string>(decodeURI(getSearchInUrl(window.location.href).roleType))
    // 左侧视图逻辑
    const {testInfo, testList, mode, setMode, listForRender, setListForRender} = useViewState()
    // 右侧视图逻辑
    // 统一回复的逻辑
    const [formBottom] = Form.useForm()
    const {
        topicList,
        menuItems,
        changeTopic,
        singleTopic,
        form,
        showModal,
        openModal,
        closeModal,
        userSubmit,
        setCuttent,
        current,
        questionList,
        setQuestionList,
        submitReply
    } = useDouptState()

    const lefView = mode === 'view' ? (
        <Card className='echartBox'>
            <div id='comprehensivePic' style={{height: 450, width: 450}}></div>
            <div id='comprehensiveLine' style={{height: 450, width: 450}}></div>
        </Card>
    ) : (
        <div>
            <Table dataSource={listForRender}
                   pagination={false}
                   bordered
            >
                <Column title='学号' dataIndex='userId' key='userId'></Column>
                <Column title="姓名" dataIndex="userName" key="userName"/>
                <Column title='分数' dataIndex='score' key='score'></Column>
                <Column title='状态' key='status'
                        render={(item) => {
                            if (item.score >= testInfo?.totalScore * 0.6) {
                                return <Text type="success">通过</Text>
                            } else {
                                return <Text type="danger">未通过</Text>
                            }
                        }}
                ></Column>
            </Table>
            <Pagination
                defaultCurrent={1}
                total={testList?.length}
                pageSize={10}
                style={{marginTop: 20}}
                onChange={(page) => {
                    const startIndex = (page - 1) * 15;
                    setListForRender(testList?.slice(startIndex, startIndex + 15));
                }}/>
        </div>
    )

    // 统一回复
    function replyToAll(value: any) {
        const params = {
            reply: value.reply,
            userId: store.getState().userInfo.userId,
            topicId: (topicList as any)[current].topicId,
            testId: getSearchInUrl(window.location.href).testId
        }
        addSingleByTeacher(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '发布成功')
                formBottom.resetFields()
                getDoubtList(params).then((res: any) => {
                    setQuestionList(res.data.record)
                })
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }


    const SwitchComponent = roleType === '教师' ? (<Switch
        checkedChildren="视图"
        unCheckedChildren="列表"
        defaultChecked
        className='tool'
        onChange={() => {
            if (mode === 'view') {
                setMode('list')
            } else {
                setListForRender(testList?.slice(0, 15))
                setMode('view')
            }
        }}/>) : null
    return (
        <Card
            className='examDetail'
            title={<h4>{testInfo?.testName}（总分：{testInfo?.totalScore}）</h4>}
        ><Row gutter={10} className='examDetail__content'>
            {/*提问和回复的表单*/}
            <Modal
                title={roleType === '教师' ? '回复学生' : '我要提问'}
                open={showModal}
                cancelText='取消'
                okText='确认'
                footer={null}
                onCancel={closeModal}
                centered
            >
                <Form form={form}
                      onFinish={(value) => {
                          userSubmit(value)
                      }}
                ><Form.Item
                    name={roleType === '教师' ? 'reply' : 'question'}
                    rules={[{required: true, message: '回复不能为空'}]}
                ><TextArea
                    rows={5}
                    maxLength={200}
                    showCount
                ></TextArea>
                </Form.Item>
                    <Form.Item><Button htmlType='submit' type='primary'>提交</Button></Form.Item>
                </Form>
            </Modal>
            {/*左容器*/}
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className={globalCss.centerAndStart} style={{marginBottom: 22}}>
                    <h4 style={{marginRight: 15}} className='tool'>成绩分析</h4>
                    {SwitchComponent}
                </div>
                {lefView}
            </Col>
            {/*右容器*/}
            <Col xs={0} sm={0} md={0} lg={12} xl={12}>
                <div className={globalCss.centerAndStart} style={{marginBottom: 20}}>
                    <h4 style={{marginRight: 15}} className='tool'>在线答疑</h4>
                    <Dropdown menu={{
                        items: menuItems,
                        onClick: (value) => {
                            changeTopic(value.key)
                        }
                    }} placement="bottomLeft">
                        <Button size='small'>题目选择</Button>
                    </Dropdown>
                    <Button
                        size='small'
                        style={{marginLeft: 10}}
                        type='primary'
                        onClick={() => {
                            if (flag) {
                                return
                            } else {
                                if (current === 0) {
                                    $message('warning', '这是第一题')
                                } else {
                                    setCuttent(current - 1);
                                }
                                flag = true
                                setTimeout(() => {
                                    flag = false
                                }, 1000)
                            }
                        }}
                    >上一题</Button>
                    <Button
                        size='small'
                        style={{marginLeft: 10}}
                        type='primary'
                        onClick={() => {
                            if (flag) {
                                return
                            } else {
                                if (current === (topicList?.length as number) - 1) {
                                    $message('warning', '已经是最后一题了')
                                } else {
                                    setCuttent(current + 1);
                                }
                                flag = true
                                setTimeout(() => {
                                    flag = false
                                }, 1000)
                            }
                        }}
                    >下一题</Button>
                </div>
                <Card style={{marginBottom: 10}}>
                    {singleTopic !== undefined ?
                        (
                            <header>
                                <span>
                                    {
                                        singleTopic.topicType === '4' ?
                                            singleTopic.topicText.replace(/\?/g, '（？）') :
                                            singleTopic.topicText
                                    }
                                </span>
                                <Text style={{marginLeft: 17}} code>题型：{topicTypeMap[singleTopic.topicType]}</Text>
                                <Text code>分值：{singleTopic.score}</Text>
                                <div>
                                    <div style={{
                                        color: '#1EC771B7',
                                        marginRight: 17
                                    }}>正确答案：{singleTopic.topicType === '5' ? '略' : singleTopic.answer}</div>
                                    {roleType === '教师' ?
                                        <div style={{
                                            color: 'orange',
                                            marginRight: 17
                                        }}>
                                            {singleTopic.topicType === '5' ? null : <div>
                                                答对人数：{singleTopic.correctNumber}/{singleTopic.submitNumber}
                                                <Progress size='small'
                                                          percent={(singleTopic.correctNumber / singleTopic.submitNumber) * 100}
                                                          format={() => ``} trailColor='red'/>
                                            </div>}
                                        </div> :
                                        <a style={{color: 'orange', marginRight: 17}}
                                           onClick={() => {
                                               openModal(singleTopic.topicId)
                                           }}>我要提问<EditOutlined/></a>
                                    }
                                </div>
                            </header>) : null
                    }
                    <Divider style={{color: 'gray', fontSize: 13}} orientation='left'>学生提问</Divider>
                    <List
                        itemLayout="horizontal"
                        dataSource={questionList}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.userPicture}/>}
                                    description={
                                        item.taskStatus !== '2' ? (
                                            <div>
                                                <div>
                                                    <Text strong
                                                          style={{marginRight: 10}}>
                                                        {item.userName}
                                                    </Text>{item.question}
                                                    {roleType === '教师' && item.reply === null ?
                                                        <div><a
                                                            style={{color: '#1EC771B7'}}
                                                            onClick={() => {
                                                                submitReply(item)
                                                            }}
                                                        >回复<EditOutlined/></a>
                                                        </div> : null
                                                    }
                                                </div>
                                                <div style={{marginTop: 10}}>
                                                    {item.reply === null ?
                                                        <Text style={{color: 'gray'}}>老师尚未答复</Text> :
                                                        <Text strong>教师回答：{item.reply}</Text>}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div>
                                                    <Text strong
                                                          style={{marginRight: 10}}>
                                                        From_{item.userName}老师
                                                    </Text>{item.question}
                                                </div>
                                                <div style={{marginTop: 10}}>
                                                    <Text mark strong>统一回复：{item.reply}</Text>
                                                </div>
                                            </div>
                                        )
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    <Divider/>
                    {roleType === '教师' ?
                        <Form className={globalCss.bottomAndStart} form={formBottom} onFinish={replyToAll}>
                            <Form.Item name='reply' style={{width: '80%', marginRight: 20}}
                                       rules={[{required: true, message: '回复不能为空'}]}>
                                <TextArea showCount rows={4} maxLength={200}></TextArea>
                            </Form.Item>
                            <Form.Item>
                                <Button type='dashed' htmlType='submit'>统一回复<NotificationOutlined/></Button>
                            </Form.Item>
                        </Form> :
                        null
                    }
                </Card>
            </Col>
        </Row>
            <FloatButton.BackTop visibilityHeight={0}/>
        </Card>
    )


}

export default ExamDetail
