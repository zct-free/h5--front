/**
 * 转盘抽奖工具函数
 */

// 默认奖品配置
export const DEFAULT_PRIZES = [
  { id: 1, name: "一等奖", icon: "", probability: 0.05, color: "#ff6b6b", type: "physical" },
  { id: 2, name: "二等奖", icon: "", probability: 0.1, color: "#feca57", type: "physical" },
  { id: 3, name: "三等奖", icon: "", probability: 0.15, color: "#48dbfb", type: "physical" },
  { id: 4, name: "谢谢参与", icon: "", probability: 0.3, color: "#ff9ff3", type: "none" },
  { id: 5, name: "积分奖励", icon: "", probability: 0.2, color: "#54a0ff", type: "points" },
  { id: 6, name: "再来一次", icon: "", probability: 0.15, color: "#5f27cd", type: "extra" },
  { id: 7, name: "小礼品", icon: "", probability: 0.04, color: "#00d2d3", type: "gift" },
  { id: 8, name: "惊喜大奖", icon: "", probability: 0.01, color: "#ff6348", type: "special" },
];

/**
 * 根据概率权重随机选择奖品
 * @param {Array} prizes 奖品数组
 * @returns {Object} 选中的奖品
 */
export function getRandomPrizeByWeight(prizes = DEFAULT_PRIZES) {
  // 计算总权重
  const totalWeight = prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0);

  if (totalWeight === 0) {
    return prizes[Math.floor(Math.random() * prizes.length)];
  }

  // 生成随机数
  const random = Math.random() * totalWeight;
  let currentWeight = 0;

  // 根据权重选择奖品
  for (let i = 0; i < prizes.length; i++) {
    currentWeight += prizes[i].probability || 0;
    if (random <= currentWeight) {
      return prizes[i];
    }
  }

  // 默认返回最后一个奖品
  return prizes[prizes.length - 1];
}

/**
 * 计算转盘目标角度
 * @param {number} prizeIndex 中奖奖品索引
 * @param {number} totalPrizes 总奖品数量
 * @param {number} extraRotations 额外转动圈数
 * @returns {number} 目标角度
 */
export function calculateTargetAngle(prizeIndex, totalPrizes, extraRotations = 5) {
  const sectorAngle = 360 / totalPrizes;
  const prizeAngle = sectorAngle * prizeIndex + sectorAngle / 2;
  const randomExtra = Math.random() * 5; // 0-5圈随机
  return 360 * (extraRotations + randomExtra) + (360 - prizeAngle);
}

/**
 * 获取扇形CSS样式
 * @param {number} index 奖品索引
 * @param {Array} prizes 奖品数组
 * @returns {Object} CSS样式对象
 */
export function getSectorStyle(index, prizes) {
  const sectorAngle = 360 / prizes.length;
  const rotateAngle = sectorAngle * index;

  return {
    transform: `rotate(${rotateAngle}deg)`,
    background: `conic-gradient(from 0deg, ${prizes[index].color} 0deg, ${prizes[index].color} ${sectorAngle}deg, transparent ${sectorAngle}deg)`,
    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((sectorAngle * Math.PI) / 180)}% ${
      50 - 50 * Math.cos((sectorAngle * Math.PI) / 180)
    }%)`,
  };
}

/**
 * 获取奖品内容样式
 * @param {number} totalPrizes 总奖品数量
 * @returns {Object} CSS样式对象
 */
export function getPrizeContentStyle(totalPrizes) {
  const sectorAngle = 360 / totalPrizes;
  return {
    transform: `rotate(${sectorAngle / 2}deg) translateX(60px)`,
    transformOrigin: "0 0",
  };
}

/**
 * 创建转盘动画
 * @param {number} startAngle 起始角度
 * @param {number} targetAngle 目标角度
 * @param {number} duration 动画时长（毫秒）
 * @param {Function} updateCallback 更新回调函数
 * @returns {Promise} 动画Promise
 */
export function createWheelAnimation(startAngle, targetAngle, duration = 3000, updateCallback) {
  return new Promise(resolve => {
    const startTime = Date.now();

    function animate() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数（三次贝塞尔曲线）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;

      updateCallback(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve(currentAngle);
      }
    }

    animate();
  });
}

/**
 * 验证奖品配置
 * @param {Array} prizes 奖品数组
 * @returns {boolean} 是否有效
 */
export function validatePrizeConfig(prizes) {
  if (!Array.isArray(prizes) || prizes.length === 0) {
    return false;
  }

  // 检查必要字段
  for (let prize of prizes) {
    if (!prize.id || !prize.name) {
      return false;
    }
  }

  // 检查概率总和（允许一定误差）
  const totalProbability = prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0);
  if (Math.abs(totalProbability - 1) > 0.01) {
    console.warn("奖品概率总和不等于1:", totalProbability);
  }

  return true;
}

/**
 * 格式化时间显示
 * @param {Date|string|number} date 日期
 * @param {string} format 格式类型：'time'|'date'|'datetime'
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date, format = "time") {
  const dateObj = new Date(date);
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();

  switch (format) {
    case "time":
      return isToday ? dateObj.toTimeString().slice(0, 5) : dateObj.toLocaleDateString();
    case "date":
      return dateObj.toLocaleDateString();
    case "datetime":
      return dateObj.toLocaleString();
    default:
      return dateObj.toString();
  }
}

/**
 * 本地存储管理
 */
export const StorageManager = {
  // 键名前缀
  PREFIX: "prizeDraw_",

  // 保存数据
  save(key, data) {
    try {
      const value = typeof data === "object" ? JSON.stringify(data) : String(data);
      localStorage.setItem(this.PREFIX + key, value);
      return true;
    } catch (error) {
      console.error("保存数据失败:", error);
      return false;
    }
  },

  // 读取数据
  load(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this.PREFIX + key);
      if (value === null) return defaultValue;

      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error("读取数据失败:", error);
      return defaultValue;
    }
  },

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (error) {
      console.error("删除数据失败:", error);
      return false;
    }
  },

  // 清空所有相关数据
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("清空数据失败:", error);
      return false;
    }
  },
};

/**
 * 检查今日是否已重置
 * @returns {boolean} 是否需要重置
 */
export function shouldResetToday() {
  const lastResetDate = StorageManager.load("lastResetDate");
  const today = new Date().toDateString();

  return lastResetDate !== today;
}

/**
 * 执行每日重置
 */
export function performDailyReset() {
  const today = new Date().toDateString();

  // 重置抽奖次数
  StorageManager.save("remainingTimes", 3);
  StorageManager.save("todayDraws", 0);
  StorageManager.save("lastResetDate", today);

  console.log("执行每日重置");
}

export default {
  DEFAULT_PRIZES,
  getRandomPrizeByWeight,
  calculateTargetAngle,
  getSectorStyle,
  getPrizeContentStyle,
  createWheelAnimation,
  validatePrizeConfig,
  formatTime,
  StorageManager,
  shouldResetToday,
  performDailyReset,
};
