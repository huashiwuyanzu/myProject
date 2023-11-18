import {Input, Layout, DatePicker, Card, Button, Divider, Radio, InputNumber} from "antd";
import './CreateTest.scss'
import {Form} from 'antd'
import {countChar, getSearchInUrl, isInclude} from "@/utils/util.ts";
import {$message} from "@/utils/render.tsx";
import {createSingle} from "@/api/test_api.ts";
import {useMyNavigate} from "@/configs/router/config.tsx";

const {Header, Content} = Layout
const {RangePicker} = DatePicker
const {TextArea} = Input
const search = getSearchInUrl(window.location.href)
const courseId = search.courseId
const courseName = decodeURI(search.courseName)

interface TopicItem {
    topicText: string,
    score: number,
    answer?: string,
    options?: string,
    topicType: string
}

interface NewTest {
    testName: string,
    rangeTime: any,
    trueOrFalse?: Array<TopicItem>,
    choice?: Array<TopicItem>,
    fallInBlank?: Array<TopicItem>,
    shortAnswer?: Array<TopicItem>
}

function CreateTest() {
    const [form] = Form.useForm()
    const myNavigate = useMyNavigate()
    // 发布新测试
    const submitHandler = function (value: NewTest) {
        const topicList: Array<any> = []
        let totalScore = 0
        // 把题目信息收集到数组中
        value.trueOrFalse?.forEach(item => {
            const option = item;
            option.options = '_'
            option.topicType = '1'
            totalScore += item.score
            topicList.push(option)
        })
        if (value.choice !== undefined) {
            for (let i = 0; i < value.choice.length; ++i) {
                const item = value.choice[i];
                const optionsArr = item.options?.split(',')
                const answerArr = item.answer?.split(',')
                if (!isInclude(optionsArr as Array<string>, answerArr as Array<string>, 'string')) {
                    $message('error', `选择题第${i + 1}题格式有误，请检查`)
                    return
                }
                item.topicType = (answerArr as Array<any>).length > 1 ? '3' : '2'
                totalScore += item.score
                topicList.push(item)
            }
        }
        if (value.fallInBlank !== undefined) {
            for (let i = 0; i < value.fallInBlank.length; ++i) {
                const item = value.fallInBlank[i];
                if (countChar(item.answer as string, ',') !== countChar(item.topicText as string, '?') - 1) {
                    $message('error', `填空题第${i + 1}题格式有误，请检查`)
                    return
                }
                item.options = '_'
                item.topicType = '4'
                totalScore += item.score
                topicList.push(item)
            }
        }
        value.shortAnswer?.forEach(item => {
            const option = item;
            option.topicType = '5'
            option.answer = '_'
            option.options = '_'
            totalScore += item.score
            topicList.push(option)
        })
        if (topicList.length === 0) {
            $message('error', '题目数据不应为空')
            return
        }
        // 测试基本信息
        const paramsForNewTest: Record<string, any> = {
            testName: value.testName,
            startTime: value.rangeTime[0].valueOf(),
            endTime: value.rangeTime[1].valueOf(),
            totalScore,
            courseId,
        }
        const params = {
            testInfo: paramsForNewTest,
            topicList,
        }
        createSingle(params).then((res: any) => {
            if (res.code === 0) {
                myNavigate('/myResult', {replace: true}, {status: '1'})
            } else {
                $message('error', '操作失败，请稍后重试')
            }
        })
    }

    const topicType = [
        {
            value: 'trueOrFalse',
            label: '判断题'
        },
        {
            value: 'choice',
            label: '选择题'
        },
        {
            value: 'fallInBlank',
            label: '填空题'
        },
        {
            value: 'shortAnswer',
            label: '简答题'
        }
    ]
    const topicList = topicType.map(item => {
        const placeholderInAreaText = item.value === 'fallInBlank' ? '在需要填空处用英文问号表示即可' : undefined;
        let answerNode: any;
        if (item.value === 'trueOrFalse') {
            answerNode = (
                <Radio.Group size='small'>
                    <Radio value='正确'>正确</Radio>
                    <Radio value='错误'>错误</Radio>
                </Radio.Group>
            )
        } else if (item.value === 'choice') {
            answerNode = (
                <Input size='small' placeholder='若为多选题，多个答案之间用英文逗号分割即可'/>
            )
        } else if (item.value === 'fallInBlank') {
            answerNode = (
                <Input size='small' placeholder='多个答案之间用英文逗号分割即可'/>
            )
        } else if (item.value === 'shortAnswer') {
            answerNode = null
        }
        return (
            <Form.List name={item.value} key={item.value}>
                {(fields, {add, remove}) => (
                    <Card title={item.label} size={"small"} style={{position: 'relative'}}>
                        {fields.map((field) => (
                            <div style={{position: 'relative'}} key={field.name}>
                                {/*题干*/}
                                <Form.Item label="题干" name={[field.name, 'topicText']}
                                           labelCol={{
                                               sm: {span: 0},
                                               md: {span: 4},
                                               lg: {span: 2},
                                               xl: {span: 2}
                                           }}
                                           wrapperCol={{md: {span: 18}, lg: {span: 20}, xl: {span: 16}}}
                                           rules={[{required: true, message: '题干必填'}]}
                                ><TextArea size='small' rows={3} maxLength={200} showCount
                                           placeholder={placeholderInAreaText}/>
                                </Form.Item>
                                {/*选项*/}
                                {item.value === 'choice' ?
                                    <Form.Item label="选项" name={[field.name, 'options']}
                                               labelCol={{
                                                   sm: {span: 0},
                                                   md: {span: 4},
                                                   lg: {span: 2},
                                                   xl: {span: 2}
                                               }}
                                               wrapperCol={{md: {span: 18}, lg: {span: 20}, xl: {span: 16}}}
                                               rules={[{required: true, message: '选项必填'}]}
                                    ><Input size='small' placeholder='多个选项之间用英文逗号隔开即可'/>
                                    </Form.Item> : null}
                                {/*答案*/}
                                {item.value !== 'shortAnswer' ?
                                    <Form.Item label="答案" name={[field.name, 'answer']}
                                               labelCol={{
                                                   sm: {span: 0},
                                                   md: {span: 4},
                                                   lg: {span: 2},
                                                   xl: {span: 2}
                                               }}
                                               wrapperCol={{md: {span: 18}, lg: {span: 20}, xl: {span: 16}}}
                                               rules={[{required: true, message: '答案必填'}]}
                                    >
                                        {answerNode}
                                    </Form.Item> : null}
                                {/*分值*/}
                                <Form.Item label="分值" name={[field.name, 'score']}
                                           labelCol={{
                                               sm: {span: 0},
                                               md: {span: 4},
                                               lg: {span: 2},
                                               xl: {span: 2}
                                           }}
                                           wrapperCol={{md: {span: 16}, lg: {span: 16}, xl: {span: 8}}}
                                           rules={[{required: true, message: '分值必填'}]}
                                ><InputNumber min={1} size='small'/>
                                </Form.Item>
                                <a className="a__action__danger"
                                   style={{position: 'absolute', bottom: 30, left: 240}}
                                   onClick={() => {
                                       remove(field.name)
                                   }}>删除此项</a>
                                <Divider></Divider>
                            </div>
                        ))}
                        <a type="dashed" className='a__action' onClick={() => add()}
                           style={
                               fields.length > 0 ?
                                   {position: 'absolute', bottom: 66, left: 350} :
                                   {position: 'absolute', top: 7, right: 100}
                           }>新增</a>
                    </Card>
                )}
            </Form.List>
        )

    })

    return (
        <Layout className='createTest'>
            <Header className='createTest__header'>
                <h3>{courseName}</h3>
            </Header>
            <Content className='createTest__content'>
                <Form
                    form={form}
                    onFinish={(value: any) => {
                        submitHandler(value)
                    }}
                    labelCol={{sm: {span: 0}, md: {span: 8}, lg: {span: 6}, xl: {span: 3}}}
                    wrapperCol={{md: {span: 16}, lg: {span: 10}, xl: {span: 8}}}
                    labelAlign='left'
                    style={{marginTop: '20px'}}
                >
                    <Form.Item
                        name='testName'
                        label='考试名称'
                        rules={[{required: true, message: '考试名称必填'}]}
                    >
                        <Input
                            maxLength={20}
                            showCount
                            allowClear
                        ></Input>
                    </Form.Item>
                    <Form.Item
                        name='rangeTime'
                        label='开始与结束时间'
                        rules={[{required: true, message: '开始与结束时间必填'}]}
                    >
                        <RangePicker
                            showTime={{format: 'HH:mm'}}
                            format="YYYY-MM-DD HH:mm"
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    {topicList}
                    <Form.Item style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
                        <Button
                            htmlType="submit"
                            type='primary'
                        >发布</Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    )
}

export default CreateTest
