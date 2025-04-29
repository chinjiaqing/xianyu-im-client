export * from '../../shared/types'

export enum MsgTypes {
    IMAGE = 'image',
    TEXT = 'text'
}

//格式化后的消息体
export interface MsgFormattedPayload {
    type: MsgTypes
    senderUserId: string
    senderName: string
    content: string
    images: string[]
}