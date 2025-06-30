import axios from "../../src/plugins/axios.js";
import {
    getCurrentUrl
} from "@/plugins/config";

let isMock = false;
// 党史上的今天查询
export function getHistoryToDay(params) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/history/toDay`, {
        params
    });
}