<template>
  <div class="honor-profile-page">
    <!-- 背景装饰 -->
    <div class="background-layer">
      <div class="stars"></div>
      <div class="gradient"></div>
    </div>

    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-btn" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="nav-title">个人主页</div>
      <div class="nav-btn" @click="showSettings">
        <i class="iconfont icon-settingla"></i>
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        <img :src="userAvatar" alt="头像" />
        <div class="avatar-ring"></div>
      </div>
      <div class="user-info">
        <div class="username">{{ username }}</div>
        <div class="user-id">ID: {{ userId }}</div>
      </div>
    </div>

    <!-- 段位展示 -->
    <div class="rank-section">
      <div class="rank-card">
        <div class="rank-badge">
          <img :src="rankIcon" class="rank-img" />
          <div class="rank-details">
            <div class="rank-name">{{ rankName }}</div>
            <div class="rank-stars">
              <span v-for="n in 5" :key="n" :class="['star', n <= rankStars ? 'active' : '']">★</span>
            </div>
          </div>
        </div>
        <div class="rank-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ currentScore }}/{{ nextLevelScore }}</div>
        </div>
      </div>
    </div>

    <!-- 积分银行 -->
    <div class="score-section">
      <div class="score-header">
        <img src="@/assets/reditrank/goldcoin.png" class="coin-img" />
        <span class="score-title">积分银行</span>
      </div>
      <div class="score-info">
        <div class="score-item">
          <div class="score-num">{{ totalScore }}</div>
          <div class="score-text">总积分</div>
        </div>
        <div class="score-item">
          <div class="score-num">{{ availableScore }}</div>
          <div class="score-text">可用积分</div>
        </div>
      </div>
    </div>

    <!-- 荣耀勋章 -->
    <div class="medal-section">
      <div class="section-header">
        <span class="header-icon">🏆</span>
        <span class="header-title">荣耀勋章</span>
      </div>
      <div class="medal-grid">
        <div
          v-for="medal in medals"
          :key="medal.id"
          :class="['medal-item', medal.unlocked ? 'unlocked' : 'locked']"
          @click="showMedalDetail(medal)"
        >
          <div class="medal-icon">
            <img :src="medal.icon" />
            <div v-if="medal.unlocked" class="medal-glow"></div>
          </div>
          <div class="medal-name">{{ medal.name }}</div>
          <div v-if="!medal.unlocked" class="medal-progress">{{ medal.current }}/{{ medal.total }}</div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-num">{{ stats.questions }}</div>
          <div class="stat-label">累计答题</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.accuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.days }}</div>
          <div class="stat-label">学习天数</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.rank }}</div>
          <div class="stat-label">当前排名</div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="actions-section">
      <div class="action-grid">
        <div class="action-item" @click="goToShop">
          <img src="@/assets/reditrank/积分商城.png" />
          <span>积分商城</span>
        </div>
        <div class="action-item" @click="goToRank">
          <img src="@/assets/reditrank/排行榜.png" />
          <span>排行榜</span>
        </div>
        <div class="action-item" @click="goToDetail">
          <img src="@/assets/reditrank/积分明细.png" />
          <span>积分明细</span>
        </div>
        <div class="action-item" @click="goToRecord">
          <img src="@/assets/reditrank/打款明细.png" />
          <span>兑换记录</span>
        </div>
      </div>
    </div>

    <!-- 勋章详情弹窗 -->
    <van-popup v-model="showMedalDialog" position="center" class="medal-popup">
      <div class="medal-detail" v-if="selectedMedal">
        <div class="detail-header">
          <img :src="selectedMedal.icon" class="detail-icon" />
          <div class="detail-info">
            <div class="detail-title">{{ selectedMedal.name }}</div>
            <div class="detail-desc">{{ selectedMedal.description }}</div>
          </div>
        </div>
        <div class="detail-content">
          <div v-if="selectedMedal.unlocked" class="unlock-info">
            <p>获得时间：{{ selectedMedal.unlockTime }}</p>
          </div>
          <div v-else class="progress-info">
            <p>进度：{{ selectedMedal.current }}/{{ selectedMedal.total }}</p>
            <div class="detail-progress">
              <div
                class="detail-progress-fill"
                :style="{ width: (selectedMedal.current / selectedMedal.total) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div class="detail-actions">
          <van-button @click="showMedalDialog = false" type="primary">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";

