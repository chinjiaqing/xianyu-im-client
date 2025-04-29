import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {}

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

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        modifyBrowserFeatures()
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api

    modifyBrowserFeatures()
}
