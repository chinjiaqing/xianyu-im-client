import { User } from '@renderer/types/user'
import { ref } from 'vue'

export const userList = ref<User[]>([])

// 同步用户列表
export async function syncUserList() {
    const list = await window.electron.ipcRenderer.invoke('user-list')
    console.log('%c [ list ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', list)
    userList.value = list
}

//删除用户
export async function deleteUser(uid: string) {
    console.log('%c [ uid ]-14', 'font-size:13px; background:pink; color:#bf2c9f;', uid)
    window.electron.ipcRenderer.send('user-delete', uid)
    // await syncUserList()
}

export function restoreUser(uid: string) {
    window.electron.ipcRenderer.send('xianyu_read', uid)
    window.electron.ipcRenderer.send('xianyu_restore', uid)
}

export function toggleUserWsStatus(uid: string, status: 0 | 1) {
    window.electron.ipcRenderer.send('xianyu_im_toggle', {
        uid,
        status
    })
}

export function addUser() {
    window.electron.ipcRenderer.send('xianyu_login')
}

export async function initUserIo() {}

export async function batchInitUserIo() {}
