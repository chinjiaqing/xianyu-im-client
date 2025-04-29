import { IpcMainEvents } from "@renderer/types";

export function send2main<T extends keyof IpcMainEvents>(event: T, ...args: Parameters<IpcMainEvents[T]>) {
    window.electron.ipcRenderer.send(event,...args)
}