export default {
  name: "HonorProfile",
  data() {
    return {
      // 用户信息
      username: "学员",
      userId: "000000",
      userAvatar: require("@/assets/img/king.png"),

      // 段位信息
      rankName: "青铜学员",
      rankIcon: require("@/assets/rank-r1.png"),
      rankStars: 3,
      currentScore: 1250,
      nextLevelScore: 2000,
      progressPercent: 62.5,

      // 积分信息
      totalScore: 0,
      availableScore: 0,

      // 勋章数据
      medals: [
        {
          id: 1,
          name: "初出茅庐",
          icon: require("@/assets/img/gold.png"),
          description: "完成第一次答题",
          unlocked: true,
          unlockTime: "2024-01-15",
          current: 1,
          total: 1,
        },
        {
          id: 2,
          name: "学习达人",
          icon: require("@/assets/img/king.png"),
          description: "连续学习7天",
          unlocked: true,
          unlockTime: "2024-02-01",
          current: 7,
          total: 7,
        },
        {
          id: 3,
          name: "答题高手",
          icon: require("@/assets/img/gold.png"),
          description: "累计答题100题",
          unlocked: false,
          current: 75,
          total: 100,
        },
        {
          id: 4,
          name: "完美主义",
          icon: require("@/assets/img/king.png"),
          description: "单次答题全对",
          unlocked: true,
          unlockTime: "2024-01-20",
          current: 1,
          total: 1,
        },
        {
          id: 5,
          name: "知识渊博",
          icon: require("@/assets/img/gold.png"),
          description: "累计获得5000积分",
          unlocked: false,
          current: 3200,
          total: 5000,
        },
        {
          id: 6,
          name: "持之以恒",
          icon: require("@/assets/img/king.png"),
          description: "连续学习30天",
          unlocked: false,
          current: 18,
          total: 30,
        },
      ],

      // 统计数据
      stats: {
        questions: 156,
        accuracy: 85,
        days: 23,
        rank: 128,
      },

      // 弹窗控制
      showMedalDialog: false,
      selectedMedal: null,
    };
  },

  async created() {
    await this.loadUserData();
  },

  mounted() {
    document.title = "个人主页";
  },

  methods: {
    // 加载用户数据
    async loadUserData() {
      try {
        const userId = window.localStorage.getItem("uuid");
        this.userId = userId || "000000";

        // 加载积分信息
        await this.loadScoreData();

        // 更新段位信息
        this.updateRankInfo();
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    },

    // 加载积分数据
    async loadScoreData() {
      try {
        const userId = window.localStorage.getItem("uuid");
        const {
          SERVER_NAME: { credits },
        } = baseConfig;

        const res = await this.$axios.get(credits + "/balance", {
          params: { userId },
        });

        if (res.data.code === 1000) {
          this.availableScore = res.data.data.booksNumber;
          this.totalScore = res.data.data.booksNumber;
          this.currentScore = res.data.data.booksNumber;
        }
      } catch (error) {
        console.error("加载积分数据失败:", error);
      }
    },

    // 更新段位信息
    updateRankInfo() {
      const score = this.currentScore;

      if (score < 1000) {
        this.rankName = "新手学员";
        this.rankIcon = require("@/assets/rank-r1.png");
        this.rankStars = Math.min(5, Math.floor(score / 200) + 1);
        this.nextLevelScore = 1000;
      } else if (score < 3000) {
        this.rankName = "青铜学员";
        this.rankIcon = require("@/assets/rank-r1.png");
        this.rankStars = Math.min(5, Math.floor((score - 1000) / 400) + 1);
        this.nextLevelScore = 3000;
      } else if (score < 6000) {
        this.rankName = "白银学员";
        this.rankIcon = require("@/assets/rank-r2.png");
        this.rankStars = Math.min(5, Math.floor((score - 3000) / 600) + 1);
        this.nextLevelScore = 6000;
      } else {
        this.rankName = "黄金学员";
        this.rankIcon = require("@/assets/rank-r3.png");
        this.rankStars = 5;
        this.nextLevelScore = score;
      }

      // 计算进度
      const currentLevelMin =
        this.nextLevelScore === 1000
          ? 0
          : this.nextLevelScore === 3000
          ? 1000
          : this.nextLevelScore === 6000
          ? 3000
          : 6000;

      if (this.nextLevelScore > currentLevelMin) {
        this.progressPercent = Math.min(
          100,
          ((score - currentLevelMin) / (this.nextLevelScore - currentLevelMin)) * 100
        );
      } else {
        this.progressPercent = 100;
      }
    },

    // 显示勋章详情
    showMedalDetail(medal) {
      this.selectedMedal = medal;
      this.showMedalDialog = true;
    },

    // 导航方法
    goBack() {
      this.$router.go(-1);
    },

    showSettings() {
      this.$toast("设置功能开发中...");
    },

    goToShop() {
      return;
      this.$router.push("/personal-center/credit");
    },

    goToRank() {
      return;
      this.$router.push("/credit-rank");
    },

    goToDetail() {
      return;
      this.$router.push("/personal-center/credit/history");
    },

    goToRecord() {
      return;
      this.$router.push("/personal-center/exchangeRecord");
    },
  },
};
</script>

<style scoped lang="less">
.honor-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 0.4rem;
}

