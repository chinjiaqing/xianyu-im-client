export interface LogItem {
    channel: 'user' | 'sys',
    datetime:string;
    subject:string;
    body:string;
    status: 1 | 0
}