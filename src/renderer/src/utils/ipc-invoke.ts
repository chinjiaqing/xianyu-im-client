import { IpcMainEvents } from "@renderer/types";

export function invokeEvent<T extends keyof IpcMainEvents>(event: T, ...args: Parameters<IpcMainEvents[T]>) {
    console.log('%c [ event ]-4', 'font-size:13px; background:pink; color:#bf2c9f;', event)
    window.electron.ipcRenderer.send(event,...args)
}
