import * as https from 'https';
import { Card, Vibrate, pushNotificationObject } from './INotification';

export default function pushNotification(appid: string, token: string, card: Card, vibrate: boolean | Vibrate | null): void {
  const approxExpire = new Date();
  approxExpire.setUTCMinutes(approxExpire.getUTCMinutes() + 10);
  const notification: pushNotificationObject = {
    appid,
    token,
    expire_on: approxExpire.toISOString(),
    data: {
      notification: {
        card,
        vibrate: true,
        sound: true
      }
    }
  }
  if (vibrate) {
    notification.data.notification.vibrate = vibrate;
  }
  const notificationJson = JSON.stringify(notification);
  try {
    const req = https.request({
      host: 'push.ubports.com',
      path: '/notify',
      headers: {
        "Content-type": 'application/json',
        "Content-Length": notificationJson.length
      },
      method: 'POST'
    });
    req.on('response', res => {
      try {
        res.setEncoding('utf8');
        let data = '';
        res.on('end', () => console.log('[开播通知插件] 推送成功'));
      } catch (e) { }
    });
    req.on('error', () => console.log('[开播通知插件] 推送失败'))
    req.write(notificationJson);

    req.end();
  } catch (e) {
    console.warn(`[开播通知插件] 推送失败，错误详情: ${e}`);
  }
}
