<template>
  <div class="personcenter-task">
    <div class="header">
      <div class="part">
        <div class="total">
          <div class="box">
            <div class="jf">{{ score }}</div>
            <div>
              <img src="@/assets/reditrank/goldcoin.png" alt="" />
            </div>
            <div class="allin">成长总积分</div>
          </div>
        </div>
        <div class="used">
          <div class="box">
            <div class="jf">{{ remainingPoints }}</div>
            <div>
              <img src="@/assets/reditrank/goldcoin.png" alt="" />
            </div>
            <div class="allin">可兑换积分</div>
          </div>
        </div>
      </div>
      <div class="entry">
        <div @click="goCreditRank">
          <img src="@/assets/reditrank/查看排行.png" alt="" />
        </div>
        <div @click="goDesk">
          <img src="@/assets/reditrank/积分说明.png" alt="" />
        </div>
        <div @click="goDetails">
          <img src="@/assets/reditrank/积分明细.png" alt="" />
        </div>
        <div @click="goBank" class="bank">
          <div class="redpoint" v-if="exchangeRecordCount <= 0"></div>
          <img src="@/assets/reditrank/积分商城.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 段位显示 -->
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
          <div class="progress-text">{{ score }}/{{ nextLevelScore }}</div>
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

    <div class="content-container">
      <div class="total">
        <span class="text1">为你优选</span>
        <span class="text2"
          >今日已累积<span class="text3">&nbsp;{{ accumulatedIntegral }}&nbsp;积分</span></span
        >
      </div>
      <div v-if="load">
        <div class="content-item" v-for="(item, index) in list" :key="index">
          <div class="left">
            <div class="one">{{ item.taskName.replace("登陆", "登录") }}</div>
            <div class="two">{{ item.ebCount }}分/&nbsp;{{ item.taskName.replace("登陆", "登录") }}</div>
            <div>
              <div class="progress-container">
                <span class="progress" :style="progress(item.doValue, item.configValue)"></span>
              </div>
              <span class="three">
                已获{{ item.doValue }}分/{{ item.taskPeriod === "D" ? "每日" : "" }}上限{{ item.configValue }}分
              </span>
            </div>
          </div>
          <div class="go-to-see" @click="goApp(item.taskName, item.doValue === item.configValue)">
            {{ item.doValue === item.configValue ? "已完成" : "去看看" }}
          </div>
        </div>
      </div>
      <div class="nothing" v-else>尊敬的用户，积分系统正在升级维护中，期间的积分行为暂不记录，请大家耐心等待</div>
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
import { getczjf, getdhjf } from "@/api/jifen.js";
import { baseConfig } from "@/config/common.js";
import native from "@/plugins/native.js";
const {
  SERVER_NAME: { credits },
} = baseConfig;
// const timer = setInterval(function () {}, 5000);
// const env = process.env.NODE_ENV;
/**
 * 首页    xxqj://navigation/zixun
 * 强军号  xxqj://navigation/zixun/qiangjunhao
 * 影视剧  xxqj://navigation/zixun/junyingwenhua/yingshiju
 * 课程号  xxqj://navigation/ketang
 * 云听   xxqj://navigation/zixun/junyingwenhua/yuntingqiangjun
 * 报刊    xxqj://navigation/zixun/junyingwenhua/baokan
 * 图书    xxqj://navigation/zixun/junyingwenhua/tushu
 */
const homeUrl = "xxqj://navigation/zixun";
const qjHaoUrl = "xxqj://navigation/zixun/qiangjunhao";
const movieUrl = "xxqj://navigation/zixun/junyingwenhua/yingshiju";
const courseUrl = "xxqj://navigation/ketang";
const yunTingUrl = "xxqj://navigation/zixun/junyingwenhua/yuntingqiangjun";
const baoKanUrl = "xxqj://navigation/zixun/junyingwenhua/baokan";
const bookUrl = "xxqj://navigation/zixun/junyingwenhua/tushu";
const weishiUrl = "xxqj://tiktok";

