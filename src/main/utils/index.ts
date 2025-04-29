// cookie转换为对象
export function cookie2obj(cookieStr: string) {
    return cookieStr.split('; ').reduce((acc, pair) => {
        const [key, ...values] = pair.split('=')
        acc[key] = values.join('=')
        return acc
    }, {})
}

// cookie数组转换为string
export function array2cookie(cookies: any[]) {
    const keyValues = cookies.map((cookie) => {
        return `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`
    })
    return keyValues.join('; ')
}

export const delay = (time: number = 1000) => new Promise((resolve) => setTimeout(resolve, time))

export async function waitFor(
    judgeFunc: () => boolean,
    maxSec: number = 5,
    intervalMs: number = 1000
): Promise<void> {
    const startTime = Date.now()
    const maxTime = maxSec * 1000 // 将秒转换为毫秒

    while (Date.now() - startTime < maxTime) {
        if (judgeFunc()) {
            return Promise.resolve()
        }
        await delay(intervalMs)
    }

    return Promise.reject(new Error(`Timeout after ${maxSec} seconds`))
}
