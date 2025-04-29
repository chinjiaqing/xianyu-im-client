
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
export interface IpcMainEvents {
    userList:()=> GooFishUser[];
    userGet:(id:string)=> GooFishUser | undefined;
    userRemove: (user:GooFishUser)=>void;
    userAdd:(user:GooFishUser)=>void;

    xianyuRead: (userId:string)=>void;
    xianyuUnread:(userId:string)=>void;
    xianyuReLogin: (userId:string)=>void;
    xianyuLogin:()=>void;
}