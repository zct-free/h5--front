<template>
  <div class="test-wrapper">
    <div class="header-container">
      <!-- <h2 class="text">考试</h2> -->
      <div class="search-header">
        <van-field
          class="input"
          v-model="paperName"
          @input="handleSearchPaper"
          right-icon="search"
          placeholder="请输入试卷名称"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i
        ></van-field>
      </div>
    </div>
    <div class="main-content">
      <div class="main-container" v-if="paperList.length > 0 || refreshing">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
          >
            <van-cell v-for="(item, index) in paperList" :key="index">
              <div @click="handleGoTestDetail(item)" class="flex-content">
                <p class="item-route">
                  {{ item.testPaperName }}
                </p>
                <p class="item-time">
                  {{
                    item.creatorTime
                      | toTime(item.creatorTime, "yyyy-MM-dd HH:mm:ss")
                  }}
                </p>
              </div>
              <div class="btn-content">
                <a @click="handleDeleteTest(item.id)" class="text-btn">删除</a>
                <i
                  class="iconfont iconright icon-trans"
                  @click="handleTransmitTest(item)"
                  >&#xe609;</i
                >
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <!-- <div
          class="item-container"
          v-for="(item, index) in paperList"
          :key="index"
        ></div> -->
      </div>
      <div class="main-container" v-if="!paperList.length && !loadingtext">
        <img
          src="../../../../assets/img/nodata.png"
          alt=""
          class="img-content"
        />
        <div class="text-context">暂无数据</div>
      </div>
      <p v-if="loadingtext" class="text-context">加载中...</p>
    </div>
  </div>
</template>

