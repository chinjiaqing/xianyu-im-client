import { GooFishUser } from '../types'
import { waitFor } from '../utils'
import browserService from './browser.service'
import { XyImService } from './im.service'
import msgService from './msg.service'
import { userAdd, userGet, userRemove, userUpdate } from './store.service'
import windowService from './window.service'

export class XyUserService {
    private users = new Map<string, XyImService>()

    async userImLogin(user: GooFishUser) {
        await this.userImLogout(user)
        const xyImService = new XyImService(user)
        await xyImService.init()
        this.users.set(user.userId, xyImService)
        xyImService.on('message', (msg) => {
            msgService.handleMsg(msg, xyImService)
        })
        userAdd(user)
    }

    async userImLogout(user: GooFishUser) {
        if (this.users.has(user.userId)) {
            const xyImService = this.users.get(user.userId)
            xyImService?.ws?.close()
            this.users.delete(user.userId)
        }
        userRemove(user)
    }

    async login() {
        console.log('66666666')
        const wind = windowService.createXyWindow()
        const page = await browserService.getPage(wind)
        if (!page) {
            // error handler
            return
        }
        await browserService.initPage(page)
        await page.goto('https://www.goofish.com/login', {
            referer: 'https://www.goofish.com/'
        })
        // 请在五分钟内完成登录
        try {
            await page.waitForNavigation({
                timeout: 5 * 60 * 1000
            })
        } catch (_) {
            // notifyAndLog('绑定失败', '登录超时，请重试', true)
            wind.close()
            return
        }
        const userInfo: GooFishUser = {
            userId: '',
            avatar: '',
            displayName: '',
            lastLogin: '',
            cookies: [],
            accessToken: '',
            unread: false,
            online:false
        }
        if (page.url().endsWith('www.goofish.com/')) {
            page.on('response', async (response) => {
                const req = response.request()
                const method = req.method()
                const url = response.url()
                if (url.includes('pc.loginuser.get') && method.toLocaleLowerCase() === 'post') {
                    const bodyData = await response.json()
                    userInfo.userId = bodyData.data.userId
                    userInfo.lastLogin = new Date().getTime() + ''
                }
                if (
                    url.includes('mtop.idle.web.user.page.nav') &&
                    method.toLocaleLowerCase() === 'post'
                ) {
                    const respData = await response.json()
                    userInfo.avatar = respData.data.module.base.avatar
                    userInfo.displayName = respData.data.module.base.displayName
                }
            })
            await page.goto('https://www.goofish.com/im')
        }else{
            wind.close()
            return
        }
         // 等待读取用户信息
         await waitFor(() => userInfo.userId != '' && userInfo.displayName != '', 10)
         const cookies = await page.cookies()
         userInfo.cookies = cookies
         await this.userImLogin(userInfo)
         wind.close()
    }

    async reLogin(userId:string){
        const user = userGet(userId)
        if(!user) {
            //
            return
        }
        let newAccessToken:string = ''
        const wind = windowService.createXyWindow()
        const page = await browserService.getPage(wind)
        if(!page) {
            // 
            wind.close()
            return
        }
        await browserService.initPage(page)
        page.on('response', async (response) => {
            const req = response.request()
            const method = req.method()
            const url = response.url()
            if (
                url.includes('pc.login.token') &&
                method.toLocaleLowerCase() === 'post' &&
                response.status() == 200
            ) {
                const body = await response.json()
                newAccessToken = body.data.accessToken
            }
        })
        await page.setCookie(...user.cookies)
        try {
            await page.goto('https://www.goofish.com/im', {
                timeout: 30 * 6000
            })
        } catch (_) {
            // 
            userRemove(user)
            wind.close()
            return
        }
        try {
            await waitFor(() => newAccessToken != '')
            // notifyAndLog(`登录成功`, '用户' + user.displayName + ' 登录成功', false)
            user.lastLogin = new Date().getTime() + ''
            user.cookies = await page.cookies()
            userUpdate(user)
            return
        } catch (err: any) {
            // notifyAndLog(`登录失败`, '用户 ' + user.displayName + ' 登录失败：' + err.message, true)
            wind.close()
            userRemove(user)
            // store.set('userList', newList)
            // ipc2RenderRefreshUserList()
            return
        }
    }
}
