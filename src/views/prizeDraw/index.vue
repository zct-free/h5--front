<template>
  <div class="turntable-container">
    <!-- 转盘背景（只包含奖品区域） -->
    <div class="turntable-wheel" :style="wheelStyle" ref="wheel">
      <div v-for="(prize, index) in prizes" :key="index" class="prize-item" :style="getPrizeStyle(index)">
        <div class="prize-content">
          <img :src="prize.icon" class="prize-icon" v-if="prize.icon" />
          <div class="prize-name">{{ prize.name }}</div>
        </div>
      </div>
    </div>

    <!-- 中心按钮（独立于转盘） -->
    <div class="center-button-container">
      <div class="turntable-btn" @click="startLottery" :class="{ disabled: isRotating }">开始抽奖</div>
    </div>

    <!-- 指针 -->
    <div class="turntable-pointer"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRotating: false,
      currentRotation: 0,
      resultIndex: -1,
      prizes: [
        { name: "一等奖", icon: require("@/assets/rank-r1.png"), color: "#FF5252" },
        { name: "二等奖", icon: require("@/assets/rank-r2.png"), color: "#FF9800" },
        { name: "三等奖", icon: require("@/assets/rank-r3.png"), color: "#FF9800" },
      ],
    };
  },
  computed: {
    wheelStyle() {
      return {
        transform: `rotate(${this.currentRotation}deg)`,
        transition: this.isRotating ? "transform 4s ease-out" : "none",
      };
    },
    prizeCount() {
      return this.prizes.length;
    },
    sectorAngle() {
      return 360 / this.prizeCount;
    },
  },
  methods: {
    getPrizeStyle(index) {
      const angle = this.sectorAngle * index;
      return {
        transform: `rotate(${angle}deg)`,
        backgroundColor: this.prizes[index].color || this.getRandomColor(),
      };
    },
    getRandomColor() {
      const colors = ["#FF5252", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    startLottery() {
      if (this.isRotating) return;

      this.isRotating = true;
      this.resultIndex = -1;

      // 模拟API请求
      this.fetchLotteryResult()
        .then(result => {
          this.rotateToPrize(result.prizeIndex);
        })
        .catch(err => {
          console.error("抽奖失败:", err);
          this.isRotating = false;
        });
    },
    fetchLotteryResult() {
      // 实际项目中替换为真实的API调用
      return new Promise(resolve => {
        setTimeout(() => {
          // 随机选择奖品，实际项目中由后端决定
          const prizeIndex = Math.floor(Math.random() * this.prizeCount);
          resolve({ prizeIndex });
        }, 500);
      });
    },
    rotateToPrize(prizeIndex) {
      const fullRotations = 5; // 完整旋转圈数
      const targetAngle = 360 * fullRotations + (360 - (this.sectorAngle * prizeIndex + this.sectorAngle / 2));

      this.currentRotation = this.currentRotation % 360;
      this.currentRotation += targetAngle;

      setTimeout(() => {
        this.isRotating = false;
        this.resultIndex = prizeIndex;
        this.showPrizeResult();
      }, 4000); // 匹配CSS过渡时间
    },
    showPrizeResult() {
      const prize = this.prizes[this.resultIndex];
      this.$emit("result", prize);

      // 显示中奖弹窗
      this.$dialog.alert({
        title: "恭喜中奖",
        message: `您获得了: ${prize.name}`,
        confirmButtonText: "确定",
      });
    },
    simulateWin(index) {
      if (this.isRotating) return;
      this.rotateToPrize(index);
    },
  },
};
</script>

<style scoped>
.turntable-container {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
}

.turntable-wheel {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 50%;
  background: #fff9c4;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.prize-item {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 0;
  transform-origin: left bottom;
}

.prize-content {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(15deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  box-sizing: border-box;
}

.prize-icon {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.prize-name {
  font-size: 12px;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  writing-mode: vertical-rl;
}

/* 中心按钮容器 */
.center-button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  z-index: 10; /* 确保在转盘上方 */
  pointer-events: none; /* 允许点击事件穿透到下方元素 */
}

/* 抽奖按钮 */
.turntable-btn {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ff5722;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  pointer-events: auto; /* 重新启用按钮的点击事件 */
}

.turntable-btn:active {
  transform: scale(0.95);
}

.turntable-btn.disabled {
  background: #9e9e9e;
  cursor: not-allowed;
}

/* 指针 */
.turntable-pointer {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 24px solid #ff5722;
  z-index: 15; /* 确保在最上层 */
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
}
</style>
