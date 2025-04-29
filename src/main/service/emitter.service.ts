import { EventEmitter } from 'events'

interface AppMainEvents {
    newMsg: (content:string)=>void
}

class AppEmitter {
    private emitter:EventEmitter
    constructor(){
        this.emitter = new EventEmitter()
    }
    on<T extends keyof AppMainEvents>(event: T, listener: AppMainEvents[T]) {
        this.emitter.on(event, listener)
    }

    emit<T extends keyof AppMainEvents>(event: T, ...args: Parameters<AppMainEvents[T]>) {
        this.emitter.emit(event, ...args)
    }
}

export default new AppEmitter()