// 背景装饰
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
    background-repeat: repeat;
    background-size: 200px 150px;
    animation: sparkle 3s ease-in-out infinite;
  }

  .gradient {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 顶部导航
.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.4rem;
  padding-top: 0.6rem;

  .nav-btn {
    width: 0.8rem;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    backdrop-filter: blur(10px);

    .iconfont {
      font-size: 0.4rem;
      color: #fff;
    }
  }

  .nav-title {
    font-size: 0.36rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

// 用户信息卡片
.user-card {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  margin: 0.4rem;
  padding: 0.4rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.3rem;
  backdrop-filter: blur(15px);

  .user-avatar {
    position: relative;
    margin-right: 0.3rem;

    img {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      border: 3px solid #ffd700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    }

    .avatar-ring {
      position: absolute;
      top: -5px;
      left: -5px;
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      border: 2px solid rgba(255, 215, 0, 0.3);
      border-radius: 50%;
      animation: rotate 4s linear infinite;
    }
  }

  .user-info {
    .username {
      font-size: 0.4rem;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      margin-bottom: 0.1rem;
    }

    .user-id {
      font-size: 0.26rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 段位展示
.rank-section {
  position: relative;
  z-index: 5;
  margin: 0.4rem;

  .rank-card {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.08) 100%);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 0.3rem;
    padding: 0.4rem;
    backdrop-filter: blur(15px);

    .rank-badge {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;

      .rank-img {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.3rem;
        filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
      }

      .rank-details {
        .rank-name {
          font-size: 0.36rem;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          margin-bottom: 0.1rem;
        }

        .rank-stars {
          .star {
            font-size: 0.3rem;
            color: rgba(255, 255, 255, 0.3);
            margin-right: 0.05rem;

            &.active {
              color: #ffd700;
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
            }
          }
        }
      }
    }

    .rank-progress {
      .progress-bar {
        height: 0.12rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 0.06rem;
        overflow: hidden;
        margin-bottom: 0.1rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
          border-radius: 0.06rem;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
      }

      .progress-text {
        font-size: 0.24rem;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
      }
    }
  }
}

// 积分银行
.score-section {
  position: relative;
  z-index: 5;
  margin: 0.4rem;
  background: linear-gradient(135deg, rgba(0, 150, 255, 0.15) 0%, rgba(0, 100, 200, 0.1) 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 0.3rem;
  padding: 0.4rem;
  backdrop-filter: blur(15px);

  .score-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.3rem;

    .coin-img {
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.2rem;
    }

    .score-title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #00bfff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  .score-info {
    display: flex;
    justify-content: space-around;

    .score-item {
      text-align: center;

      .score-num {
        font-size: 0.46rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        margin-bottom: 0.1rem;
      }

      .score-text {
        font-size: 0.24rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

// 荣耀勋章
.medal-section {
  position: relative;
  z-index: 5;
  margin: 0.4rem;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.4rem;

    .header-icon {
      font-size: 0.4rem;
      margin-right: 0.2rem;
    }

    .header-title {
      font-size: 0.36rem;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }

  .medal-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.3rem;

    .medal-item {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.3rem;
      padding: 0.3rem;
      text-align: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &.unlocked {
        border-color: rgba(255, 215, 0, 0.5);
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);

        .medal-icon {
          position: relative;

          .medal-glow {
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            z-index: -1;
            animation: pulse 2s ease-in-out infinite;
          }
        }
      }

      &.locked {
        opacity: 0.6;

        img {
          filter: grayscale(100%);
        }
      }

      .medal-icon {
        margin-bottom: 0.2rem;

        img {
          width: 0.8rem;
          height: 0.8rem;
          transition: transform 0.3s ease;
        }
      }

      .medal-name {
        font-size: 0.24rem;
        color: #fff;
        margin-bottom: 0.1rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .medal-progress {
        font-size: 0.2rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

// 数据统计
.stats-section {
  position: relative;
  z-index: 5;
  margin: 0.4rem;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;

    .stat-item {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.2rem;
      padding: 0.3rem 0.1rem;
      text-align: center;
      backdrop-filter: blur(10px);

      .stat-num {
        font-size: 0.34rem;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        margin-bottom: 0.1rem;
      }

      .stat-label {
        font-size: 0.22rem;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

// 快捷操作
.actions-section {
  position: relative;
  z-index: 5;
  margin: 0.4rem;

  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;

    .action-item {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.3rem;
      padding: 0.3rem 0.2rem;
      text-align: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
      }

      img {
        width: 0.6rem;
        height: 0.6rem;
        margin-bottom: 0.2rem;
      }

      span {
        display: block;
        font-size: 0.22rem;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

// 勋章详情弹窗
.medal-popup {
  .medal-detail {
    width: 90%;
    max-width: 6rem;
    background: #fff;
    border-radius: 0.3rem;
    padding: 0.4rem;

    .detail-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;

      .detail-icon {
        width: 1rem;
        height: 1rem;
        margin-right: 0.3rem;
      }

      .detail-info {
        .detail-title {
          font-size: 0.36rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.1rem;
        }

        .detail-desc {
          font-size: 0.26rem;
          color: #666;
          line-height: 1.4;
        }
      }
    }

    .detail-content {
      margin-bottom: 0.4rem;

      .unlock-info {
        font-size: 0.26rem;
        color: #666;
      }

      .progress-info {
        font-size: 0.26rem;
        color: #666;

        .detail-progress {
          margin-top: 0.2rem;
          height: 0.12rem;
          background: #f0f0f0;
          border-radius: 0.06rem;
          overflow: hidden;

          .detail-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 0.06rem;
            transition: width 0.3s ease;
          }
        }
      }
    }

    .detail-actions {
      text-align: center;
    }
  }
}

// 响应式适配
@media (max-width: 375px) {
  .medal-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
