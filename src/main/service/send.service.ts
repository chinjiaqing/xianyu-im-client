import { BrowserWindow, Notification } from 'electron'
import { IpcRendererEvents, LogItem } from '../types'

export class SendService {
    private wind: BrowserWindow | null = null

    send2renderer<T extends keyof IpcRendererEvents>(event: T, ...args: Parameters<IpcRendererEvents[T]>) {
       this?.wind?.webContents.send(event,...args)
    }

    log2renderer(subject:string,body:string,status:LogItem['status']=1,useNotify:boolean=false){
        this.send2renderer('log',{
            subject,
            status,
            body,
            datetime: new Date().getTime() + ''
        })
        if(useNotify) {
            new Notification({
                title:subject,
                body
            }).show()
        }
    }

    setWind(wind:BrowserWindow) {
        this.wind = wind
    }
}


export default new SendService()