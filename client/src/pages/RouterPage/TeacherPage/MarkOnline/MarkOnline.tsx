import {Col, Layout, Row, Carousel, Button, Form, Typography, Divider, InputNumber, Modal} from "antd";
import {CaretRightOutlined, CaretLeftOutlined} from "@ant-design/icons";
import './MarkOnline.scss'
import {createRef, useEffect, useState} from "react";
import {CarouselRef} from "antd/es/carousel";
import {confirmFinishByTeacher, getLicenseByTeacher, getSingleTest, getSubmittedTestByTeacher} from "@/api/test_api.ts";
import {getSearchInUrl, getTime} from "@/utils/util.ts";
import {getPageTopicByTeacher, saveEditByTeacher} from "@/api/topic.ts";
import {$message} from "@/utils/render.tsx";
import globalCss from '@/configs/globalStyle/global.module.css'
import {useNavigate} from "react-router-dom";

const {Header, Content} = Layout
const search = getSearchInUrl(window.location.href)
const testId = search.testId
const {Text, Paragraph, Title} = Typography
let throttleValve = false // 节流阀

function MarkOnline() {
    const carRef = createRef<CarouselRef>()
    const [testInfo, setTestInfo] = useState<Record<string, any> | undefined>(undefined)
    const [submittedInfo, setSubmittedInfo] = useState<Array<any> | undefined>(undefined)
    const [submittedSingle, setSubmittedSingle] = useState<any>(undefined)
    const [current, setCurrent] = useState<number>(0)
    const [mode, setMode] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<Record<string, any> | undefined>(undefined)
    const [direction, setDirection] = useState<string | undefined>(undefined)
    const [canFinish, setCanFinish] = useState<boolean>(false)
    const [modalBeRender, setModalBeRender] = useState<boolean>(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    // 获取测试数据
    function getTestInfo() {
        getSingleTest({testId}).then(res => {
            const data: Record<string, any> = {}
            data.testName = res.data.testInfo.testName
            data.totalScore = res.data.testInfo.totalScore
            data.testId = res.data.testInfo.testId
            data.submitNumber = res.data.testInfo.submitNumber
            data.updateTime = res.data.testInfo.updateTime
            setTestInfo(data)
        })
    }

    // 提交的学生的数据
    function getSubmitted() {
        const params = {testId}
        getSubmittedTestByTeacher(params).then((res: any) => {
            setSubmittedInfo(res.data.record)
            const options: Record<string, any> = {};
            for (let i = 0; i < res.data.record.length; ++i) {
                const item = res.data.record[i];
                options[item.userId] = {};
            }
            setInitialValues(options)
        })
    }

    // 获取单个学生的数据
    function getSingleSubmit() {
        const params = {testId, userId: (submittedInfo as any)[current].userId}
        getPageTopicByTeacher(params).then(((res: any) => {
            const replyMap: any = {
                trueOrFalse: [],
                choiceSingle: [],
                choiceMany: [],
                fallInBlank: [],
                shortAnswer: [],
                objectiveQuestionScore: 0,
                objectiveQuestionPoint: 0,
            }
            const replyList = res.data.record
            const initialOptions = initialValues
            replyList.forEach((item: any) => {
                if (item.topicType !== '5') {
                    replyMap.objectiveQuestionScore += item.score;
                    replyMap.objectiveQuestionPoint += item.point;
                }
                if (item.topicType === '1') {
                    replyMap.trueOrFalse.push(item)
                } else if (item.topicType === '2') {
                    replyMap.choiceSingle.push(item)
                } else if (item.topicType === '3') {
                    replyMap.choiceMany.push(item)
                } else if (item.topicType === '4') {
                    replyMap.fallInBlank.push(item)
                } else if (item.topicType === '5') {
                    replyMap.shortAnswer.push(item)
                    const {topicId} = item
                    const options = (initialOptions as any)[(submittedInfo as any)[current].userId]
                    if (options[topicId] === undefined) {
                        options[topicId] = item.point === 0 ? undefined : item.point;
                    }
                    (initialOptions as any)[(submittedInfo as any)[current].userId] = options
                    setInitialValues(initialOptions)
                }
            })
            setSubmittedSingle(replyMap)
        }))
    }


    // 开始评卷
    function startWork() {
        getSingleSubmit()
        setMode(true);
    }

    // 下一张试卷
    function nextTest() {
        if (throttleValve) {
            return
        } else {
            const maxIndex = (submittedInfo?.length) as number - 1
            if (current === maxIndex) {
                $message('warning', '已经是最后一张试卷了')
            } else {
                const initialOptions = initialValues
                if (initialOptions !== undefined && submittedInfo !== undefined) {
                    initialOptions[submittedInfo[current].userId] = form.getFieldsValue();
                    setInitialValues(initialOptions)
                }
                setCurrent(current + 1);
                setDirection('next')
            }
            throttleValve = true;
            setTimeout(() => {
                throttleValve = false
            }, 700)
        }
    }

    // 上一张试卷
    function lastTest() {
        if (throttleValve) {
            return
        } else {
            if (current === 0) {
                $message('warning', '这是第一张试卷')
            } else {
                const initialOptions = initialValues
                if (initialOptions !== undefined && submittedInfo !== undefined) {
                    initialOptions[submittedInfo[current].userId] = form.getFieldsValue();
                    setInitialValues(initialOptions)
                }
                setCurrent(current - 1);
                setDirection('prev')
            }
            throttleValve = true;
            setTimeout(() => {
                throttleValve = false
            }, 700)
        }
    }

    // watch
    useEffect(() => {
        if (submittedInfo !== undefined) {
            getSingleSubmit()
            if (direction === 'next') {
                carRef.current?.next()
            } else if (direction === 'prev') {
                carRef.current?.prev()
            }
        }
    }, [current])


    // 保存修改
    function saveEdit() {
        const pointList = [];
        for (const key in initialValues) {
            const userId = key;
            const item = initialValues[key];
            for (const Key in item) {
                const topicId = Key;
                const point = item[Key];
                if (point !== null && point !== undefined) {
                    const pointItem = {userId, topicId, point};
                    pointList.push(pointItem)
                }
            }
        }
        for (const key in form.getFieldsValue()) {
            if (form.getFieldsValue()[key] !== undefined && form.getFieldsValue()[key] !== null) {
                const point = form.getFieldsValue()[key];
                const topicId = key;
                const userId = (submittedInfo as any)[current].userId
                const pointItem = {userId, topicId, point}
                let flag = false;
                for (let i = 0; i < pointList.length; ++i) {
                    if (pointList[i].userId === userId && pointList[i].topicId === topicId) {
                        pointList[i].point = point;
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    pointList.push(pointItem)
                }
            }
        }
        const params = {testId, pointList}
        saveEditByTeacher(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '保存成功')
                setCanFinish(true)
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }

    // 准备提交
    function finish() {
        getLicenseByTeacher({testId}).then((res: any) => {
            if (res.code === 0) {
                setModalBeRender(true)
            } else {
                $message('error', '存在为保存的评分数据，请检查并保存')
            }
        })
    }

    // 确认提交
    function confirmSubmission() {
        const params = {testId};
        confirmFinishByTeacher(params).then((res: any) => {
            if (res.code === 0) {
                navigate('/myResult?status=1', {
                    replace: true
                })
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }

    // created
    useEffect(() => {
        getTestInfo()
        getSubmitted()
    }, [])

    // 改卷须知
    const noticView = (
        <Typography style={{paddingTop: 50}} className='markOnline__content'>
            <Title level={3}>《评卷须知》</Title>
            <Title level={5}>考试名称：{testInfo?.testName}</Title>
            <Title level={5}>考试总分：{testInfo?.totalScore}</Title>
            <Title level={5}>交卷人数：{testInfo?.submitNumber}</Title>
            <Title level={5}
                   mark>上次保存时间：{testInfo?.updateTime === null ? '无保存记录' : getTime(testInfo?.updateTime, 'minute')}</Title>
            <Paragraph>
                关于在线评卷功能，判断、单（多）选题、填空题已在系统后台自动评分，评卷老师为简答题（主观题）评分即可。
            </Paragraph>
            <Paragraph>
                评卷过程中请勿退出此页面，否则会导致已打分的题目的分数丢失。若需中途暂停工作，请点击页面右上角“保存”后再关闭此页面。
                若非必须，请勿在评卷过程中刷新此页面，系统初版本尚未提供临时保存功能。
                每次当您切换试卷的时候，在上一张做的评分会被缓存起来，不会因为切换试卷而消失。但是切记在离开此页面前保存您做的评分或者提交所有评分。
            </Paragraph>
            <Paragraph>
                一旦确认完成无法再修改考试成绩！在确认提交前请评卷老师仔细检查是否有遗漏。
            </Paragraph>
            <Paragraph>
                若发现数据有误或需修改已提交的评分结果，请及时联系系统管理员进行修改。
            </Paragraph>
            <div>
                <a className="a__action" onClick={startWork}>开始评卷</a>
                <Divider type="vertical"></Divider>
                <a className="a__action">从空记录处开始</a>
            </div>
        </Typography>
    )

    // 改卷区
    const shortAnswerList = submittedSingle === undefined ? null : submittedSingle.shortAnswer.map((item: any) => {
        let initialPoint
        // form.resetFields();
        if (initialValues !== undefined && submittedInfo !== undefined) {
            initialPoint = initialValues[submittedInfo[current].userId][item.topicId]
            form.setFieldValue(item.topicId as string, initialPoint)
        } else {
            initialPoint = undefined
        }
        return (
            <Paragraph key={item.id}>
                <Text mark style={{marginRight: 5}}>简答题</Text>
                <Text>{item.topicText}</Text>
                <Text keyboard>题目分数：{item.score}</Text>
                <div></div>
                <Text strong>学生作答：<Text underline>{item.reply}</Text></Text>
                <Form.Item label='请评分' name={item.topicId as undefined} initialValue={initialPoint}
                ><InputNumber min={1} max={item.score} size='small' key={item.topicIdt}/></Form.Item>
            </Paragraph>
        )
    })
    const trueOrFalseList = submittedSingle === undefined ? null : submittedSingle.trueOrFalse.map((item: any, index: number) => (
        <Paragraph style={{marginLeft: 5}} key={item.id}>
            <Text strong>题目{index + 1}：</Text>
            <Text>{item.topicText}</Text>
            <Text keyboard>正确答案：{item.answer}</Text>
            <Text keyboard>学生答案：{item.reply}</Text>
            <Text keyboard strong>学生得分：{item.point}/{item.score}</Text>
        </Paragraph>
    ))
    const choiceSingleList = submittedSingle === undefined ? null : submittedSingle.choiceSingle.map((item: any, index: number) => (
        <Paragraph style={{marginLeft: 5}} key={item.id}>
            <Text strong>题目{index + 1}：</Text>
            <Text>{item.topicText}</Text>
            <Text keyboard>正确答案：{item.answer}</Text>
            <Text keyboard>学生答案：{item.reply}</Text>
            <Text keyboard strong>学生得分：{item.point}/{item.score}</Text>
        </Paragraph>
    ))
    const choiceManyList = submittedSingle === undefined ? null : submittedSingle.choiceMany.map((item: any, index: number) => (
        <Paragraph style={{marginLeft: 5}} key={item.id}>
            <Text strong>题目{index + 1}：</Text>
            <Text>{item.topicText}</Text>
            <Text keyboard>正确答案：{item.answer}</Text>
            <Text keyboard>学生答案：{item.reply}</Text>
            <Text keyboard strong>学生得分：{item.point}/{item.score}</Text>
        </Paragraph>
    ))
    const fallInBlankList = submittedSingle === undefined ? null : submittedSingle.fallInBlank.map((item: any, index: number) => (
        <Paragraph style={{marginLeft: 5}} key={item.id}>
            <Text strong>题目{index + 1}：</Text>
            <Text>{item.topicText}</Text>
            <Text keyboard>正确答案：{item.answer}</Text>
            <Text keyboard>学生答案：{item.reply}</Text>
            <Text keyboard strong>学生得分：{item.point}/{item.score}</Text>
        </Paragraph>
    ))
    const userInfo = submittedInfo === undefined ? null : (
        <Typography style={{paddingTop: 30}}>
            <Text style={{marginRight: 15}}>姓名：
                <Text underline strong>{submittedInfo[current].userName}</Text>
            </Text>
            <Text style={{marginRight: 15}}>学号：
                <Text underline strong>{submittedInfo[current].userId}</Text>
            </Text>
            <Text style={{marginRight: 15}}>客观题得分：
                <Text underline
                      strong>{submittedSingle?.objectiveQuestionPoint}/{submittedSingle?.objectiveQuestionScore}</Text>
            </Text>
        </Typography>
    )
    const workView = (
        <Content className='markOnline__content'>
            <Carousel
                ref={carRef}
            >
                <div>{userInfo}</div>
                <div>{userInfo}</div>
            </Carousel>
            <Divider></Divider>
            <Form
                form={form}
            >
                <Typography>
                    <Title level={5}>待批改部分</Title>
                    {shortAnswerList}
                </Typography>
            </Form>
            <Divider></Divider>
            <Typography>
                <Title level={5}>已批改部分</Title>
                <Paragraph>
                    <Text mark style={{marginRight: 5}}>判断题</Text>
                    {trueOrFalseList}
                </Paragraph>
                <Paragraph>
                    <Text mark style={{marginRight: 5}}>单选题</Text>
                    {choiceSingleList}
                </Paragraph>
                <Paragraph>
                    <Text mark style={{marginRight: 5}}>多选题</Text>
                    {choiceManyList}
                </Paragraph>
                <Paragraph>
                    <Text mark style={{marginRight: 5}}>填空题</Text>
                    {fallInBlankList}
                </Paragraph>
            </Typography>
        </Content>
    )
    // 头部组件
    const header = (
        <Header className='markOnline__header'>
            <Row>
                <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                    <div className='examinfo-container'>
                        <span>{testInfo?.testName}</span>
                        <span className='test-info'>总分：{testInfo?.totalScore}</span>
                        <span className='test-info'>已提交：{testInfo?.submitNumber}</span>
                    </div>
                </Col>
                <Col xs={0} sm={24} md={12} lg={12} xl={12}>
                    <div className='submit-box'>
                        <a className='submit'
                           onClick={saveEdit}
                        >保存</a>
                        <a className={canFinish ? 'submit' : globalCss.disabledA} style={{fontSize: 14, marginLeft: 80}}
                           onClick={finish}>提交</a>
                    </div>
                </Col>
            </Row>
        </Header>
    )
    // 切换按钮
    const nextButton = (
        <Button className='next' onClick={nextTest}><CaretRightOutlined/></Button>
    )
    const lastButton = (
        <Button className='last' onClick={lastTest}><CaretLeftOutlined/></Button>
    )
    return (
        <Layout className='markOnline'>
            <Modal
                title="注意"
                open={modalBeRender}
                onOk={confirmSubmission}
                onCancel={() => {
                    setModalBeRender(false)
                }}
                okText="确认"
                cancelText="取消"
            ><p>提交后无法再做任何修改并将自动公布成绩，确认提交吗？</p>
            </Modal>
            {mode ? header : null}
            {mode ? workView : noticView}
            {mode ? nextButton : null}
            {mode ? lastButton : null}
        </Layout>
    )
}

export default MarkOnline
