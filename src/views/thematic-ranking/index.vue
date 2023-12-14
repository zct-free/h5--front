<!--
 * @FORM: KALT
 * @Description: 无
-->
<template>
  <div class="personal-center-integral-details" v-finger:swipe="swipeHandler">
    <van-tabs v-if="creditsLsit.length" v-model="activeName" @click="choiceTab">
      <van-tab
        v-for="item in creditsLsit"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      ></van-tab>
    </van-tabs>
    <!-- 头部轮播加载日期 -->
    <div class="integral-date-list">
      <ul @scroll="scrollEvent">
        <li
          v-for="(item, index) in integralDateList"
          :key="index"
          :class="{ active: dateTime === item.operateDate }"
          @click="handleClickDate(index)"
        >
          <span class="idl-date-text">{{
            item.operateDate === today ? "今日" : item.operateDate
          }}</span>
          <span class="idl-integral">{{ item.booksNumber }}</span>
          <span class="idl-bar" :style="item.booksNumber | barHeight"></span>
        </li>
      </ul>
    </div>
    <!-- 选中日期详细 -->
    <div class="curr-integral-panel">
      <!-- 当日汇总 -->
      <p class="curr-total-title">
        <span class="ctt-title">
          <span>当日积分:</span>
          <span class="ctt-integral">{{ grade }}</span>
        </span>

        <span class="ctt-date">{{ dateTime }}</span>
      </p>
      <!-- 时间线 -->
      <div class="curr-timeline">
        <div
          class="curr-timeline-item"
          v-for="(item, index) in currInfo.detailList"
          :key="index"
        >
          <!-- 时间线样式 -->
          <div class="ctl-lc">
            <span
              class="ctl-line"
              :class="{
                'is-last': index === currInfo.detailList.length - 1,
                'is-only': currInfo.detailList.length === 1,
              }"
            ></span>
            <span class="ctl-circle"></span>
          </div>
          <!-- 时间线描述 -->
          <div class="ctl-info">
            <div class="ctl-info-text">
              <span>{{ item.orderTime }}</span>
              <b>{{ item.fromBussname }}</b>
            </div>
            <div class="ctl-info-integral">
              <b>
                <span class="make-integral">{{
                  item.number | fomatIntegral
                }}</span>
                <span>分</span>
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";
const {
  SERVER_NAME: { credits, special },
} = baseConfig;
export default {
  data() {
    return {
      integralDateList: [],
      integralDateListPendding: false,
      today: "",
      times: 1000,
      grade: "--",
      dateTime: "--",
      currInfo: {
        list: [],
      },
      activeName: "",
      creditsLsit: [],
      userId: ''
    };
  },
  filters: {
    barHeight(value) {
      value = Math.min(value, 56);
      return { height: value * 0.056 + "rem" };
    },
    fomatIntegral: (value) =>
      value > 0 ? "+" + value.toString() : value.toString(),
  },
  created() {
    // 设置当前日期
    this.setToday();
  },
  async mounted() {
    console.log(this.$route.query.source);
    document.title = "积分明细";
    if (this.source) {
      const res = await this.$axios.get(special + "/creditsLsit");
      console.log(res);
      let { code, data } = res.data;
      if (code === 1000) {
        this.creditsLsit = data;
        console.log(data);
        this.activeName = data[0].id;
      }
    } else {
      var query = window.location.search;
      var vars = query.split("&");
      var pair = [];
      for (var i = 0; i < vars.length; i++) {
        pair.push(vars[i].split("="));
      }
      this.activeName = pair[0][1];
      this.userId = pair[1][1];
    }
    await this.getIntegralDateList();
    await this.getCurrIntegralByDate();
  },
  props: {
    source: {
      type: Boolean,
    },
  },
  methods: {
    //滑动
    swipeHandler(evt) {
      if (evt.direction == "Right") {
        console.log("aaa");
      }
    },
    setToday() {
      const month = new Date().getMonth() + 1;
      const today = new Date().getDate();
      const y = new Date().getFullYear();
      const m = month < 10 ? "0" + month.toString() : month.toString();
      const d = today > 9 ? today.toString() : "0" + today.toString();
      this.today = y + "-" + m + "-" + d;
      this.dateTime = this.today;
    },
    // 滚动事件
    scrollEvent(event) {
      if (this.integralDateListPendding) {
        return;
      }
      const el = event.target;
      const emitGet = el.scrollWidth - el.scrollLeft < (el.clientWidth * 8) / 7;
      if (emitGet) {
        this.getIntegralDateList();
      }
    },
    // 点击日期事件
    handleClickDate(index) {
      this.grade = this.integralDateList[index].booksNumber;
      this.dateTime = this.integralDateList[index].operateDate;
      this.getCurrIntegralByDate();
    },
    // 获取日期列表
    async getIntegralDateList() {
      this.times += 1;
      this.integralDateListPendding = true;
      console.log(this.today);
      try {
        let [y, m, d] = this.today.split("-");
        m = parseInt(m);
        --m;
        if (m < 1) {
          m = 12;
          y = parseInt(y) - 1;
        }
        m = m < 10 ? `0${m}` : m;
        const params = {
          userId: this.userId.length? this.userId : window.localStorage.getItem("uuid"),
          startTime: `${y}-${m}-${d}`,
          endTime: `${this.today}`,
          pageNum: 1,
          pageSize: 30,
          subjectId: this.activeName,
        };
        const { data: res } = await this.$axios.get(
          credits + "/daysBySubject",
          {
            params,
          }
        );
        const { code, msg, data } = res;
        if (code === 1000) {
          this.integralDateList = data.detailList.length
            ? data.detailList : [
                {
                  booksNumber: 0,
                  operateDate: this.today
                },
              ];
          console.log(this.grade);
          const res = this.integralDateList.filter(
            (item) => item.operateDate === this.today
          );
          console.log(res, 2222);
          this.grade = res.length ? res[0].booksNumber : 0;
        } else {
          this.$toast.fail(msg);
        }
      } catch (error) {
        console.error("获取日期列表失败", error);
      }
      this.integralDateListPendding = false;
    },
    // 查看当前日期 积分情况
    async getCurrIntegralByDate() {
      try {
        let [y, m, d] = this.dateTime.split("-");
        d = parseInt(d) + 1;
        d = d < 10 ? `0${d}` : d;
        let f = false;
        const big = [1, 3, 5, 7, 8, 10, 12];
        if (big.includes(parseInt(m))) {
          f = d === 32;
          d = d === 32 ? "01" : d;
        } else if (parseInt(m) === 2) {
          f = d === 29;
          d = d === 29 ? "01" : d;
        } else {
          f = d === 31;
          d = d === 31 ? "01" : d;
        }
        m = f ? parseInt(m) + 1 : parseInt(m);
        m = m < 10 ? `0${m}` : m;
        if (m > 12) {
          y = parseInt(y) + 1;
          m = "01";
        }
        const params = {
          userId: this.userId.length? this.userId : window.localStorage.getItem("uuid"),
          startTime: this.dateTime,
          endTime: `${y}-${m}-${d}`,
          pageNum: 1,
          pageSize: 30,
          subjectId: this.activeName,
        };
        const { data } = await this.$axios.get(credits + "/detailsBySubject", {
          params,
        });
        this.currInfo = data.data;
        console.log(this.currInfo);
      } catch (error) {
        console.error("查看当前日期 积分情况 失败", error);
      }
    },
    choiceTab() {
      this.getIntegralDateList();
      this.getCurrIntegralByDate();
    },
  },
};
</script>

