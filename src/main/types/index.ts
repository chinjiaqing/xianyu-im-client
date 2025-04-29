export * from '../../shared/types'

import { GooFishUser } from '../../shared/types'

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

export interface IpcMainEvents {
    userList: () => GooFishUser[]
    userGet: (id: string) => GooFishUser | undefined
    userRemove: (user: GooFishUser) => void
    userAdd: (user: GooFishUser) => void

    xianyuRead: (userId: string) => void
    xianyuUnread: (userId: string) => void
    xianyuReLogin: (userId: string) => void
    xianyuLogin: () => void
}
