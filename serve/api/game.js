import axios from "../../src/plugins/axios.js";
import {
    getCurrentUrl
} from "@/plugins/config";

let isMock = false;
// 获取游戏列表
export function getGameList(params) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/game/list`, {
        params
    });
}