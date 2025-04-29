import { IpcRendererEvents } from "@shared/types";
export function addEvent<T extends keyof IpcRendererEvents>(event: T, listener: IpcRendererEvents[T]) {
    window.electron.ipcRenderer.on(event, (_,params)=>listener(params))
}
