import { ipcMain } from 'electron'
import { XyUserService } from './service/user.service'
import { IpcMainEvents } from './types'
import { userAdd, userGet, userList, userRemove } from './service/store.service'

const xyUserService = new XyUserService()

function addEvent<T extends keyof IpcMainEvents>(event: T, listener: IpcMainEvents[T]) {
    ipcMain.on(event, (_,params)=>listener(params))
}


addEvent('userGet',(params)=>{
    return userGet(params)
})

addEvent('userList',()=>{
    return userList()
})

addEvent('userRemove',user=>{
    return userRemove(user)
})

addEvent('userAdd',user=>{
    return userAdd(user)
})

addEvent('xianyuLogin',()=>{
    xyUserService.login()
})

addEvent('xianyuReLogin',userId=>{
    xyUserService.reLogin(userId)
})
