import { ipcMain } from 'electron'
import { XyUserService } from './service/user.service'
import { IpcMainEvents,IpcInvokeEvents } from './types'
import { userAdd, userGet, userList } from './service/store.service'

const xyUserService = new XyUserService()

function addEvent<T extends keyof IpcMainEvents>(event: T, listener: IpcMainEvents[T]) {
    ipcMain.on(event, (_,params)=>listener(params))
}

function handleInvoke<T extends keyof IpcInvokeEvents>(event: T, listener: IpcInvokeEvents[T]) {
    ipcMain.handle(event, listener)
}

addEvent('userGet',(params)=>{
    return userGet(params)
})

handleInvoke('userList',()=>{
    return userList()
})

addEvent('userRemove',user=>{
    xyUserService.userRemove(user)
})

addEvent('userAdd',user=>{
    return userAdd(user)
})

addEvent('xianyuLogin',()=>{
    xyUserService.login()
})

addEvent('xianyuImLogout',(user)=>{
    xyUserService.userImLogout(user)
})
addEvent('xianyuImLogin',user=>{
    xyUserService.userImLogin(user)
})

addEvent('xianyuReLogin',userId=>{
    xyUserService.reLogin(userId)
})

addEvent('onMounted',()=>{
    xyUserService.initUserImLogin()
})