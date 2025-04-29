
export interface GooFishUser {
    displayName: string
    userId: string
    cookies: any[]
    lastLogin: string
    avatar: string
    accessToken: string;
    online:boolean,
    unread:boolean
}

export interface LogItem {
    datetime:string;
    subject:string;
    body:string;
    status: 1 | 0
}
export interface IpcMainEvents {
    userGet:(id:string)=> GooFishUser | undefined;
    userRemove: (user:GooFishUser)=>void;
    userAdd:(user:GooFishUser)=>void;

    xianyuRead: (userId:string)=>void;
    xianyuUnread:(userId:string)=>void;
    xianyuReLogin: (userId:string)=>void;
    xianyuLogin:()=>void;
    xianyuImLogout: (user:GooFishUser)=>void;
    xianyuImLogin: (user:GooFishUser)=>void;

    onMounted:()=>void
}

export interface IpcRendererEvents {
    refreshUserList:()=>void
    log: (log:LogItem)=>void
}

export interface IpcInvokeEvents {
    userList:()=> GooFishUser[];
}