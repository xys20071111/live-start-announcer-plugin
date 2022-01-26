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
        vibrate: false,
      }
    }
  }
  if (vibrate) {
    notification.data.notification.vibrate = vibrate;
  }
  const notificationJson = JSON.stringify(notification);
  const req = https.request({
    host: 'push.ubports.com',
    path: '/notify',
    headers: {
      "Content-type": 'application/json',
      "Content-Length": notificationJson.length
    },
    method: 'POST'
  });
  req.write(notificationJson);

  req.end();
}
