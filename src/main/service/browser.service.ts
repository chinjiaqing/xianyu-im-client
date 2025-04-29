import puppeteer from 'puppeteer-extra'
import StealPlugin from 'puppeteer-extra-plugin-stealth'
import { DEBUG_HOST, DEBUG_PORT, USER_AGENT } from '../config'
import http from 'http'
import { BrowserWindow } from 'electron'
import { v1 } from 'uuid'
import { Browser, Page } from 'puppeteer-core'

puppeteer.use(StealPlugin())

type DebugViewItem = {
    description: string
    devtoolsFrontendUrl: string
    id: string
    title: string
    type: string
    url: string
    webSocketDebuggerUrl: string
}

// 获取electron debug list
const getAppWsList = async (): Promise<DebugViewItem[]> =>
    new Promise((resolve, reject) => {
        let json = ''
        const request = http.request(`http://${DEBUG_HOST}:${DEBUG_PORT}/json/list`, (response) => {
            response.on('error', reject)
            response.on('data', (chunk: Buffer) => {
                json += chunk.toString()
            })
            response.on('end', () => resolve(JSON.parse(json)))
        })
        request.on('error', reject)
        request.end()
    })

class BrowserService {
    private browser: Browser | null = null

    async connect() {
        if (this.check()) return this.browser
        const json = await getAppWsList()
        const url = 'http://' + DEBUG_HOST + ':' + DEBUG_PORT + json[0].devtoolsFrontendUrl
        this.browser = await puppeteer.connect({
            browserURL: url,
            defaultViewport: null
        })
        return this.browser
    }
    private check() {
        return this.browser && this.browser.connected
    }
    async getPage(wind: BrowserWindow): Promise<Page | null> {
        if (!this.check()) {
            return null
        }
        const uid = v1()
        if (wind.webContents.getURL() === '') {
            // 默认加载一个空页面
            await wind.webContents.loadURL('about:blank')
        }
        //   一个electron window 对应一个 puppeteer page
        await wind.webContents.executeJavaScript(`window.__UNIQ_ID__="${uid}"`)
        const pages = await this.browser!.pages()
        const ids = await Promise.all(
            pages.map(async (page) => {
                try {
                    return await page.evaluate('window.__UNIQ_ID__')
                } catch {
                    return undefined
                }
            })
        )
        const index = ids.findIndex((id) => id === uid)
        await wind.webContents.executeJavaScript('delete window.__UNIQ_ID__')
        return pages[index] || null
    }

    async initPage(page: Page) {
        await page.setUserAgent(USER_AGENT)
        await page.evaluate(() => {
            const FINGERPRINT_CONFIG = {
                USER_AGENT:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                PLATFORM: 'Win64',
                LANGUAGES: ['zh-CN', 'zh']
            }

            // 核心浏览器特征修改函数
            const modifyBrowserFeatures = () => {
                // 覆盖自动化检测属性
                Object.defineProperties(navigator, {
                    webdriver: {
                        get: () => undefined,
                        configurable: true
                    },
                    userAgent: {
                        get: () => FINGERPRINT_CONFIG.USER_AGENT,
                        configurable: true
                    },
                    platform: {
                        get: () => FINGERPRINT_CONFIG.PLATFORM,
                        configurable: true
                    },
                    languages: {
                        get: () => FINGERPRINT_CONFIG.LANGUAGES,
                        configurable: true
                    }
                })
                // 修改WebGL渲染器信息（需在页面加载前执行）
                const getParameter = WebGLRenderingContext.prototype.getParameter
                WebGLRenderingContext.prototype.getParameter = function (parameter) {
                    if (parameter === 37446) return 'Intel HD Graphics 630'
                    return getParameter.call(this, parameter)
                }
            }
            modifyBrowserFeatures()
        })
    }
}


export default new BrowserService()