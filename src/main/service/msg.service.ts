import { MsgFormattedPayload, MsgTypes } from '../types'
import { XyImService } from './im.service'

interface MessageHandler {
    handle(msg: MsgFormattedPayload, wsService: XyImService): void
}

interface ErrorHandler {
    handle(error: Error): Promise<void>
}

class MsgLogHandler implements MessageHandler {
    handle(msg: MsgFormattedPayload) {
        console.log(`收到消息了---`, msg)
    }
}

class ImageMsgHandler implements MessageHandler {
    handle(msg: MsgFormattedPayload) {
        if (msg.type !== MsgTypes.TEXT) return
    }
}

class TextMsgHandler implements MessageHandler {
    async handle(msg: MsgFormattedPayload,wsService:XyImService) {
        if (msg.type !== MsgTypes.TEXT) return
        // 自动回复参考
        wsService.sendReplyMsg(msg,'你好呀')
    }
}

class MsgService {
    private middlewares: MessageHandler[] = []
    private errorPipes: ErrorHandler[] = []

    use(middleware: MessageHandler) {
        this.middlewares.push(middleware)
    }

    onError(pipe: ErrorHandler) {
        this.errorPipes.push(pipe)
    }
    private async handlerError(err: Error) {
        for (let handler of this.errorPipes) {
            try {
                await handler.handle(err)
            } catch (err) {
                // throw err
                console.log(`error handler failed`, err)
            }
        }
    }
    async handleMsg(msg: MsgFormattedPayload, wsService: XyImService) {
        for (let handler of this.middlewares) {
            try {
                handler.handle(msg, wsService)
            } catch (err) {
                await this.handlerError(err as Error)
            }
        }
    }
}

const msgService = new MsgService()
msgService.use(new TextMsgHandler())
msgService.use(new MsgLogHandler())
msgService.use(new ImageMsgHandler())

export default msgService
