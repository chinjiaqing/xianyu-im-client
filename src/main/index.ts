import { app, shell, BrowserWindow } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DEBUG_HOST, DEBUG_PORT } from './config'
import browserService from './service/browser.service'
import "./ipc.main"
async function createWindow(): Promise<void> {

    const mainWindow = new BrowserWindow({
        width: 375,
        height: 667,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            allowRunningInsecureContent: true,
            webSecurity: true
        }
        // frame:false,
        // transparent:true,
        // backgroundColor:'#00000000',
        // resizable:false
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    mainWindow.on('close',()=>{
        app.quit()
    })
    
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// set debugport
app.commandLine.appendSwitch('remote-debugging-port', DEBUG_PORT)
app.commandLine.appendSwitch('remote-debugging-address', DEBUG_HOST)
app.commandLine.appendSwitch('disable-web-security', 'NetworkService')
app.commandLine.appendSwitch('user-data-dir', path.resolve(__dirname, '/temp/chrome'))
app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        // bindPuppeteer()
        browserService.connect()
        optimizer.watchWindowShortcuts(window)
    })

    // 注册ipcMain 事件监听
    // registerAllService()
    // 创建window
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    // quitePuppeteer()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
