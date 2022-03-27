"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
function pushNotification(appid, token, card, vibrate) {
    const approxExpire = new Date();
    approxExpire.setUTCMinutes(approxExpire.getUTCMinutes() + 10);
    const notification = {
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
    };
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
            }
            catch (e) { }
        });
        req.on('error', () => console.log('[开播通知插件] 推送失败'));
        req.write(notificationJson);
        req.end();
    }
    catch (e) {
        console.warn(`[开播通知插件] 推送失败，错误详情: ${e}`);
    }
}
exports.default = pushNotification;
