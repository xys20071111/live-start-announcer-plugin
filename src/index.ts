import { WebSocket } from "ws";
import path from "path";
import { EventEmitter } from "events";
import * as fs from 'fs'
import IConfig from "./IConfig";
import pushNotification from "./pushNotification";

interface Message {
	cmd: string
	data: any
}

const config: IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), { encoding: 'utf-8' }));
let roomId = 0;

const ws = new WebSocket(`ws://127.0.0.1:${config.api_port}/`)
const APIMsgHandler = new EventEmitter();

APIMsgHandler.on('ROOMID', (newRoomId: number) => {
	console.log(`插件工作在${newRoomId}`);
	roomId = newRoomId;
})

APIMsgHandler.on('AUTH', (data) => {
	if (data === 'AUTHED') {
		console.log('已连接到websocket API')
		ws.send(JSON.stringify({ cmd: "ROOMID", data: "" }));
	}
})

APIMsgHandler.on("LIVE", () => {
	console.log('推送直播开始通知')
	try {
		pushNotification(config.push_app, config.push_token, {
			summary: encodeURIComponent("直播开始啦"),
			body: encodeURIComponent(`直播间 ${roomId} 开始直播啦`),
			persist: true,
			popup: true
		}, true);
	} catch (e) {
		console.log('推送失败，原因： ' + e)
	}

});

APIMsgHandler.on("PREPARING", () => {
	console.log('推送直播结束通知')
	try {
		pushNotification(config.push_app, config.push_token, {
			summary: encodeURIComponent("直播结束了"),
			body: encodeURIComponent(`直播间 ${roomId} 结束直播了`),
			persist: true,
			popup: true
		}, true);
	} catch (e) {
		console.log('推送失败，原因： ' + e)
	}
});

ws.on('message', (rawData: string) => {
	try {
		const msg: Message = JSON.parse(rawData)
		APIMsgHandler.emit(msg.cmd, msg.data)
	} catch (e) {
		console.log(e)
	}
});

ws.on('open', () => ws.send(JSON.stringify({ cmd: 'AUTH', data: config.api_token })))