<script>
import {
  getPaperListById,
  deletePaperItem,
} from "../../../../../serve/api/test.js";
// import VConsole from "vconsole";
export default {
  data() {
    return {
      paperName: "",
      paperList: [],
      total: "",
      loading: false,
      finished: false,
      isRun: true,
      pageNum: 1,
      refreshing: false,
      loadingtext: false,
    };
  },
  mounted() {
    this.getPaperListById();
    // let vConsole = new VConsole();
  },
  filters: {
    toTime(timer, type) {
      console.log(type);
      let date = new Date(timer);
      //年
      let year = date.getFullYear();
      let month = (date.getMonth() + 1 + "").padStart(2, "0");
      //天
      let day = (date.getDate() + "").padStart(2, "0");
      //小时
      let hours = (date.getHours() + "").padStart(2, "0");
      //分钟
      let minute = (date.getMinutes() + "").padStart(2, "0");
      //秒
      let second = (date.getSeconds() + "").padStart(2, "0");
      //结果是 /
      //结果 -
      // if (type === "yyyy-MM-dd HH:mm:ss") {
      return `${year}-${month}-${day} ${hours}:${minute}:${second}`;
      // } else if (type === "yyyy/MM/dd HH:mm:ss") {
      //   return `${year}/${month}/${day} ${hours}:${minute}:${second}`;
      // } else {
      //   return `${year}-${month}-${day}`;
      // }
    },
  },
  methods: {
    handleSearchPaper() {
      this.pageNum = 1;
      this.finished = false;
      if (this.loadingtext) {
        return;
      }
      this.loadingtext = true;
      this.paperList = [];
      setTimeout(() => {
        this.getPaperListById();
        this.loadingtext = false;
      }, 1000);
    },
    //下拉刷新
    onRefresh() {
      console.log(this.refreshing, "refreshing");
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.loading = true;
      this.onLoad();
    },
    async getPaperListById(status, id) {
      const params = {
        userId: this.$route.query.uuid,
        testPaperName: this.paperName,
        pageNum: this.pageNum,
        pageSize: 30,
      };
      const res = await getPaperListById(params);
      const { data, code, msg } = res.data;
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      }

      this.refreshing = false;
      if (!status) {
        this.paperList.push.apply(this.paperList, data.list);
      } else {
        console.log("111");
        this.paperList.forEach((item, index) => {
          console.log(index, "index");
          if (item.id === id) {
            this.paperList.splice(index, 1);
            // index--;
            // console.log(index, "index");
          }
        });
        console.log(this.paperList, "paperlist222");
      }
      if (!data.list.length) {
        this.finished = true;
        this.refreshing = false;
        this.loading = false;
        return;
      }
      this.total = data.total;
      this.loading = false;
      this.loadingtext = false;
    },
    async handleDeleteTest(id) {
      const params = {
        id: id,
        userId: this.$route.query.uuid,
      };
      const res = await deletePaperItem(params);
      const { code, msg } = res.data;
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      }
      let status = true;
      this.getPaperListById(status, id);
    },
    handleGoTestDetail(item) {
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          `{
                "id": "click_my_exam_detail",
                "paperId": ${item.testPaperId},
                "from": "paperList"
            }`,
          null
        );
      }
      const env = process.env.NODE_ENV;
      let transmitUrl = "";
      console.log(env, "env1");
      switch (env) {
        case "development":
          transmitUrl = `http://1hao.bonc.local/html5/`;
          break;
        case "relase":
          transmitUrl = `http://1hao.bonc.local/html5/`;
          break;
        case "relasebcos":
          transmitUrl = `http://1hao.bonc.local/html5/`;
          break;
        // 客户生产
        case "production":
          transmitUrl = `https://apph5.81.mil.cn/`;
          break;
        case "k8sproduction":
          transmitUrl = "https://apph5.81.mil.cn/";
          break;
        default:
          transmitUrl = `https://apph5.81.mil.cn/`;
          break;
      }
      window.nativeHandler.execute(
        "beginExam",
        `{"url":"${transmitUrl}personal-center/examination2/detail/?testPaperId=${item.testPaperId}&id=${item.id}&testPaperName=${item.testPaperName}",
          "testPaperName":${item.testPaperName},
          "type":"考试"}`,
        ""
      );
      // this.$router.push({
      //   path: "/personal-center/examination2/detail",
      //   query: {
      //     testPaperId: item.testPaperId,
      //     testPaperName: item.testPaperName,
      //     id: item.id,
      //     uuid: this.$route.query.uuid,
      //     username: this.$route.query.username,
      //   },
      // });
    },
    handleTransmitTest(item) {
      // console.log($route.query,'query')
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          `{
            "id": "click_my_exam_share",
            "paperId": ${item.testPaperId},
            "paperName": ${item.testPaperName}
        }`,
          null
        );
      }
      const env = process.env.NODE_ENV;
      let transmitUrl = "";
      // const courseNoId = Cookies.get("courseInfo");
      // const course = JSON.parse(courseNoId);
      console.log(env, "env1");
      switch (env) {
        case "development":
          transmitUrl = `http://1hao.bonc.local/html5/testpaper`;
          break;
        case "relase":
          transmitUrl = `http://1hao.bonc.local/html5/testpaper`;
          break;
        case "relasebcos":
          transmitUrl = `http://1hao.bonc.local/html5/testpaper`;
          break;
        // 客户生产
        case "production":
          transmitUrl = `https://apph5.81.mil.cn/testpaper`;
          break;
        case "k8sproduction":
          transmitUrl = "https://apph5.81.mil.cn/testpaper";
          break;
        default:
          transmitUrl = `https://apph5.81.mil.cn/testpaper`;
          break;
      }
      window.nativeHandler.execute(
        "nativeShare",
        `{"url":"${transmitUrl}/?paperId=${item.testPaperId}&userId=1","testPaperName":${item.testPaperName},"type":"考试"}`,
        ""
      );
    },
    onLoad(status) {
      if (!this.refreshing) {
        this.loading = true;
      }
      if (!this.isRun) {
        return false;
      }
      this.isRun = false;
      setTimeout(() => {
        if (this.refreshing && !status) {
          this.pageNum = 1;
          this.paperList = [];
          this.refreshing = false;
          this.getPaperListById();
          this.isRun = true;
          // this.loading = false;
          return;
        }
        if (status) {
          // this.pageNum = 1;
          // this.paperList = [];
          // this.refreshing = false;
          this.getPaperListById();
          this.isRun = true;
          this.loadingtext = false;
        }
        this.pageNum++;
        this.getPaperListById();
        this.isRun = true;
        // this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.test-wrapper {
  overflow: auto;
  height: 100%;
  .header-container {
    background: #bd2020;
    color: #ecf5ff;
    height: 64px;
    letter-spacing: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-content {
    height: calc(100vh - 64px);
    margin-top: 64px;
    overflow: auto;
    background: #ffff;
  }
  .main-container {
    .van-pull-refresh {
      overflow: visible !important;
    }
    .msg {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      color: #ddd;
    }
    .item-container {
      // background: rgb(255, 255, 255);
      // border-bottom: 1px solid #ddd;
      // height: 46px;
      // line-height: 46px;
      // padding: 0px 14px;
      // display: flex;
      // justify-content: space-between;
      .flex-content {
        width: 70%;
        display: flex;
        justify-content: flex-start;
      }
      .btn-content {
        width: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .text-btn {
        margin-right: 0.5rem;
      }
    }
    .img-content {
      padding-top: 0.5rem;
    }
    .text-context {
      font-size: 0.27rem;
      text-align: center;
      color: #8e8f93;
      position: relative;
      top: -2rem;
      // padding-top: 0.5rem;
    }
  }
  .text-context {
    font-size: 0.27rem;
    text-align: center;
    color: #8e8f93;
    padding-top: 0.5rem;
  }
}
.main-container {
  .van-cell__value {
    background: rgb(255, 255, 255);
    height: 46px;
    padding: 0px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .flex-content {
    width: 70%;
    display: flex;
    justify-content: flex-start;
  }
  .text-btn {
    margin-right: 0.35rem;
    color: #409eff;
  }
  .item-route {
    width: 50%;
    flex-shrink: 0;
    margin-right: 0.3rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .item-time {
    width: 50%;
    font-size: 0.25rem;
    flex-shrink: 0;
    color: #8e8f93;
  }

  .van-button--info {
    flex-shrink: 0;
    background-color: #d64540;
    border-color: #d64540;
  }
}
</style>
<style lang="less">
.header-container {
  position: fixed;
  width: 100%;
  .input {
    border-radius: 12px;
    height: 38px;
    .van-field__body {
      margin-top: -0.05rem;
    }
  }
  .search-header {
    width: 320px;
  }
}
</style>
