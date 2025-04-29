import Store from 'electron-store'
import { GooFishUser } from '../types'

type MyStore = {
    userList: GooFishUser[],
}
export const store = new Store<MyStore>({
    name: 'goofish',
    defaults: {
        userList: [],
    }
})

export function userAdd(user:GooFishUser){
    if(userGet(user.userId)) {
        userRemove(user)
    }
    const userList = store.get('userList')
    userList.unshift(user)
    store.get('userList',userList)
}

export function userRemove(user:GooFishUser){
    const userList = store.get('userList')
    const newUserList = userList.filter((v) => v.userId != user.userId)
    store.set('userList', newUserList)
}

export function userGet(userId:string):GooFishUser | undefined {
    const userList = store.get('userList')
    return userList.find((v) => v.userId == userId)
}

export function userUpdate(user:GooFishUser){
    userRemove(user)
    userAdd(user)
}

export function userList(){
    return store.get('userList')
}