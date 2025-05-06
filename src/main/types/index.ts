export * from '../../shared/types'

export enum MsgTypes {
    IMAGE = 'image',
    TEXT = 'text'
}

//格式化后的消息体
export interface MsgFormattedPayload {
    type: MsgTypes; //消息类型
    senderUserId: string; //发送消息的人
    senderName: string; // 发送消息人的id
    content: string; // 内容
    images: string[]; // 图片
    // toUserId:string; //接收消息的人的ID，不同于UserId
    cid:string;
    pnm:string;
    messageId:string
}