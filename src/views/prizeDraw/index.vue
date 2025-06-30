<template>
  <div class="prize-draw-container">
    <!-- 背景装饰 -->
    <div class="background-decor">
      <div class="light-ray"></div>
      <div class="stars">
        <div class="star" v-for="i in 20" :key="i" :style="getStarStyle()"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="title-section">
      <h1 class="main-title">幸运转盘</h1>
      <p class="sub-title">转一转，好运来！</p>
    </div>

    <!-- 转盘容器 -->
    <div class="wheel-container">
      <!-- 转盘背景 -->
      <div class="wheel-bg">
        <!-- 转盘 -->
        <div class="wheel" :style="{ transform: `rotate(${rotateAngle}deg)` }" ref="wheel">
          <!-- 奖品扇形区域 -->
          <div class="prize-sector" v-for="(prize, index) in prizes" :key="index" :style="getSectorStyle(index)">
            <div class="prize-content" :style="getPrizeContentStyle()">
              <div class="prize-icon">
                <img :src="prize.icon" :alt="prize.name" v-if="prize.icon" />
                <span v-else class="default-icon">🎁</span>
              </div>
              <div class="prize-name">{{ prize.name }}</div>
            </div>
          </div>
        </div>

        <!-- 中心指针 -->
        <div class="pointer">
          <div class="pointer-inner"></div>
        </div>

        <!-- 抽奖按钮 -->
        <div class="draw-button" @click="startDraw" :class="{ disabled: isDrawing }">
          <div class="button-inner">
            <span v-if="!isDrawing">开始抽奖</span>
            <span v-else>抽奖中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="user-info">
      <div class="info-item">
        <span class="label">剩余次数：</span>
        <span class="value">{{ remainingTimes }}</span>
      </div>
      <div class="info-item">
        <span class="label">今日已抽：</span>
        <span class="value">{{ todayDraws }}</span>
      </div>
    </div>

    <!-- 中奖记录 -->
    <div class="records-section">
      <h3 class="section-title">中奖记录</h3>
      <div class="records-list" v-if="winRecords.length > 0">
        <div class="record-item" v-for="(record, index) in winRecords" :key="index">
          <div class="record-prize">{{ record.prizeName }}</div>
          <div class="record-time">{{ record.time }}</div>
        </div>
      </div>
      <div class="no-records" v-else>
        <p>暂无中奖记录</p>
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <van-dialog
      v-model="showWinDialog"
      :title="winDialogTitle"
      :show-cancel-button="false"
      confirm-button-text="确定"
      class="win-dialog"
    >
      <div class="win-content">
        <div class="win-icon">🎉</div>
        <div class="win-text">恭喜您获得</div>
        <div class="win-prize">{{ currentWinPrize }}</div>
      </div>
    </van-dialog>

    <!-- 规则弹窗 -->
    <van-dialog
      v-model="showRuleDialog"
      title="抽奖规则"
      :show-cancel-button="false"
      confirm-button-text="我知道了"
      class="rule-dialog"
    >
      <div class="rule-content">
        <div class="rule-item">1. 每人每天最多可抽奖3次</div>
        <div class="rule-item">2. 奖品数量有限，先到先得</div>
        <div class="rule-item">3. 活动最终解释权归平台所有</div>
      </div>
    </van-dialog>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <van-button type="info" size="large" @click="showRuleDialog = true" class="rule-btn"> 查看规则 </van-button>
    </div>
  </div>
</template>

<script>
import prizeDrawAPI from "@/api/prizeDraw";
import {
  calculateTargetAngle,
  createWheelAnimation,
  DEFAULT_PRIZES,
  formatTime,
  getPrizeContentStyle,
  getRandomPrizeByWeight,
  getSectorStyle,
  performDailyReset,
  shouldResetToday,
  StorageManager,
  validatePrizeConfig,
} from "@/utils/prizeDrawUtils";

