import { GooFishUser, MsgFormattedPayload, MsgTypes } from '../types'
import Ws from 'ws'
import { XyApiService } from './api.service'
import xyJsModule from '../libs/xianyu_js_version_2.cjs'
import { array2cookie } from '../utils'
import { APP_KEY, USER_AGENT } from '../config'
import { clearInterval } from 'timers'
import { EventEmitter } from 'node:events'

interface ImServiceEvents {
    message: (msg: MsgFormattedPayload) => void
    error: (err: Error) => void
    connected:()=>void
}

export class XyImService {
    private token: string = ''
    user: GooFishUser
    private deviceId: string
    ws: Ws | null = null
    private cookieStr: string
    private apiService: XyApiService
    private timerId: NodeJS.Timeout | undefined = undefined
    private emitter = new EventEmitter()
    constructor(user: GooFishUser) {
        this.user = user
        this.cookieStr = array2cookie(user.cookies)
        this.deviceId = xyJsModule.generate_device_id(user.userId)
        this.apiService = new XyApiService(this.cookieStr, this.deviceId)
    }

    on<T extends keyof ImServiceEvents>(event: T, listener: ImServiceEvents[T]) {
        this.emitter.on(event, listener)
    }

    emit<T extends keyof ImServiceEvents>(event: T, ...args: Parameters<ImServiceEvents[T]>) {
        this.emitter.emit(event, ...args)
    }

    get status() {
        return !this.ws ? Ws.CLOSED : this.ws.readyState
    }

    // 初始化
    async init() {
        const { accessToken } = await this.apiService.getToken()
        this.token = accessToken
        this.connect()
    }
    private async connect() {
        const headers = {
            Cookie: this.cookieStr,
            Host: 'wss-goofish.dingtalk.com',
            Connection: 'Upgrade',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'User-Agent': USER_AGENT,
            Origin: 'https://www.goofish.com',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'zh-CN,zh;q=0.9'
        }
        this.ws = new Ws(`wss://wss-goofish.dingtalk.com/`, { headers })
        this.ws.on('open', () => {
            this.sendInitMsg()
            this.sendSyncMsg()
            this.keepHeartBeat()
            this.emit('connected')
        })
        this.ws.on('message', async (msg) => {
            try {
                const message = JSON.parse(msg.toString())

                if (message.headers?.mid) {
                    const ack = {
                        code: 200,
                        headers: {
                            mid: message.headers.mid,
                            sid: message.headers.sid || ''
                        }
                    }
                    this.ws!.send(JSON.stringify(ack))
                }

                // 处理业务消息
                if (message.lwp && message.lwp === '/s/sync' && message.body?.syncPushPackage) {
                    const encryptedData = message.body.syncPushPackage.data[0].data
                    const decrypted = xyJsModule.decrypt(encryptedData)
                    const msg = JSON.parse(decrypted)
                    if (Object.keys(msg).length !== 2) return
                    const senderName = msg['1']['10']['reminderTitle']
                    const senderUserId = msg['1']['10']['senderUserId']
                    const content = msg['1']['10']['reminderContent']
                    const cid = msg['1']['2'].split('@')[0]
                    const msgInfoStr = msg['1']['6']['3']['5']
                    const msgInfo = JSON.parse(msgInfoStr)
                    const formattedMsg: MsgFormattedPayload = {
                        senderName,
                        senderUserId,
                        content,
                        images: [],
                        type: MsgTypes.TEXT,
                        toUserId:cid
                    }
                    if (msgInfo.contentType == 2 && msgInfo.image) {
                        formattedMsg.type = MsgTypes.IMAGE
                        const pics = msgInfo.image.pics
                        const newPics: string[] = []
                        for (let pic of pics) {
                            newPics.push(pic.url + '_570x10000Q90.jpg_.webp')
                        }
                        formattedMsg.images = newPics
                    }
                    // message handler
                    // msgService.handleMsg(formattedMsg, this.ws!)
                    this.emit('message', formattedMsg)
                }
            } catch (err) {
                console.log(`消息格式化失败，非JSON格式`, err)
            }
        })
    }

    private keepHeartBeat() {
        this.timerId = setInterval(() => {
            const heartbeatMsg = {
                lwp: '/!',
                headers: { mid: xyJsModule.generate_mid() }
            }
            this.ws?.send(JSON.stringify(heartbeatMsg))
            if (!this.ws || this.ws.CLOSED) {
                clearInterval(this.timerId)
            }
        }, 15000)
    }

    private createMsgPayload(lwp: string, body?: any) {
        const msg = {
            lwp,
            headers: {
                'app-key': APP_KEY,
                token: this.token,
                ua: USER_AGENT,
                dt: 'j',
                wv: 'im:3,au:3,sy:6',
                did: this.deviceId,
                mid: xyJsModule.generate_mid(),
                sync: '0,0;0;0;',
                'cache-header': 'app-key token ua wv'
            },
            body: body
        }
        return JSON.stringify(msg)
    }

    private sendInitMsg() {
        this.ws?.send(this.createMsgPayload('/reg'))
        setTimeout(() => {
            // 2秒后再发一条消息
            this.ws?.send(
                this.createMsgPayload('/r/SyncStatus/ackDiff', [
                    {
                        pipeline: 'sync',
                        tooLong2Tag: 'PNM,1',
                        channel: 'sync',
                        topic: 'sync',
                        highPts: 0,
                        pts: Date.now() * 1000,
                        seq: 0,
                        timestamp: Date.now()
                    }
                ])
            )
        }, 2 * 1000)
    }

    private sendSyncMsg() {
        const syncMsg = {
            lwp: '/r/SyncStatus/getState',
            headers: { mid: xyJsModule.generate_mid() },
            body: [
                {
                    topic: 'sync'
                }
            ]
        }
        this.ws?.send(JSON.stringify(syncMsg))
    }

    // 发送自定义回复的消息
    async sendReplyMsg(cid:string,toid: string, text: string) {
        try {
            // 构建文本内容
            const textContent = {
                contentType: 1,
                text: {
                    text: text
                }
            }

            // 转换为 Base64
            const textStr = JSON.stringify(textContent)
            const textBase64 = Buffer.from(textStr).toString('base64')

            // 构建消息体
            const msg = this.createMsgPayload('/r/MessageSend/sendByReceiverScope', [
                {
                    uuid: xyJsModule.generate_uuid(),
                    cid: `${cid}@goofish`,
                    conversationType: 1,
                    content: {
                        contentType: 101,
                        custom: {
                            type: 1,
                            data: textBase64
                        }
                    },
                    redPointPolicy: 0,
                    extension: {
                        extJson: '{}'
                    },
                    ctx: {
                        appVersion: '1.0',
                        platform: 'web'
                    },
                    mtags: {},
                    msgReadStatusSetting: 1
                },
                {
                    actualReceivers: [`${toid}@goofish`, `${cid}@goofish`]
                }
            ])
            this.ws?.send(msg)
            console.log('send message success')
        } catch (err) {
            console.error('send message error :', err)
            throw err // 根据需求决定是否抛出错误
        }
    }
}
