import axios from "../../src/plugins/axios.js";
import {
    getCurrentUrl
} from "@/plugins/config";
// const headers = {
//     "Content-Type": "application/json",
//     token: window.localStorage.getItem("token") || ""
// }

let isMock = false;
console.log(process.env, 'env')
// 分享试卷-获取
export function handleGetPaper(params) {
    return axios.post(`${getCurrentUrl('course',isMock)}/paperUser/theirPascalById`, params);
}

// 分享试卷-获取试卷分数，答题记录
export function handleGetTotalPoints(params) {
    return axios.post(`${getCurrentUrl('course',isMock)}/paperUser/pointsByUserId`, params);
}

// 分享试卷-试卷提交
export function submitPaper(params) {
    return axios.post(`${getCurrentUrl('course',isMock)}/paperUser/addUserRecord`, params);
}

/**
 * 个人中心--考试
 */

// 获取用户已完成试卷列表
export function getPaperListById(params) {
    return axios.post(`${getCurrentUrl('course',isMock)}/paperUser/userPapersList`, params);
}

// 获取试卷详情
export function getPaperDetail(params) {
    return axios.post(`${getCurrentUrl('course',isMock)}/paperUser/recordByUserId`, params);
}

// 删除用户已完成试卷记录
export function deletePaperItem(params) {
    return axios.get(`${getCurrentUrl('course',isMock)}/paperUser/dropPapersRecord`, {
        params
    });
}

/**
 * 排行榜
 */
export function getCourseList(params) {
    return axios.get(`${getCurrentUrl('course',isMock)}/course/librayListAll`, {
        params
    });
}