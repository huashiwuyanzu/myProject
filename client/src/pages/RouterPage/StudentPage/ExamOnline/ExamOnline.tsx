import {Layout, Col, Row, Statistic, Form, Radio, Typography, Checkbox, Input, Button, Modal} from "antd";
import {FieldTimeOutlined} from '@ant-design/icons'
import './ExamOnline.scss'
import {compare, getSearchInUrl, topicTypeMap} from "@/utils/util.ts";
import {getSingleTest, submitTestByStudent} from "@/api/test_api.ts";
import {useEffect, useState} from "react";
import {getPageTopic} from "@/api/topic.ts";
import store from "@/redux/store.ts";
import {$message} from "@/utils/render.tsx";
import {useMyNavigate} from "@/configs/router/config.tsx";

const {Header, Content} = Layout
const {Text, Paragraph} = Typography
const {TextArea} = Input
const deadline = Date.now() + 1000 * 60 * 60 * 2 + 1000 * 30;
const search = getSearchInUrl(window.location.href)
const courseName = decodeURI(search.courseName)
const testId = search.testId


function ExamOnline() {
    const [testInfo, setTestInfo] = useState<Record<string, string | number> | undefined>(undefined)
    const [topicList, setTopicList] = useState<Array<any> | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isModalOpenSecond, setIsModalOpenSecond] = useState<boolean>(false)
    const [reply, setReply] = useState<Record<string, string | any> | undefined>(undefined);
    const [form] = Form.useForm();
    const myNavigate = useMyNavigate()

    // 获取测试数据
    function getTestInfo() {
        getSingleTest({testId}).then(res => {
            const data: Record<string, any> = {}
            data.testName = res.data.testInfo.testName
            data.totalScore = res.data.testInfo.totalScore
            data.testId = res.data.testInfo.testId
            setTestInfo(data)
        })
    }

    function getTopicList() {
        getPageTopic({testId}).then((res: any) => {
            const data = res.data.record.sort(compare('topicType', 'asc'))
            setTopicList(data)
        })
    }

    // 确认交卷
    const confirmSubmission = function (value: any) {
        const replyList = [];
        for (const key in value) {
            const option = {
                topicId: key,
                reply: value[key] === '' || value[key] === undefined ? '' : value[key],
            }
            replyList.push(option);
        }
        const params: Record<string, any> = {}
        params.userId = store.getState().userInfo.userId
        params.testId = testInfo?.testId
        params.replyList = replyList
        submitTestByStudent(params).then((res: any) => {
            if (res.code === 0) {
                myNavigate('/myResult', {replace: true}, {status: '1'})
                setReply(undefined)
                setIsModalOpen(false)
                setIsModalOpenSecond(false)
            } else {
                $message('error', '提交失败，请稍后重试')
            }
        })
    }

    // 交卷
    const submitHandler = function (value: any) {
        let flag = false
        for (const key in value) {
            if (value[key] === undefined || value[key] === '') {
                flag = true;
                break;
            }
        }
        setReply(value)
        if (flag) {
            setIsModalOpen(true)
        } else {
            setIsModalOpenSecond(true)
        }
    }
    useEffect(() => {
        getTestInfo()
        getTopicList()
    }, [])
    const topicItems = topicList?.map(item => {
        let answerRender: any;
        if (item.topicType === '1') {
            answerRender = (
                <Radio.Group>
                    <Radio value="正确"> 正确 </Radio>
                    <Radio value="错误"> 错误</Radio>
                </Radio.Group>
            )
        } else if (item.topicType === '2') {
            const answerArr = item.options.split(',').map((item: any) => (
                <Radio value={item} key={item}>{item}</Radio>
            ))
            answerRender = (<Radio.Group>{answerArr}</Radio.Group>)
        } else if (item.topicType === '3') {
            const answerArr = item.options.split(',').map((item: any) => {
                const option = {
                    value: item,
                    label: item,
                }
                return option;
            })
            answerRender = (<Checkbox.Group options={answerArr}/>)
        } else if (item.topicType === '4') {
            item.topicText = item.topicText.replace(/\?/g, '（？）')
            answerRender = (
                <Input placeholder='多个答案之间用英文逗号隔开即可' allowClear size='small' className='input'/>
            )
        } else if (item.topicType === '5') {
            answerRender = (<TextArea className='text-area' rows={5} allowClear maxLength={300} showCount/>)
        }
        return (
            <div className='test-question' key={item.topicId}>
                <Paragraph>
                    <Text mark className='test-question__type'>{topicTypeMap[item.topicType]}</Text>
                    <Text code className='test-question__score'>{item.score}分</Text>
                    <span>{item.topicText}</span>
                </Paragraph>
                <Form.Item label='作答：' name={item.topicId}>{answerRender}</Form.Item>
            </div>
        )
    })

    return (
        <Layout className='exam-online'>
            {/*有空选项的提示框*/}
            <Modal open={isModalOpen}
                   onOk={() => {
                       confirmSubmission(reply)
                   }}
                   onCancel={() => {
                       setIsModalOpen(false)
                   }}
                   okText="确认"
                   cancelText="取消"
                   centered
            >还有题目未作答，确定提交吗？
            </Modal>
            {/*确认提交的提示框*/}
            <Modal open={isModalOpenSecond}
                   onOk={() => {
                       confirmSubmission(reply)
                   }}
                   onCancel={() => {
                       setIsModalOpenSecond(false)
                   }}
                   okText="确认"
                   cancelText="取消"
                   centered
            >提交后无法再做修改，确定提交吗？
            </Modal>
            <Header className='exam-online__header'>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='examinfo-container'>
                            <span>{courseName}-{testInfo?.testName}</span>
                            <span className='total-score'>总分：{testInfo?.totalScore}</span>
                        </div>
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={12} xl={12}>
                        <div className='countdown-container'>
                            <FieldTimeOutlined/>
                            <Statistic.Countdown valueStyle={{fontSize: '16px', marginLeft: '5px'}} value={deadline}/>
                            <a className='submit'
                               onClick={() => {
                                   const btn: any = document.getElementById('submitButton')
                                   btn.click()
                               }}
                            >交卷</a>
                        </div>
                    </Col>
                </Row>
            </Header>
            <Content className='exam-online__content'>
                <Form
                    form={form}
                    layout="horizontal"
                    onFinish={submitHandler}
                ><Button htmlType='submit' id='submitButton' style={{display: 'none'}}></Button>
                    {topicItems}
                </Form>
            </Content>
        </Layout>
    )
}

export default ExamOnline