export default {
  data() {
    return {
      score: "210",
      level: "--",
      remainingPoints: "130",
      accumulatedIntegral: "--",
      list: [],
      load: true,
      clickTimes: 0,
      timer: null,
      exchangeRecordCount: 1,
      // 段位相关数据
      rankName: "青铜",
      rankStars: 3,
      rankIcon: require("@/assets/rank-r3.png"),
      progressPercent: 65,
      nextLevelScore: 5000,
      // 勋章相关数据
      showMedalDialog: false,
      selectedMedal: null,
      medals: [
        {
          id: 1,
          name: "新手上路",
          description: "完成首次积分任务",
          icon: require("@/assets/img/gold.png"),
          unlocked: true,
          unlockTime: "2025-07-01",
          current: 1,
          total: 1,
        },
        {
          id: 2,
          name: "勤奋学习",
          description: "连续7天完成学习任务",
          icon: require("@/assets/img/king.png"),
          unlocked: true,
          unlockTime: "2025-07-15",
          current: 7,
          total: 7,
        },
        {
          id: 3,
          name: "积分达人",
          description: "累计获得1000积分",
          icon: require("@/assets/reditrank/goldcoin.png"),
          unlocked: false,
          current: 850,
          total: 1000,
        },
        {
          id: 4,
          name: "分享之星",
          description: "分享内容100次",
          icon: require("@/assets/img/start.png"),
          unlocked: false,
          current: 45,
          total: 100,
        },
        {
          id: 5,
          name: "评论达人",
          description: "发表有效评论50次",
          icon: require("@/assets/img/v.png"),
          unlocked: false,
          current: 25,
          total: 50,
        },
        {
          id: 6,
          name: "学习先锋",
          description: "参与挑战自我答题100次",
          icon: "/image/credit-rank/huangguan1.gif",
          unlocked: false,
          current: 72,
          total: 100,
        },
      ],
    };
  },
  methods: {
    async getData() {
      try {
        const res = await this.$axios.get(credits + "/taskList", {
          params: {
            userId: window.localStorage.getItem("uuid"),
          },
        });
        if (res.data.code === 1000) {
          this.accumulatedIntegral = res.data.data.todayEbCount;
          this.list = res.data.data.taskList;
        } else {
          this.load = false;
        }
      } catch (error) {
        console.log(error);
        this.load = false;
      }
    },
    async getAmount() {
      try {
        const { data: res } = await this.$axios.get(credits + "/balance", {
          params: {
            userId: window.localStorage.getItem("uuid"),
          },
        });
        const { data, msg, code } = res;
        if (code === 1000) {
          this.remainingPoints = data.booksNumber;
          this.level = data.grade;
          this.score = data.totalIn;
        } else {
          this.$toast.fail(msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    progress(integralGained, dailyLimit) {
      const total = 1.2;
      const chu = integralGained / dailyLimit;
      const width = total * chu;
      return `width:${width}rem`;
    },
    goApp(taskName, isCompleted) {
      console.log(taskName, isCompleted);
      if (isCompleted) return;
      if (taskName === "每日参与“学习先锋”挑战自我" || taskName === "每日“学习先锋”挑战自我答题正确") {
        // native.appJump("xxqj://answer_question");
        location.href =
          "https://apph5.81.mil.cn/answer/entry?uuid=" + this.$route.query.uuid + "&token=" + this.$route.query.token;
        return;
      } else if (taskName === "订阅一个强军号、课程号或微视号") {
        const cateArr1 = [
          { value: "qiangjunhao", weight: 2 },
          { value: "course", weight: 4 },
          { value: "weishi", weight: 4 },
        ];
        this.goJumpByWeight(cateArr1);
        return;
      } else if (taskName === "收藏一次文章或音视频") {
        const cateArr2 = ["home", "course"];
        this.goJumpNormal(cateArr2);
        return;
      } else if (taskName === "分享一次文章、音视频、课程或图书") {
        const cateArr3 = ["home", "yunting", "course", "book"];
        this.goJumpNormal(cateArr3);
        return;
      } else if (taskName === "发表一次有效评论") {
        native.appJump(homeUrl);
        return;
      } else if (taskName === "阅读文章、报刊或图书累计2分钟") {
        const cateArr4 = ["home", "baokan", "book"];
        this.goJumpNormal(cateArr4);
        return;
      } else if (taskName === "学习课程时间累计满3分钟") {
        native.appJump(courseUrl);
        return;
      } else if (taskName === "收听观看音视频（除课程外）5分钟") {
        native.appJump(movieUrl);
        return;
      }
      native.appJump(homeUrl);
    },
    // 普通跳转，随机跳
    goJumpNormal(tmpArr) {
      const randIndex = Math.floor(Math.random() * tmpArr.length);
      const randKey = tmpArr[randIndex];
      console.log("randkey:::", randKey);
      this.goJumpByCustKey(randKey);
    },
    // 根据权重跳转
    goJumpByWeight(wtArr) {
      const wtKey = this.getRandomByWeight(wtArr);
      console.log("wtKey:::", wtKey);
      this.goJumpByCustKey(wtKey);
    },
    // 根据key跳转对应的地址
    goJumpByCustKey(key) {
      switch (key) {
        case "home":
          native.appJump(homeUrl);
          break;
        case "baokan":
          native.appJump(baoKanUrl);
          break;
        case "book":
          native.appJump(bookUrl);
          break;
        case "course":
          native.appJump(courseUrl);
          break;
        case "qiangjunhao":
          native.appJump(qjHaoUrl);
          break;
        case "weishi":
          native.appJump(weishiUrl);
          break;
        case "yunting":
          native.appJump(yunTingUrl);
          break;
        default:
          break;
      }
    },
    // 随机获取key，减少权重小的获取次数
    getRandomByWeight(arr) {
      let totalWei = arr.reduce((sum, item) => sum + item.weight, 0);
      let randNumber = Math.random() * totalWei;
      let curWeight = 0;
      for (let it of arr) {
        curWeight += it.weight;
        if (randNumber <= curWeight) {
          return it.value;
        }
      }
    },
    // 跳转学分排行
    goCreditRank() {
      this.$router.push({
        path: "/credit-rank",
      });
    },
    goDetails() {
      // this.$toast("积分系统维护中");
      // return false;
      this.$router.push("/personal-center/task/integral-details");
      if (window.nativeHandler && typeof window.nativeHandler.execute === "function") {
        window.nativeHandler.execute("clickStatistic", '{"id": "click_des"}', null);
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.clickTimes = 0;
        clearInterval(this.timer);
        this.timer = null;
      }, 3000);
    },
    goBank() {
      // if (this.clickTimes == 0) {
      //   this.startTimer();
      // }
      // this.clickTimes++;
      // console.log(this.clickTimes);
      // if (this.clickTimes == 5) {
      this.$router.push("/personal-center/credit");
      if (window.nativeHandler && typeof window.nativeHandler.execute === "function") {
        window.nativeHandler.execute("clickStatistic", '{"id": "click_bank"}', null);
      }
      // }
      // this.$toast("积分商城维护中");
      // return false
    },
    goDesk() {
      this.$router.push("/personal-center/des");
      if (window.nativeHandler && typeof window.nativeHandler.execute === "function") {
        window.nativeHandler.execute("clickStatistic", '{"id": "click_info"}', null);
      }
    },
    // 显示勋章详情
    showMedalDetail(medal) {
      this.selectedMedal = medal;
      this.showMedalDialog = true;
    },
    // 获取段位信息
    getRankInfo() {
      const ranks = [
        { name: "青铜", minScore: 0, maxScore: 999, icon: require("@/assets/rank-r3.png") },
        { name: "白银", minScore: 1000, maxScore: 2999, icon: require("@/assets/rank-r2.png") },
        { name: "黄金", minScore: 3000, maxScore: 4999, icon: require("@/assets/rank-r1.png") },
        { name: "铂金", minScore: 5000, maxScore: 7999, icon: "/image/credit-rank/huangguan1.gif" },
        { name: "钻石", minScore: 8000, maxScore: 11999, icon: "/image/credit-rank/huangguan2.gif" },
        { name: "王者", minScore: 12000, maxScore: 99999, icon: "/image/credit-rank/huangguan3.gif" },
      ];

      const currentScore = parseInt(this.score) || 0;
      const currentRank =
        ranks.find(rank => currentScore >= rank.minScore && currentScore <= rank.maxScore) || ranks[0];
      const nextRank = ranks.find(rank => rank.minScore > currentScore) || currentRank;

      this.rankName = currentRank.name;
      this.rankIcon = currentRank.icon;
      this.nextLevelScore = nextRank.minScore;

      // 计算星级（每个段位分5个星级）
      const rankProgress = (currentScore - currentRank.minScore) / (currentRank.maxScore - currentRank.minScore + 1);
      this.rankStars = Math.min(5, Math.floor(rankProgress * 5) + 1);

      // 计算进度百分比
      if (nextRank !== currentRank) {
        this.progressPercent =
          ((currentScore - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100;
      } else {
        this.progressPercent = 100;
      }
    },
    // 更新勋章状态
    updateMedals() {
      const currentScore = parseInt(this.score) || 0;
      // 可以根据实际数据更新勋章状态
      this.medals.forEach(medal => {
        if (medal.id === 3 && currentScore >= 1000) {
          medal.unlocked = true;
          medal.unlockTime = new Date().toISOString().split("T")[0];
        }
      });
    },
    async getjfData() {
      const list = await Promise.all([getczjf(), getdhjf()]);
      console.log(list, "3333333333");
    },
  },
  async created() {
    this.exchangeRecordCount =
      window.localStorage.getItem("exchangeRecordCount") || this.$route.query.exchangeRecordCount;
    // console.log(this.exchangeRecordCount);
    // console.log(window.localStorage.getItem("uuid"), "------------");
    // await this.getAmount();
    // await this.getData();
    // 初始化段位和勋章信息
    this.getRankInfo();
    this.updateMedals();
    this.getjfData();
  },
  mounted() {
    document.title = "任务";
  },
};
</script>

<style lang="less" scoped>
.personcenter-task {
  width: 100%;
  height: 100%;
  .header-container {
    position: relative;
    .header-top {
      height: 3.75rem;
      background: #d21f22;
      display: flex;
      justify-content: space-between;
      color: #fff;
      .left,
      .right {
        margin-top: 0.35rem;
        width: 1.5rem;
        height: 0.55rem;
        line-height: 0.55rem;
        background: #bc1c1e;
        text-align: center;
        font-size: 0.24rem;
      }

      .left {
        margin-left: 0.5rem;
        border-radius: 0.1rem 0.25rem 0.25rem 0.1rem;
      }
      .right {
        margin-right: 0.5rem;
        border-radius: 0.25rem 0.1rem 0.1rem 0.25rem;
      }
      .center {
        margin-top: 0.35rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 2.22rem;
        .top {
          line-height: 0.55rem;
          font-size: 0.36rem;
          text-align: center;
        }
        .align {
          text-align: center;
          font-size: 0.5rem;
        }
        .bottom {
          width: 3.6rem;
          height: 0.55rem;
          background: #bc1c1e;
          font-size: 0.24rem;
          text-align: center;
          line-height: 0.55rem;
          border-radius: 0.3rem;
        }
      }
    }
    .header-bottom {
      background: #fff;
      height: 1.53rem;
      width: 7rem;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      border-radius: 0.3rem;
      display: flex;
      align-items: center;
      img {
        margin-left: 0.5rem;
        width: 1rem;
        height: 1rem;
      }
      .text-container {
        width: 6rem;
        margin-left: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 0.5rem;
        .text {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 1rem;
          .text1 {
            font-size: 0.3rem;
            color: #000;
          }
          .text2 {
            font-size: 0.24rem;
            color: #2e3437;
            .text3 {
              color: #901e1e;
              padding: 0 0.05rem;
            }
          }
        }
        i {
          color: #adb2bd;
          font: 0.2rem;
        }
      }
    }
  }
  .header {
    background: url("../../../assets/reditrank/banner1.png");
    background-size: cover;
    padding-top: 0.25rem;
    width: 100%;
    height: 3.75rem;
    .part {
      display: flex;

      .total {
        margin-left: 8%;
        background: url("../../../assets/reditrank/可兑换积分.png");
        background-size: cover;
        height: 2.3rem;
        width: 40%;
        position: relative;
        .box {
          position: absolute;
          text-align: center;
          top: 0.8rem;
          left: 0;
          right: 0;
          .jf {
            font-size: 0.74rem;
            margin-bottom: 0.1rem;
            font-weight: 700;
            color: white;
          }
          img {
            width: 0.5rem;
          }
          .allin {
            color: #fb953c;
            margin-left: 20%;
            margin-top: 0.1rem;
            height: 0.4rem;
            font-weight: 600;
            width: 60%;
            background-color: #fff;
            font-size: 0.22rem;
            line-height: 0.4rem;
            border-radius: 0.15rem;
          }
        }
      }
      .used {
        margin-left: 4%;
        background: url("../../../assets/reditrank/可兑换积分.png");
        background-size: cover;
        height: 2.3rem;
        width: 40%;
        position: relative;
        .box {
          position: absolute;
          text-align: center;
          top: 0.8rem;
          left: 0;
          right: 0;
          .jf {
            font-size: 0.74rem;
            margin-bottom: 0.1rem;
            font-weight: 700;
            color: white;
          }
          img {
            width: 0.5rem;
          }
          .allin {
            color: #fb953c;
            margin-left: 20%;
            margin-top: 0.1rem;
            height: 0.4rem;
            font-weight: 600;
            width: 60%;
            background-color: #fff;
            font-size: 0.22rem;
            line-height: 0.4rem;
            border-radius: 0.15rem;
          }
        }
      }
    }
    .entry {
      padding: 0 8%;
      display: flex;
      justify-content: space-between;
      font-size: 0.22rem;
      line-height: 0.3rem;
      height: 0.3rem;
      margin-top: 0.5rem;

      color: white;

      img {
        width: 1.4rem;
      }

      .bank {
        position: relative;
        .redpoint {
          background-color: #f25643;
          width: 0.2rem;
          height: 0.2rem;
          position: absolute;
          right: -0.23rem;
          top: -0.08rem;
          border: 0.03rem solid white;
          border-radius: 0.2rem;
        }
      }
    }
  }

  // 段位显示样式
  .rank-section {
    margin: 0.3rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.3rem;
    padding: 0.4rem;
    box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.1);

    .rank-card {
      display: flex;
      flex-direction: column;

      .rank-badge {
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;

        .rank-img {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
        }

        .rank-details {
          color: white;

          .rank-name {
            font-size: 0.36rem;
            font-weight: bold;
            margin-bottom: 0.1rem;
          }

          .rank-stars {
            .star {
              font-size: 0.3rem;
              margin-right: 0.05rem;
              color: rgba(255, 255, 255, 0.3);

              &.active {
                color: #ffd700;
                text-shadow: 0 0 0.1rem rgba(255, 215, 0, 0.8);
              }
            }
          }
        }
      }

      .rank-progress {
        .progress-bar {
          height: 0.15rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.1rem;
          overflow: hidden;
          margin-bottom: 0.1rem;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffd700, #ffed4e);
            border-radius: 0.1rem;
            transition: width 0.3s ease;
          }
        }

        .progress-text {
          font-size: 0.24rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: right;
        }
      }
    }
  }

  // 荣耀勋章样式
  .medal-section {
    margin: 0.3rem;
    background: white;
    border-radius: 0.3rem;
    padding: 0.4rem;
    box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.1);

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.4rem;

      .header-icon {
        font-size: 0.4rem;
        margin-right: 0.2rem;
      }

      .header-title {
        font-size: 0.32rem;
        font-weight: bold;
        color: #333;
      }
    }

    .medal-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.3rem;

      .medal-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.3rem;
        border-radius: 0.2rem;
        transition: all 0.3s ease;

        &.unlocked {
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);

          .medal-icon {
            position: relative;

            img {
              filter: brightness(1.1) saturate(1.2);
            }

            .medal-glow {
              position: absolute;
              top: -0.1rem;
              left: -0.1rem;
              right: -0.1rem;
              bottom: -0.1rem;
              background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
              border-radius: 50%;
              animation: glow 2s ease-in-out infinite alternate;
            }
          }

          .medal-name {
            color: #d4670f;
            font-weight: bold;
          }
        }

        &.locked {
          background: #f5f5f5;

          .medal-icon img {
            filter: grayscale(1) brightness(0.7);
          }

          .medal-name {
            color: #999;
          }

          .medal-progress {
            font-size: 0.2rem;
            color: #666;
            margin-top: 0.1rem;
          }
        }

        .medal-icon {
          width: 1rem;
          height: 1rem;
          margin-bottom: 0.2rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .medal-name {
          font-size: 0.24rem;
          text-align: center;
          line-height: 1.2;
        }
      }
    }
  }

  // 勋章详情弹窗样式
  .medal-popup {
    .medal-detail {
      width: 6rem;
      background: white;
      border-radius: 0.3rem;
      padding: 0.4rem;

      .detail-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.4rem;

        .detail-icon {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
        }

        .detail-info {
          flex: 1;

          .detail-title {
            font-size: 0.32rem;
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

        .unlock-info,
        .progress-info {
          font-size: 0.26rem;
          color: #666;

          p {
            margin: 0.2rem 0;
          }
        }

        .detail-progress {
          height: 0.15rem;
          background: #f0f0f0;
          border-radius: 0.1rem;
          overflow: hidden;
          margin-top: 0.2rem;

          .detail-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 0.1rem;
            transition: width 0.3s ease;
          }
        }
      }

      .detail-actions {
        text-align: center;
      }
    }
  }

  @keyframes glow {
    from {
      opacity: 0.5;
      transform: scale(1);
    }
    to {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  .content-container {
    background: #f5f5f5;
    padding: 0.4rem 0.3rem 0.3rem 0.3rem;
    // overflow: auto;
    .total {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 0.3rem;
      }
      .text1 {
        color: #000;
        font-weight: 550;
      }
      .text2 {
        color: #454a4d;
        .text3 {
          color: #a31f21;
        }
      }
    }
    .content-item {
      background: #fff;
      height: 1.8rem;
      border-radius: 0.2rem;
      margin: 0.2rem 0;
      padding: 0.3rem 0.2rem 0.2rem 0.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .one {
          color: #3b3e42;
          font-size: 0.3rem;
        }
        .two,
        .three {
          color: #9a9ca0;
          font-size: 0.24rem;
        }
        .three {
          font-size: 0.21rem;
        }
        .progress-container {
          width: 1.2rem;
          height: 0.12rem;
          background: #ecedf1;
          border-radius: 1rem;
          position: relative;
          display: inline-block;
          .progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 0.12rem;
            background: #ee0a25;
            border-radius: 1rem;
          }
        }
      }
      .go-to-see {
        width: 1.2rem;
        height: 0.56rem;
        background: #fdf7f7;
        border-radius: 0.2rem;
        line-height: 0.56rem;
        text-align: center;
        color: #bc1a1b;
        font-size: 0.23rem;
      }
    }
    .nothing {
      padding-top: 2rem;
      height: calc(100vh - 5.8rem);
      line-height: 0.8rem;
      text-align: center;
      font-weight: 500;
    }
  }
}
</style>
