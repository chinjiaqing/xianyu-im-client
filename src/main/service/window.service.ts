import { BrowserWindow } from 'electron'

class WindowService {
    createXyWindow() {
        const wind = new BrowserWindow({
            width: 1200,
            height: 900,
            show: true,
            autoHideMenuBar: true,
            icon: '',
            webPreferences: {
                sandbox: false,
                partition: new Date().getTime() + '',
                contextIsolation: false,
                webSecurity: false,
                allowRunningInsecureContent: true
            }
        })
        wind.on('close', () => {
            wind.destroy()
        })
        return wind
    }
}

export default new WindowService()