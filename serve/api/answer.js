import axios from "../../src/plugins/axios.js";
import {
    getCurrentUrl
} from "@/plugins/config";

let isMock = false;
// 分享试卷-获取
export function questionRuleGet(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/answerHistory/list`, {params});
}
//题目列表
export function questionList(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/question/list`, {params});
}
//答题记录
export function questionAdd(params) {
    return axios.post(`${getCurrentUrl('answer',isMock)}/answerHistory/add`, params);
}
// 月度答题答案解析
export function answerHistory(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/answerHistory/analysis`, {params});
}
//规则列表
export function questionRuleList(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/questionRule/list`, params);
}
//积分
export function integrateAdd(params) {
    return axios.post(`${getCurrentUrl('integrate',isMock)}report/data/produce?topic=INTEGRAL`, params);
}

//题组列表
export function questionGroupList(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/questionGroup/list`, {params});
}

// 成绩排行榜
export function questionRank(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/questionRule/rank`, {params});
}

//题组列表(题组)
export function GroupQuestionList(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/questionGroup/question/list`, {params});
}

//取题
export function getAnswerHistory(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/answerHistory/getResults`, {params});
}

//listById
export function getListById(params) {
    return axios.post(`${getCurrentUrl('answer',isMock)}/question/listById`, params);
}

//详情
export function getDetailMes(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/question/detailMes`, {params});
}
//pk  记录
export function todayScore(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/pk/todayScore`, {params});
}

//pk 用户信息
export function userInfo(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/pk/userInfo`, {params});
}

//机器人相关
export function AiGetQuestion(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/pk/getQuestion`, {params});
}

export function AiMoreQuestion(params) {
    return axios.get(`${getCurrentUrl('answer',isMock)}/pk/moreQuestion`, {params});
}
export function AiWin(params) {
    return axios.post(`${getCurrentUrl('answer',isMock)}/pk/win`, params);
}
// 机器人头像名字
export function robotInformation(params={}) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/robot/random`, {params});
}
// 查询本人pk积分是否本日达到上限
export function currentPoint(uuid) {
    return axios.get(`${getCurrentUrl('cmsApp',isMock)}/pk/currentPoint?uuid=${uuid}`);
}
