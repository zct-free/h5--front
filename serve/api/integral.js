import axios from "../../src/plugins/axios.js";
import {
    getCurrentUrl
} from "@/plugins/config";

let isMock = false;

// 查询全部奖品类型
export function queryPrizesType(params) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/prize/query/type`, {params});
}
// 奖品列表
export function queryPrizesList(params) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/prize/query`, {params});
}
//奖品兑换
export function exchangePrizes(params) {
    return axios.post(`${getCurrentUrl('cmsApp',isMock)}/prize/exchange`, params);
}
//兑换记录
export function exchangeHistory(params) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/prize/exchangeHistory`, {params});
}

//查询是否能兑换
export function valiexchange(params){
    return axios.post(`${getCurrentUrl('cmsApp',isMock)}/prize/verifyPrize`, params);
}

export function sendMsgInfo(params) {
    return axios.post(`${getCurrentUrl('vote',isMock)}/vote/
    `, {...params});
}

// export function sendMsg(params){
//     return axios.post(`${getCurrentUrl('im',isMock)}/user/flowSendCode`, params);
// }
// // /im/user/flowSendCode
// export function verifyCode(params){
//     return axios.post(`${getCurrentUrl('im',isMock)}/user/flow/verifyCode`, params);
// }
// // /im/user/flow/verifyCode