export default {
  name: "PrizeDraw",
  data() {
    return {
      // 转盘旋转角度
      rotateAngle: 0,
      // 是否正在抽奖
      isDrawing: false,
      // 剩余抽奖次数
      remainingTimes: 3,
      // 今日已抽次数
      todayDraws: 0,
      // 奖品配置
      prizes: [...DEFAULT_PRIZES],
      // 中奖记录
      winRecords: [],
      // 弹窗控制
      showWinDialog: false,
      showRuleDialog: false,
      winDialogTitle: "恭喜中奖！",
      currentWinPrize: "",
      // 加载状态
      loading: false,
    };
  },
  async mounted() {
    await this.initializePage();
  },
  methods: {
    // 初始化页面数据
    async initializePage() {
      this.loading = true;

      try {
        // 检查是否需要每日重置
        if (shouldResetToday()) {
          performDailyReset();
        }

        await Promise.all([this.loadPrizeList(), this.loadUserData(), this.loadWinRecords()]);
      } catch (error) {
        console.error("初始化页面失败:", error);
        this.$toast("加载数据失败，请刷新页面重试");
      } finally {
        this.loading = false;
      }
    },

    // 加载奖品列表
    async loadPrizeList() {
      try {
        const response = await prizeDrawAPI.getPrizeList();
        if (response.code === 200 && response.data) {
          const prizes = response.data;
          if (validatePrizeConfig(prizes)) {
            this.prizes = prizes;
          } else {
            console.warn("奖品配置无效，使用默认配置");
          }
        }
      } catch (error) {
        console.error("加载奖品列表失败:", error);
        // 使用默认奖品配置
      }
    },

    // 开始抽奖
    async startDraw() {
      if (this.isDrawing) return;

      if (this.remainingTimes <= 0) {
        this.$toast("今日抽奖次数已用完");
        return;
      }

      this.isDrawing = true;

      try {
        // 调用抽奖接口
        const result = await this.callDrawAPI();

        // 计算中奖奖品的位置
        const winPrizeIndex = this.prizes.findIndex(p => p.id === result.prizeId);
        if (winPrizeIndex === -1) {
          throw new Error("未找到对应奖品");
        }

        const targetAngle = calculateTargetAngle(winPrizeIndex, this.prizes.length);

        // 执行转盘动画
        await this.animateWheel(targetAngle);

        // 显示中奖结果
        this.showWinResult(result);

        // 更新用户数据
        this.updateUserData();
      } catch (error) {
        console.error("抽奖失败:", error);
        this.$toast(error.message || "抽奖失败，请重试");
      } finally {
        this.isDrawing = false;
      }
    },

    // 调用抽奖接口
    async callDrawAPI() {
      try {
        const response = await prizeDrawAPI.performDraw();
        if (response.code === 200 && response.data) {
          return {
            prizeId: response.data.prizeId,
            prizeName: response.data.prizeName,
            prizeType: response.data.prizeType || "normal",
          };
        } else {
          throw new Error(response.message || "抽奖失败");
        }
      } catch (error) {
        // 如果API调用失败，使用模拟数据作为备选
        console.warn("API调用失败，使用模拟数据:", error);
        return new Promise(resolve => {
          setTimeout(() => {
            const winPrize = getRandomPrizeByWeight(this.prizes);
            resolve({
              prizeId: winPrize.id,
              prizeName: winPrize.name,
              prizeType: winPrize.type || "mock",
            });
          }, 500);
        });
      }
    },

    // 转盘动画
    animateWheel(targetAngle) {
      return createWheelAnimation(this.rotateAngle, targetAngle, 3000, currentAngle => {
        this.rotateAngle = currentAngle;
      });
    },

    // 显示中奖结果
    showWinResult(result) {
      this.currentWinPrize = result.prizeName;
      this.showWinDialog = true;

      // 添加到中奖记录
      const newRecord = {
        prizeName: result.prizeName,
        time: formatTime(new Date()),
        prizeId: result.prizeId,
        prizeType: result.prizeType || "normal",
      };

      this.winRecords.unshift(newRecord);

      // 限制记录数量
      if (this.winRecords.length > 10) {
        this.winRecords = this.winRecords.slice(0, 10);
      }

      // 保存到本地存储
      this.saveWinRecords();
    },

    // 更新用户数据
    updateUserData() {
      this.remainingTimes = Math.max(0, this.remainingTimes - 1);
      this.todayDraws++;

      // 保存到本地存储
      this.saveUserData();
    },

    // 加载用户数据
    async loadUserData() {
      try {
        // 优先从API获取
        const response = await prizeDrawAPI.getUserDrawInfo();
        if (response.code === 200 && response.data) {
          this.remainingTimes = response.data.remainingTimes || 0;
          this.todayDraws = response.data.todayDraws || 0;
          return;
        }
      } catch (error) {
        console.warn("从API加载用户数据失败，使用本地数据:", error);
      }

      // API失败则从本地存储加载
      this.remainingTimes = StorageManager.load("remainingTimes", 3);
      this.todayDraws = StorageManager.load("todayDraws", 0);
    },

    // 保存用户数据到本地
    saveUserData() {
      StorageManager.save("remainingTimes", this.remainingTimes);
      StorageManager.save("todayDraws", this.todayDraws);
    },

    // 加载中奖记录
    async loadWinRecords() {
      try {
        // 优先从API获取
        const response = await prizeDrawAPI.getWinRecords({ limit: 10 });
        if (response.code === 200 && response.data) {
          this.winRecords = response.data.map(record => ({
            prizeName: record.prizeName,
            time: formatTime(new Date(record.createTime)),
            prizeId: record.prizeId,
            prizeType: record.prizeType,
          }));
          return;
        }
      } catch (error) {
        console.warn("从API加载中奖记录失败，使用本地数据:", error);
      }

      // API失败则从本地存储加载
      this.winRecords = StorageManager.load("winRecords", []);
    },

    // 保存中奖记录到本地
    saveWinRecords() {
      StorageManager.save("winRecords", this.winRecords);
    },

    // 获取扇形样式
    getSectorStyle(index) {
      return getSectorStyle(index, this.prizes);
    },

    // 获取奖品内容样式
    getPrizeContentStyle() {
      return getPrizeContentStyle(this.prizes.length);
    },

    // 获取星星样式
    getStarStyle() {
      return {
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        animationDelay: Math.random() * 2 + "s",
      };
    },

    // 领取奖品
    async claimPrize(record) {
      try {
        const response = await prizeDrawAPI.claimPrize(record.prizeId);
        if (response.code === 200) {
          this.$toast("奖品领取成功！");
          // 刷新记录
          await this.loadWinRecords();
        } else {
          this.$toast(response.message || "领取失败");
        }
      } catch (error) {
        console.error("领取奖品失败:", error);
        this.$toast("领取失败，请重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.prize-draw-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.208rem; // 20px
  position: relative;
  overflow: hidden;

  .background-decor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;

    .light-ray {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6.25rem; // 600px
      height: 6.25rem; // 600px
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }

    .stars {
      position: absolute;
      width: 100%;
      height: 100%;

      .star {
        position: absolute;
        width: 0.021rem; // 2px
        height: 0.021rem; // 2px
        background: white;
        border-radius: 50%;
        animation: twinkle 2s infinite alternate;

        &::before {
          content: "";
          position: absolute;
          top: -0.01rem; // -1px
          left: -0.01rem; // -1px
          width: 0.042rem; // 4px
          height: 0.042rem; // 4px
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
          border-radius: 50%;
        }
      }
    }
  }

  .title-section {
    text-align: center;
    margin-bottom: 0.313rem; // 30px
    position: relative;
    z-index: 2;

    .main-title {
      font-size: 0.333rem; // 32px
      color: white;
      margin: 0 0 0.104rem 0; // 0 0 10px 0
      text-shadow: 0.021rem 0.021rem 0.042rem rgba(0, 0, 0, 0.3); // 2px 2px 4px
      font-weight: bold;
    }

    .sub-title {
      font-size: 0.167rem; // 16px
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }

  .wheel-container {
    display: flex;
    justify-content: center;
    margin-bottom: 0.313rem; // 30px
    position: relative;
    z-index: 2;

    .wheel-bg {
      position: relative;
      width: 3.125rem; // 300px
      height: 3.125rem; // 300px

      .wheel {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
        box-shadow: 0 0 0.313rem rgba(0, 0, 0, 0.3); // 0 0 30px
        background: #fff;

        .prize-sector {
          position: absolute;
          width: 50%;
          height: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          border-radius: 0 100% 0 0;
          overflow: hidden;

          .prize-content {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transform-origin: 0 100%;
            padding: 0.104rem; // 10px
            box-sizing: border-box;

            .prize-icon {
              font-size: 0.208rem; // 20px
              margin-bottom: 0.052rem; // 5px

              img {
                width: 0.25rem; // 24px
                height: 0.25rem; // 24px
                object-fit: contain;
              }

              .default-icon {
                font-size: 0.25rem; // 24px
              }
            }

            .prize-name {
              font-size: 0.125rem; // 12px
              font-weight: bold;
              text-align: center;
              color: white;
              text-shadow: 0.01rem 0.01rem 0.021rem rgba(0, 0, 0, 0.5); // 1px 1px 2px
              line-height: 1.2;
            }
          }
        }

        &::before {
          content: "";
          position: absolute;
          top: -0.052rem; // -5px
          left: -0.052rem; // -5px
          right: -0.052rem; // -5px
          bottom: -0.052rem; // -5px
          border-radius: 50%;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
          z-index: -1;
        }
      }

      .pointer {
        position: absolute;
        top: -0.104rem; // -10px
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 0.156rem solid transparent; // 15px
        border-right: 0.156rem solid transparent; // 15px
        border-top: 0.313rem solid #ff6b6b; // 30px
        z-index: 10;
        filter: drop-shadow(0 0.021rem 0.042rem rgba(0, 0, 0, 0.3)); // 0 2px 4px

        .pointer-inner {
          position: absolute;
          top: -0.26rem; // -25px
          left: -0.104rem; // -10px
          width: 0;
          height: 0;
          border-left: 0.104rem solid transparent; // 10px
          border-right: 0.104rem solid transparent; // 10px
          border-top: 0.208rem solid #fff; // 20px
        }
      }

      .draw-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.833rem; // 80px
        height: 0.833rem; // 80px
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0.042rem 0.156rem rgba(255, 107, 107, 0.4); // 0 4px 15px
        transition: all 0.3s ease;
        z-index: 10;

        &:hover {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 0.063rem 0.208rem rgba(255, 107, 107, 0.6); // 0 6px 20px
        }

        &:active {
          transform: translate(-50%, -50%) scale(0.95);
        }

        &.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: translate(-50%, -50%) scale(1) !important;
        }

        .button-inner {
          text-align: center;
          color: white;
          font-size: 0.146rem; // 14px
          font-weight: bold;
          text-shadow: 0.01rem 0.01rem 0.021rem rgba(0, 0, 0, 0.3); // 1px 1px 2px
        }

        &::before {
          content: "";
          position: absolute;
          top: -0.031rem; // -3px
          left: -0.031rem; // -3px
          right: -0.031rem; // -3px
          bottom: -0.031rem; // -3px
          border-radius: 50%;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          z-index: -1;
        }
      }
    }
  }

  .user-info {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.156rem; // 15px
    padding: 0.208rem; // 20px
    margin-bottom: 0.208rem; // 20px
    backdrop-filter: blur(0.104rem); // blur(10px)
    position: relative;
    z-index: 2;

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.104rem; // 10px
      color: white;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 0.167rem; // 16px
      }

      .value {
        font-size: 0.167rem; // 16px
        font-weight: bold;
        color: #ffd700;
      }
    }
  }

  .records-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.156rem; // 15px
    padding: 0.208rem; // 20px
    margin-bottom: 0.208rem; // 20px
    backdrop-filter: blur(0.104rem); // blur(10px)
    position: relative;
    z-index: 2;

    .section-title {
      color: white;
      font-size: 0.188rem; // 18px
      margin: 0 0 0.156rem 0; // 0 0 15px 0
      text-align: center;
    }

    .records-list {
      max-height: 2.083rem; // 200px
      overflow-y: auto;

      .record-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.104rem 0; // 10px 0
        border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1); // 1px
        color: white;

        &:last-child {
          border-bottom: none;
        }

        .record-prize {
          font-size: 0.146rem; // 14px
          font-weight: bold;
          color: #ffd700;
        }

        .record-time {
          font-size: 0.125rem; // 12px
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .no-records {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      padding: 0.208rem 0; // 20px 0

      p {
        margin: 0;
        font-size: 0.146rem; // 14px
      }
    }
  }

  .bottom-actions {
    position: relative;
    z-index: 2;

    .rule-btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.2);
      border: 0.01rem solid rgba(255, 255, 255, 0.3); // 1px
      color: white;
      backdrop-filter: blur(0.104rem); // blur(10px)

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 弹窗样式
:deep(.win-dialog) {
  .van-dialog__content {
    .win-content {
      text-align: center;
      padding: 0.208rem; // 20px

      .win-icon {
        font-size: 0.5rem; // 48px
        margin-bottom: 0.156rem; // 15px
      }

      .win-text {
        font-size: 0.167rem; // 16px
        color: #666;
        margin-bottom: 0.104rem; // 10px
      }

      .win-prize {
        font-size: 0.208rem; // 20px
        font-weight: bold;
        color: #ff6b6b;
      }
    }
  }
}

:deep(.rule-dialog) {
  .van-dialog__content {
    .rule-content {
      padding: 0.208rem; // 20px

      .rule-item {
        margin-bottom: 0.156rem; // 15px
        line-height: 1.5;
        color: #666;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 动画定义
@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .prize-draw-container {
    padding: 0.156rem; // 15px

    .title-section {
      .main-title {
        font-size: 0.292rem; // 28px
      }
    }

    .wheel-container {
      .wheel-bg {
        width: 2.917rem; // 280px
        height: 2.917rem; // 280px

        .draw-button {
          width: 0.729rem; // 70px
          height: 0.729rem; // 70px

          .button-inner {
            font-size: 0.125rem; // 12px
          }
        }
      }
    }
  }
}
</style>
