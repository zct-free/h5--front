<template>
  <div class="classes">
    <div class="header-container">
      <!-- <h2 class="text">考试</h2> -->
      <i class="iconfont icon-zuojt_btn iconleft" @click="returnClient"></i>
      <h3 class="title">排行榜</h3>
    </div>
    <div class="rankList">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <van-cell
            class="cell"
            v-for="(item, index) in list"
            :key="index"
            @click="handleGoClientDetile(item.id)"
          >
            <div class="num">
              <i>{{ index > 2 ? index + 1 : "" }}</i>
            </div>
            <div class="img">
              <img :src="item.coverImgUrl" />
            </div>
            <div class="con">
              <div class="tit">{{ item.courseName }}</div>
              <div class="author">
                <div class="name">{{ item.provider }}</div>
                <!-- <div class="date">{{ item.date }}</div> -->
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import { getCourseList } from "../../../../serve/api/test.js";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      total: 30,
      tempData: {
        data: [
          {
            id: 123213,
            title: "从一个人到一个团队 装备维修保障的“群蜂智慧”",
            author: "装备维修",
            date: "2021-05-28 07:19",
            imgUrl:
              "https://p4.img.cctvpic.com/photoworkspace/2021/05/28/2021052807181795543.jpg",
          },
          {
            id: 871213,
            title: "讲台烽烟起 笔尖竞风流：直击这场政治教员评比竞赛",
            author: "思想教育",
            date: "2021-05-27 21:22",
            imgUrl:
              "https://p4.img.cctvpic.com/photoworkspace/2021/05/27/2021052721212814672.jpg",
          },
          {
            id: 5661213,
            title: "广西南宁：快乐练兵进行时",
            author: "身心",
            date: "2021-05-27 10:26",
            imgUrl:
              "https://p3.img.cctvpic.com/photoworkspace/2021/05/27/2021052710253689842.jpg",
          },
          {
            id: 84513,
            title: "边防连队有支“开心乐队”",
            author: "开心乐队",
            date: "2021-05-27 21:22",
            imgUrl:
              "https://p4.img.cctvpic.com/photoworkspace/2021/05/27/2021052704584532672.jpg",
          },
          {
            id: 87571213,
            title: "过瘾！第一视角直击特战队员“豪横”射击",
            author: "思想教育",
            date: "2021-05-27 04:53",
            imgUrl:
              "https://p2.img.cctvpic.com/photoworkspace/2021/05/26/2021052612512377116.jpg",
          },
          {
            id: 1231213,
            title: "武警警官学院训练基地：贴近实战淬炼救援精兵",
            author: "救援精兵",
            date: "2021-05-26 13:00",
            imgUrl:
              "https://p3.img.cctvpic.com/photoworkspace/2021/05/25/2021052516382647648.jpg",
          },
          {
            id: 561213,
            title: "险情不断！防化演练检验应急救援能力",
            author: "思想教育",
            date: "2021-05-25 16:34",
            imgUrl:
              "https://p1.img.cctvpic.com/photoworkspace/2021/05/25/2021052516324341546.jpg",
          },
          {
            id: 6651213,
            title: "为“心”沐浴 播撒“阳光”",
            author: "阳光心态",
            date: "2021-05-25 10:57",
            imgUrl:
              "https://p4.img.cctvpic.com/photoworkspace/2021/05/25/2021052510564949526.jpg",
          },
          {
            id: 3451213,
            title: "炎炎夏日！武警广西总队钦州支队官兵训练场上展风采",
            author: "训练场",
            date: "2021-05-25 10:51",
            imgUrl:
              "https://p1.img.cctvpic.com/photoworkspace/2021/05/25/2021052510502810155.jpg",
          },
          {
            id: 234213,
            title: "夜色中守护万家灯火",
            author: "飞行训练",
            date: "2021-05-25 10:47",
            imgUrl:
              "https://p3.img.cctvpic.com/photoworkspace/2021/05/25/2021052510472196365.jpg",
          },
        ],
      },
    };
  },
  mounted() {
    this.getCourseList();
    // document.title = `排行榜`;
  },
  methods: {
    handleGoClientDetile(id) {
      window.nativeHandler.execute("classCourse", id, "");
    },
    async getCourseList() {
      const params = {
        paixuType: "5",
        pageNum: this.pageNum,
        pageSize: 20,
      };
      const res = await getCourseList(params);
      const { data, code, msg } = res.data;
      if (code !== 1000) {
        this.$message.error(msg);
        return;
      }
      if (!data.list.length) {
        this.finished = true;
        return false;
      }
      this.list.push.apply(this.list, data.list);
    },
    returnClient() {
      window.nativeHandler.execute("clossWebView", "", "");
    },
    onLoad() {
      let that = this;
      setTimeout(() => {
        if (that.refreshing) {
          that.pageNum = 1;
          that.list = [];
          that.refreshing = false;
          this.getCourseList();
          // that.pageNum++;
          that.loading = false;
        } else {
          that.pageNum++;
          this.getCourseList();
          that.loading = false;
        }
      }, 1000);
    },
    onRefresh() {
      console.log("refresh", this.refreshing);
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>
<style lang="less" scoped>
.classes {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f7fa;
  overflow: hidden;
}
.header-container {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  background: #bd2020;
  color: #ecf5ff;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .iconleft {
    margin-left: 12px;
    position: absolute;
  }
  .title {
    margin: 0 auto;
  }
}

.rankList {
  width: 95%;
  margin: 0 auto;
  padding: 0.3rem 0;
  margin-top: 64px;
  .cell {
    width: 100%;
    min-height: 0.6rem;
    background-color: #fff;
    box-shadow: 0 -0.03rem 0.06rem #eee;
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
    & > div {
      display: flex;
      justify-content: flex-start;
      flex-flow: row nowrap;
      align-items: center;
    }

    &:nth-child(1) {
      .num {
        i {
          background-image: url(../../../assets/rank-r1.png);
          background-position: 0 0;
          background-size: 0.6rem auto;
          background-repeat: no-repeat;
          transform: rotate(30deg);
          background-color: transparent;
        }
      }
    }
    &:nth-child(2) {
      .num {
        i {
          background-image: url(../../../assets/rank-r2.png);
          background-position: 0 0;
          background-size: 0.6rem auto;
          background-repeat: no-repeat;
          transform: rotate(30deg);
          background-color: transparent;
        }
      }
    }
    &:nth-child(3) {
      .num {
        i {
          background-image: url(../../../assets/rank-r3.png);
          // background-position: 0 0;
          background-size: 0.6rem auto;
          background-repeat: no-repeat;
          transform: rotate(30deg);
          background-color: transparent;
        }
      }
    }

    .num {
      width: 1rem;
      height: 1.2rem;
      flex-shrink: 0;
      display: flex;
      justify-content: flex-start;
      flex-flow: row nowrap;
      align-items: center;
      i {
        display: block;
        width: 0.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        border-radius: 50%;
        font-size: 0.24rem;
        font-weight: 600;
        text-align: center;
        font-style: normal;
        color: #cd0f10;
        background-color: #ffc0cb;
      }
    }
    .img {
      width: 1.2rem;
      height: 1.2rem;
      overflow: hidden;
      border-radius: 0.14rem;
      position: relative;
      flex-shrink: 0;
      img {
        width: auto;
        max-width: 300% !important;
        height: 100%;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .con {
      width: 4.2rem;
      height: 1.2rem;
      display: flex;
      justify-content: space-between;
      flex-flow: column wrap;
      align-items: flex-start;

      .tit {
        width: 4.2rem;
        height: 0.42rem;
        overflow: hidden;
        margin-left: 0.2rem;
        font-size: 0.26rem;
        font-weight: 500;
        color: #303030;
        line-height: 0.42rem;
        text-overflow: -o-ellipsis-lastline;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .author {
        width: 4.2rem;
        display: flex;
        justify-content: space-between;
        flex-flow: row nowrap;
        align-items: center;
        margin-left: 0.2rem;

        .name {
          max-width: 2.7rem;
          height: 0.42rem;
          font-size: 0.24rem;
          color: #909090;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .date {
          width: 1.3rem;
          height: 0.42rem;
          font-size: 0.24rem;
          color: #aaa;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>