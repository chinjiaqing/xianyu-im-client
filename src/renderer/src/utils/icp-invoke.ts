import { IpcInvokeEvents } from "@renderer/types";

export function ipcInvoke<T extends keyof IpcInvokeEvents>(event: T, ...args: Parameters<IpcInvokeEvents[T]>) {
    return window.electron.ipcRenderer.invoke(event,...args)
}
