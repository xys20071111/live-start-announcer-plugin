// 定义来自 https://docs.ubports.com/zh_CN/latest/appdev/guides/pushnotifications.html
export interface Vibrate {
  pattern: Array<number>;
  repeat: number;
}

export interface Card {
  summary: string;
  body?: string;
  actions?: Array<string>;
  icon?: string;
  timestamp?: number;
  persist: boolean;
  popup: boolean;
}

export interface EmblemCounter {
  counter: number;
  visible: boolean;
}

export interface Notification {
  tag?: string;
  sound?: string | boolean;
  vibrate?: boolean | Vibrate;
  "emblem-counter"?: EmblemCounter;
  card: Card;
}

interface Data {
  notification: Notification;
  message?: any;
}

export interface pushNotificationObject {
  appid: string;
  expire_on: string;
  token: string;
  data: Data;
  clear_pending?: boolean;
  replace_tag?: string;
}
