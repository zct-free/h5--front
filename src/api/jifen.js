import axios from "../plugins/axios.js";
const baseUrl = "http://140.210.90.103:39080";

// 成长总积分
export const getczjf = params => {
  return axios.get(`${baseUrl}/integral/banking/total`, {
    params,
  });
};
// 兑换积分
export const getdhjf = params => {
  return axios.get(`${baseUrl}/integral/banking/convert`, {
    params,
  });
};