<style lang="less" scoped>
.personal-center-integral-details {
  @textColor: #71777d;
  @black: #111215;
  @activeTextColor: #d22023;
  @barColor: #fe3543;
  @bgColor: #ffffff;
  @gray: #f3f7fa;
  @timelineColor: #e9ecf1;
  // 头部轮播加载日期
  .integral-date-list {
    background-color: @gray;
    height: 4.9rem;
    width: 100%;
    overflow: hidden;
    color: @textColor;
    ul {
      display: flex;
      flex-flow: row nowrap;
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0.22rem 0 0.8rem;
      // position: absolute;
      li {
        transition: all ease-in-out 0.3s;
        text-align: center;
        height: 100%;
        background-color: @bgColor;
        width: 1rem;
        min-width: 50px;
        border-radius: 0.2rem;
        margin-right: 0.15rem;
        box-shadow: 0 0.5rem 0.4rem #e9e6e6;
        font-size: 0.18rem;
        position: relative;
        line-height: 0.4rem;
        overflow: hidden;
        &.active {
          // font-size: 0.28rem;
          transform: scale(1.05);
          transform-origin: top;

          .idl-date-text,
          .idl-integral {
            color: @activeTextColor;
            font-weight: bold;
          }
        }
        .idl-date-text {
          height: 0.4rem;
          display: block;
        }
        .idl-integral {
          position: absolute;
          display: block;
          top: 3rem;
          width: 100%;
          height: 0.4rem;
          z-index: 99;
        }
        .idl-bar {
          background-color: @barColor;
          width: 100%;
          position: absolute;
          display: block;
          bottom: 0;
        }
      }
    }
  }
  // 选中日期详细
  .curr-integral-panel {
    .curr-total-title {
      padding: 0.3rem 0.33rem 0.3rem;
      line-height: 0.5rem;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .ctt-title {
        color: @activeTextColor;
        font-size: 0.3rem;
        .ctt-integral {
          display: inline-block;
          font-size: 0.45rem;
          padding: 0 0.2rem 0;
        }
      }
      .ctt-date {
        font-size: 0.2rem;
      }
    }
    .curr-timeline {
      display: flex;
      flex-flow: column nowrap;
      .curr-timeline-item {
        display: flex;
        flex-flow: row nowrap;
        position: relative;
        padding-bottom: 0.1rem;
      }
      .ctl-lc {
        width: 0.64rem;
        position: relative;
        .ctl-line {
          position: absolute;
          height: 1.2rem;
          width: 0.01rem;
          background-color: @timelineColor;
          left: 50%;
          transform: translateX(-50%);
          top: 0.12rem;
          &.is-last {
            height: 0.3rem;
            top: -0.11rem;
          }
          &.is-only {
            display: none;
          }
        }
        .ctl-circle {
          position: absolute;
          height: 0.16rem;
          width: 0.16rem;
          border-radius: 50%;
          background-color: @timelineColor;
          top: 0.12rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .ctl-info {
        width: 100%;
        padding-right: 0.2rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        border-bottom: 0.01rem solid @timelineColor;
        .ctl-info-text {
          display: flex;
          flex-flow: column nowrap;
          span {
            font-size: 0.2rem;
            line-height: 0.4rem;
          }
          b {
            font-size: 0.3rem;
            line-height: 0.5rem;
            font-weight: normal;
            color: @black;
          }
        }
        .ctl-info-integral {
          color: @activeTextColor;
          line-height: 0.9rem;
          font-size: 0.24rem;
          .make-integral {
            margin-right: 0.1rem;
            font-size: 0.4rem;
          }
        }
      }
    }
  }
}
</style>
