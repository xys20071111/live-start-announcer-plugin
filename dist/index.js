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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
const fs = __importStar(require("fs"));
const pushNotification_1 = __importDefault(require("./pushNotification"));
const config = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, '../config.json'), { encoding: 'utf-8' }));
let roomId = 0;
const ws = new ws_1.WebSocket(`ws://127.0.0.1:${config.api_port}/`);
const APIMsgHandler = new events_1.EventEmitter();
APIMsgHandler.on('ROOMID', (newRoomId) => {
    console.log(`插件工作在${newRoomId}`);
    roomId = newRoomId;
});
APIMsgHandler.on('AUTH', (data) => {
    if (data === 'AUTHED') {
        console.log('已连接到websocket API');
        ws.send(JSON.stringify({ cmd: "ROOMID", data: "" }));
    }
});
APIMsgHandler.on("LIVE", () => {
    console.log('推送直播开始通知');
    (0, pushNotification_1.default)(config.push_app, config.push_token, {
        summary: encodeURIComponent("直播开始啦"),
        body: encodeURIComponent(`直播间 ${roomId} 开始直播啦`),
        persist: true,
        popup: true
    }, true);
});
APIMsgHandler.on("PREPARING", () => {
    console.log('推送直播结束通知');
    (0, pushNotification_1.default)(config.push_app, config.push_token, {
        summary: encodeURIComponent("直播结束了"),
        body: encodeURIComponent(`直播间 ${roomId} 结束直播了`),
        persist: true,
        popup: true
    }, true);
});
ws.on('message', (rawData) => {
    try {
        const msg = JSON.parse(rawData);
        console.log(msg);
        APIMsgHandler.emit(msg.cmd, msg.data);
    }
    catch (e) {
        console.log(e);
    }
});
ws.on('open', () => ws.send(JSON.stringify({ cmd: 'AUTH', data: config.api_token })));
