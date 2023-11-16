import {Layout, Menu, Row, Col, Button, Input, Modal, Card, Image} from "antd";
import {useNavigate} from "react-router-dom";
import {Outlet} from "react-router-dom";
import './AppLayout.scss';
import {asideConfig} from "@/configs/router/config.tsx";
import {useEffect, useState} from "react";
import store from "@/redux/store.ts";
import {getSingleCourse, joinCourse} from "@/api/course_api.ts";
import {$message} from "@/utils/render.tsx";
import {getTime} from "@/utils/util.ts";

const {Sider, Footer, Header, Content} = Layout
const {Meta} = Card

function AppLayout() {
    const [items, setItems] = useState<any>([])
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [searchMode, setSearchMode] = useState<string | undefined>(undefined)
    const [searchData, setSearchData] = useState<any>(undefined)
    useEffect(() => {
        setItems(asideConfig)
    }, [])

    // 注销
    function logout() {
        window.localStorage.removeItem('token')
        navigate('/login', {
            replace: true,
        })
    }

    // 页面跳转
    function toNewPage(e: any) {
        navigate(e.key, {
            replace: false
        })
    }

    // 查询
    function searchCourse(value: string) {
        const text = value.replace(/[\t\r\f\n\s]*/g, "")
        if (text === '') {
            return
        }
        if (/^[a-zA-z0-9]+$/.test(text)) {
            const params = {courseId: text, userId: store.getState().userInfo.userId as string}
            getSingleCourse(params).then((res: any) => {
                if (res.code === 0) {
                    if (res.data === null) {
                        $message('warning', '查无此课程')
                    } else {
                        setSearchData(res.data)
                        setSearchMode('single')
                        setShowModal(true)
                    }
                } else {
                    $message('error', '操作失败，请稍后重试')
                }
            })
        }
    }

    // 加入课程
    function join(invitationCode: string) {
        const params = {
            invitationCode,
            courseId: searchData.courseInfo.courseId,
            userId: store.getState().userInfo.userId
        }
        joinCourse(params).then((res: any) => {
            if (res.code === 0) {
                $message('success', '成功加入')
                setShowModal(false)
            } else {
                $message('warning', '邀请码错误')
            }
        }).catch(() => {
            $message('error', '操作失败，请稍后重试')
        })
    }

    let searchResult;
    // 搜索结果展示
    if (searchMode === undefined) {
        searchResult === null;
    } else if (searchMode === 'single') {
        searchResult = (
            <Card
                bordered={false}
                cover={<Image height={170} src={searchData.courseInfo?.coursePicture} style={{objectFit: 'cover'}}/>}
                actions={[
                    <div>
                        {!searchData.beJoin ? (
                            <Input.Search
                                bordered={false}
                                placeholder="请输入邀请码"
                                enterButton
                                onSearch={join}
                            ></Input.Search>
                        ) : <a onClick={() => {
                            setShowModal(false)
                            navigate('/appLayout/courseArr')
                        }}>已加入</a>}
                    </div>
                ]}
            ><Meta
                style={{height: '130px'}}
                title={
                    <div>
                        <div>{searchData.courseInfo?.courseName}</div>
                        <div>{getTime(searchData.courseInfo?.startYear, 'year')}-{getTime(searchData.courseInfo?.endYear, 'year')}</div>
                    </div>
                }
                description={searchData.courseInfo?.courseIntroduction.length > 50 ? searchData.courseInfo?.courseIntroduction.slice(0, 51) + '……' : searchData.courseInfo.courseIntroduction}
            />
            </Card>
        )
    }

    return (
        <Layout className='applayout'>
            <Modal
                centered
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                }}
                footer={null}
            >
                {searchResult}
            </Modal>
            <Sider
                breakpoint="md"
                collapsedWidth="0"
                width='256px'
                className='applayout__sider'
            >
                <h1>学生宿舍教评系统</h1>
                <Menu
                    mode="inline"
                    items={items}
                    onClick={toNewPage}
                    theme='light'
                />
            </Sider>
            <Layout>
                <Header className='applayout__header'>
                    <Row align='middle'>
                        <Col xs={0} xl={16} >
                            {store.getState().userInfo.roleType === '学生' ?
                                (
                                    <Input.Search
                                        className='applayout__header__search'
                                        placeholder="请输入课程编号进行查找"
                                        enterButton
                                        style={{marginTop:16}}
                                        onSearch={(value) => {
                                            searchCourse(value)
                                        }}
                                    ></Input.Search>
                                ) : null}
                        </Col>
                        <Col xs={24} xl={8}>
                            <span>{store.getState().userInfo.userName}</span>
                            <Button
                                style={{marginLeft: 15}}
                                onClick={logout}
                                type="primary"
                                size='small'
                            >注销</Button>
                        </Col>
                    </Row>
                </Header>
                <Content className='applayout__content'>
                    <Outlet></Outlet>
                </Content>
                <Footer className='applayout__footer'>
                    <span>©版权所有：五肉一汤</span>
                    <span>版本信息：v1.0.0</span>
                    <span>联系方式：2311216746@qq.com</span>
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AppLayout
