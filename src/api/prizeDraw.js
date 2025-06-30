import request from "@/plugins/http";

// 抽奖相关API
export const prizeDrawAPI = {
  // 获取用户抽奖信息
  getUserDrawInfo() {
    return request({
      url: "/api/prize-draw/user-info",
      method: "GET",
    });
  },

  // 执行抽奖
  performDraw() {
    return request({
      url: "/api/prize-draw/draw",
      method: "POST",
    });
  },

  // 获取奖品列表
  getPrizeList() {
    return request({
      url: "/api/prize-draw/prizes",
      method: "GET",
    });
  },

  // 获取中奖记录
  getWinRecords(params = {}) {
    return request({
      url: "/api/prize-draw/records",
      method: "GET",
      params,
    });
  },

  // 获取抽奖规则
  getDrawRules() {
    return request({
      url: "/api/prize-draw/rules",
      method: "GET",
    });
  },

  // 领取奖品
  claimPrize(prizeId) {
    return request({
      url: "/api/prize-draw/claim",
      method: "POST",
      data: { prizeId },
    });
  },
};

export default prizeDrawAPI;
