<!--
 * @FORM: KALT
 * @Description: 无
-->
<!--
 * @FORM: KALT
 * @Description: 无
-->
<template>
  <div class="personcenter-task">
    <div class="header-container">
      <div class="header-top">
        <div class="left" @click="goDesk">积分说明</div>
        <div class="center">
          <div class="top">成长总积分</div>
          <div class="align">
            {{ score }}
            <!-- *** -->
          </div>
          <div class="bottom">
            <!-- <span>段位：</span>
            <span>{{ level }}</span> -->
            <span @click="goCreditRank">学分排行</span>
          </div>
        </div>
        <div class="right" @click="goDetails">积分明细</div>
      </div>
      <div class="header-bottom">
        <img src="../../../assets/person/gift.jpg" alt="" />
        <div class="text-container" @click="goBank">
          <div class="text">
            <span class="text1">积分商城兑福利</span>
            <span class="text2"
              >剩余积分<span class="text3">
                {{ remainingPoints }}
                <!-- ** --> </span
              >分</span
            >
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="total">
        <span class="text1">为你优选</span>
        <span class="text2"
          >今日已累积<span class="text3"
            >&nbsp;{{ accumulatedIntegral }}&nbsp;积分</span
          ></span
        >
        <!-- {{ accumulatedIntegral }} -->
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
          // this.score = res.data.data.integralTotal;
          // this.level = res.data.data.rank;
          // this.remainingPoints = res.data.data.integralResidual;
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
        // let envUrl = "";
        // if (env === "relasebcos") {
        //   envUrl = "https://1hao.bonc.local";
        // }else if (env === "k8stest") {
        //   envUrl = "https://apph5.soap.com";
        // }else if (env === "k8spre") {
        //   envUrl = "https://stress-h5.81.mil.cn";
        // } else if (env === "k8sproduction") {
        //   envUrl = "https://apph5.81.mil.cn";
        // } else {
        //   envUrl = "https://apph5.soap.com";
        // }
        // window.nativeHandler.execute(
        //   "jump",
        //   JSON.stringify({
        //     type: "web",
        //     url: `https://apph5.81.mil.cn/answer/month?ruleId=62947d34d7a9ef4b20b1ab14&topNavVisibility=false&uuid=${window.localStorage.getItem("uuid")}`,
        //     topNavVisibility: false,
        //   }),
        //   null
        // );
        native.appJump("xxqj://answer_question");
        return;
      } else if (taskName === "学习课程时间累计满3分钟") {
        native.appJump("xxqj://navigation/ketang");
        return;
      }

      this.native.link({
        type: "tabs",
        id: "0",
      });
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
      if (this.clickTimes == 0)   {
        this.startTimer();
      }
      this.clickTimes++;
      console.log(this.clickTimes);
      if (this.clickTimes == 5) {
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
      }
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
    console.log(window.localStorage.getItem("uuid"), "------------");
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
  .content-container {
    background: #f5f5f5;
    padding: 1.4rem 0.3rem 0.3rem 0.3rem;
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