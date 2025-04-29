import { cookie2obj } from "../utils"
import xyJsModule from '../libs/xianyu_js_version_2.cjs'
import { API_PATH, APP_KEY, HEADERS } from "../config"
import axios from 'axios'
import qs from 'qs'

export class XyApiService {
    private cookie: Record<string, any>
    private deviceId: string
    private cookieStr: string
    constructor(cookieStr: string, deviceId: string) {
        this.cookieStr = cookieStr
        this.cookie = cookie2obj(this.cookieStr)
        this.deviceId = deviceId
    }

    generateParams(bodyDataStr: string) {
        const t = Date.now()
        const params = {
            jsv: '2.7.2',
            appKey: '34839810',
            t: t,
            sign: '',
            v: '1.0',
            type: 'originaljson',
            accountSite: 'xianyu',
            dataType: 'json',
            timeout: '20000',
            api: 'mtop.taobao.idlemessage.pc.login.token',
            sessionOption: 'AutoLoginOnly',
            spm_cnt: 'a21ybx.im.0.0'
        }
        params.sign = xyJsModule.generate_sign(
            t,
            this.cookie['_m_h5_tk'].split('_')[0],
            bodyDataStr
        )
        return params
    }

    async getToken() {
        const bodyDataStr = JSON.stringify({
            appKey: APP_KEY,
            deviceId: this.deviceId
        })
        const params = this.generateParams(bodyDataStr)
        const response = await axios.post(
            API_PATH,
            qs.stringify({
                data: bodyDataStr
            }),
            {
                params,
                headers: {
                    ...HEADERS,
                    Cookie: this.cookieStr
                }
            }
        )
        // ipc2RenderLog({
        //     subject: '获取token',
        //     body: JSON.stringify(response.data.data),
        //     channel: 'sys',
        //     status: response.data.data ? 1 : 0
        // })
        return response.data.data
    }
}
