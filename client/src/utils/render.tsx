import {message, notification} from "antd";
import {NoticeType} from "antd/es/message/interface";
import {ExclamationCircleOutlined} from '@ant-design/icons';

export function $message(type: NoticeType, content: string) {
    message.config({
        top: 50,
        duration: 2,
        maxCount: 3,
        rtl: true,
    })
    message.open({
        type,
        content
    })
}

export function $notification(description: string) {
    notification.open({
        message: <ExclamationCircleOutlined/>,
        description,
        duration: 2,
    });
}
