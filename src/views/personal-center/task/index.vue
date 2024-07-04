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
          <span><img src="@/assets/reditrank/排行榜.png" alt="" /></span
          >查看排行
        </div>
        <div @click="goDesk">
          <span><img src="@/assets/reditrank/说明.png" alt="" /></span>积分说明
        </div>
        <div @click="goDetails">
          <span><img src="@/assets/reditrank/打款明细.png" alt="" /></span
          >积分明细
        </div>
        <div @click="goBank" class="bank">
          <div class="redpoint" v-if="exchangeRecordCount<=0"></div>
          <span><img src="@/assets/reditrank/积分商城.png" alt="" /></span
          >积分商城
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="total">
        <span class="text1">为你优选</span>
        <span class="text2"
          >今日已累积<span class="text3"
            >&nbsp;{{ accumulatedIntegral }}&nbsp;积分</span
          ></span>
      </div>
      <div v-if="load">
        <div class="content-item" v-for="(item, index) in list" :key="index">
          <div class="left">
            <div class="one">{{ item.taskName.replace("登陆", "登录") }}</div>
            <div class="two">
              {{ item.ebCount }}分/&nbsp;{{
                item.taskName.replace("登陆", "登录")
              }}
            </div>
            <div>
              <div class="progress-container">
                <span
                  class="progress"
                  :style="progress(item.doValue, item.configValue)"
                ></span>
              </div>
              <span class="three">
                已获{{ item.doValue }}分/{{
                  item.taskPeriod === "D" ? "每日" : ""
                }}上限{{ item.configValue }}分
              </span>
            </div>
          </div>
          <div
            class="go-to-see"
            @click="goApp(item.taskName, item.doValue === item.configValue)"
          >
            {{ item.doValue === item.configValue ? "已完成" : "去看看" }}
          </div>
        </div>
      </div>
      <div class="nothing" v-else>
        尊敬的用户，积分系统正在升级维护中，期间的积分行为暂不记录，请大家耐心等待
      </div>
    </div>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";
import native from "@/plugins/native.js";
const {
  SERVER_NAME: { credits },
} = baseConfig;
const timer = setInterval(function () {}, 5000);
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
      score: "--",
      level: "--",
      remainingPoints: "--",
      accumulatedIntegral: "--",
      list: [],
      load: true,
      clickTimes: 0,
      timer: null,
      exchangeRecordCount: 1,
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
      if (
        taskName === "每日参与“学习先锋”挑战自我" ||
        taskName === "每日“学习先锋”挑战自我答题正确"
      ) {
        // native.appJump("xxqj://answer_question");
        location.href = "https://apph5.81.mil.cn/answer/entry?uuid=" + this.$route.query.uuid + "&token=" + this.$route.query.token;
        return;
      } else if (taskName === "订阅一个强军号、课程号或微视号") {
        const cateArr1 = [{value: "qiangjunhao", weight: 2},{value: "ketang", weight: 4},{value: "weishi", weight: 4}];
        this.goJumpByWeight(cateArr1);
        return;
      } else if (taskName === "收藏一次文章或音视频") {
        const cateArr2 = ["home", "course"];
        this.goJumpNormal(cateArr2);
        return;
      } else if (taskName === "分享一次文章、音视频、课程或图书") {
        // const cateArr3 = ["home", "yunting", "course", "book"];
        const cateArr3 = ["home", "course"];
        this.goJumpNormal(cateArr3);
        return;
      } else if (taskName === "发表一次有效评论") {
        native.appJump(homeUrl);
        return;
      } else if (taskName === "阅读文章、报刊或图书累计2分钟") {
        // const cateArr4 = ["home", "baokan", "book"];
        // this.goJumpNormal(cateArr4);
        native.appJump(homeUrl);
        return;
      } else if (taskName === "学习课程时间累计满3分钟") {
        native.appJump(courseUrl);
        return;
      } else if (taskName === "收听观看音视频（除课程外）5分钟") {
        // native.appJump(movieUrl);
        native.appJump(weishiUrl);
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
      switch(key) {
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
          case "ketang":
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
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          '{"id": "click_des"}',
          null
        );
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
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          '{"id": "click_bank"}',
          null
        );
      }
      // }
      // this.$toast("积分商城维护中");
      // return false
    },
    goDesk() {
      this.$router.push("/personal-center/des");
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          '{"id": "click_info"}',
          null
        );
      }
    },
  },
  async created() {
    this.exchangeRecordCount = window.localStorage.getItem('exchangeRecordCount')||this.$route.query.exchangeRecordCount;
    // console.log(this.exchangeRecordCount);
    // console.log(window.localStorage.getItem("uuid"), "------------");
    await this.getAmount();
    await this.getData();
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
      margin-top: 0.6rem;

      color: white;

      span {
        img {
          width: 0.18rem;
          margin-right: 0.1rem;
        }
      }
      .bank {
        position: relative;
        .redpoint {
          background-color:#f25643;
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