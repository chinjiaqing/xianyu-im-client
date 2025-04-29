export const DEBUG_PORT:string = '1777' as const
export const DEBUG_HOST:string = 'localhost' as const
export const USER_AGENT:string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36' as const
export const APP_KEY = '444e9908a51d1cb236a27862abc769c9' as const
export const API_PATH = `https://h5api.m.goofish.com/h5/mtop.taobao.idlemessage.pc.login.token/1.0/` as const
export const HEADERS = {
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    origin: 'https://www.goofish.com',
    pragma: 'no-cache',
    priority: 'u=1, i',
    referer: 'https://www.goofish.com/',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': USER_AGENT
} as const
