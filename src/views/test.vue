<template>
  <div class="test-container">
    <div class="header">
      <!-- <div class="main">
        <i class="iconfont icon-zuojt_btn iconleft" @click="returnClient"></i>
        <h3 class="title">{{ testPaperName }}</h3>
        <i
          class="iconfont iconright"
          @click="handleTransmitTest($route.query.paperId)"
          >&#xe609;</i
        >
      </div> -->
      <h3 class="title">{{ testPaperName }}</h3>
      <div class="right">
        <p>考试时间：{{ durations }}（分）</p>
        <p>总分：{{ totalPoints }}</p>
      </div>
      <p v-if="currentPoints">您当前试卷的得分为：{{ currentPoints }}</p>
    </div>
    <div class="paper-content">
      <h4 v-if="singleChoiceList && singleChoiceList.length > 0">单选题</h4>
      <div
        class="singleChoice"
        v-for="(itemArr, index) in singleChoiceList"
        :key="index"
      >
        <p class="mb8">{{ itemArr.pascalName }}</p>
        <van-radio-group v-model="itemArr.singleChoice">
          <van-radio
            v-for="item in itemArr.questionContents"
            :key="item.sn"
            :name="item.optionType"
            class="single-radio"
            checked-color="#c23a30"
          >
            {{ item.optionType }}，{{ item.content }}
          </van-radio>
        </van-radio-group>
      </div>
      <h4 v-if="multipleChoiceList && multipleChoiceList.length > 0">多选题</h4>
      <div
        class="multipleChoice"
        v-for="(itemArr, index) in multipleChoiceList"
        :key="index"
      >
        <p class="mb8">{{ itemArr.pascalName }}</p>
        <van-checkbox-group v-model="itemArr.multipleChoice">
          <van-checkbox
            class="checkbox-content"
            v-for="item in itemArr.questionContents"
            :key="item.sn"
            :name="item.optionType"
            checked-color="#c23a30"
          >
            {{ item.optionType }}，{{ item.content }}
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <h4 v-if="judgeList && judgeList.length > 0">判断题</h4>
      <div class="judge" v-for="(itemArr, index) in judgeList" :key="index">
        <p class="mb8">{{ itemArr.pascalName }}</p>
        <van-radio-group v-model="itemArr.judge">
          <van-radio
            v-for="item in itemArr.questionContents"
            :key="item.sn"
            :name="item.optionType"
            v-model="itemArr.judge"
            checked-color="#c23a30"
          >
            <span
              >{{ item.optionType == 0 ? "错误" : "正确" }}，{{
                item.content
              }}</span
            >
          </van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="exist-record-div">
      <div class="btn-group">
        <van-button
          @click="submitPaper"
          class="btn"
          type="primary"
          :disabled="!haveAnswerChoice"
          >提交试卷</van-button
        >
        <van-button @click="returnClient" class="btn" type="default"
          >返回</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  handleGetPaper,
  handleGetTotalPoints,
  submitPaper,
  // getPaperDetail,
} from "../../serve/api/test.js";
export default {
  data() {
    return {
      singleChoiceList: [],
      multipleChoiceList: [],
      judgeList: [],
      List: [],
      testPaperName: "随堂调查",
      durations: "90",
      totalPoints: "100",
      passPoints: "",
      excellentPoints: "",
      currentPoints: "",
      showPaper: true,
      showTimes: "",
      haveAnswerChoice: true,
    };
  },
  created() {
    // let xmlHttp=new XMLHttpRequest();
    // var req = new XMLHttpRequest();
    // req.open("GET", document.location, false);
    // req.send(null);
    // console.log(req.getAllRequestHeaders(), "headers");
    // console.log(xmlHttp,'headers')
    if (this.$route.query.paperId) {
      this.handleGetTotalPoints();
      // this.getPaperDetail();
    }
  },
  methods: {
    returnClient() {
      window.nativeHandler.execute("clossWebView", "", "");
    },
    handleTransmitTest(id) {
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
        `{"url":"${transmitUrl}/?paperId=${id}&userId=1","testPaperName":${this.testPaperName},"type":"考试"}`
      );
    },
    // async getPaperDetail() {
    //   const params = {
    //     userId: this.$route.query.uuid,
    //     testPaperId: this.$route.query.paperId,
    //     id: this.$route.query.id,
    //   };
    //   const res = await getPaperDetail(params);
    //   const { data, msg, code } = res.data;
    //   if (code !== 1000) {
    //     this.$message.error(msg);
    //     return;
    //   }
    //   // this.totalPoints = data.totalPoints;
    //   // this.testPaperName = data.testPaperName;
    //   this.grade = data.grade;
    //   // this.paperList = data.pascalList;
    //   this.haveAnswerChoice = data.isRepeat;
    // },
    async handleGetTotalPoints() {
      const params = {
        userId: this.$route.query.uuid, //客户端id
        testPaperId: this.$route.query.paperId,
      };
      const res = await handleGetTotalPoints(params);
      const { data, code, msg } = res.data;
      console.log(data.existRecord, "exisr");
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      } else if (data.existRecord === "1") {
        console.log(data.totalPoints, "if(1)totalPoints");
        this.currentPoints = data.totalPoints;
        this.haveAnswerChoice = data.isrepeat;
        this.showPaper = false;
        this.getPaperList();
      } else {
        this.currentPoints = data.totalPoints;
        this.haveAnswerChoice = data.isrepeat;
        this.getPaperList();
      }
    },
    async getPaperList() {
      console.log(this.$route.query, "query");
      const params = {
        testPaperId: this.$route.query.paperId,
        userId: this.$route.query.userId,
      };
      const res = await handleGetPaper(params);
      const { data, msg, code } = res.data;
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      }
      this.durations = data.durations;
      this.totalPoints = data.totalPoints;
      this.testPaperName = data.testPaperName;
      this.passPoints = data.passPoints;
      this.excellentPoints = data.excellentPoints;
      this.List = data.pascalPreview;
      this.singleChoiceList = data.pascalPreview.filter((item) => {
        return item.pascalType === "单选";
      });
      this.multipleChoiceList = data.pascalPreview.filter((item) => {
        return item.pascalType === "多选";
      });
      this.judgeList = data.pascalPreview.filter((item) => {
        return item.pascalType === "判断";
      });
      this.singleChoiceList.forEach((item, index) => {
        this.$set(this.singleChoiceList[index], "singleChoice", "");
      });
      this.multipleChoiceList.forEach((item, index) => {
        this.$set(this.multipleChoiceList[index], "multipleChoice", []);
      });
      this.judgeList.forEach((item, index) => {
        this.$set(this.judgeList[index], "judge", "");
      });
    },
    async submitPaper() {
      // console.log('提交试卷11', window.nativeHandler, typeof window.nativeHandler.execute === 'function');
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        // console.log('提交试卷1-1');
        window.nativeHandler.execute(
          "clickStatistic",
          `{
                "id": "click_my_exam_submit",
                "paperId": ${this.$route.query.paperId},
                "paperName": ${this.testPaperName}
            }`,
          null
        );
      }
      let totalPoints = 0;
      console.log(this.singleChoiceList, "singlelist");
      this.singleChoiceList.forEach((itemArr) => {
        const trueItem = itemArr.questionContents.filter((item) => {
          return item.whether === "1";
        });
        if (itemArr.singleChoice === trueItem[0].optionType) {
          totalPoints = totalPoints + Number(itemArr.perScore);
        }
      });
      this.multipleChoiceList.forEach((itemArr) => {
        const trueItem = itemArr.questionContents.filter((item) => {
          return item.whether == "1";
        });
        const trueArr = trueItem.map((item) => {
          return item.optionType;
        });
        trueArr.sort();
        itemArr.multipleChoice.sort();
        if (itemArr.multipleChoice.toString() === trueArr.toString()) {
          totalPoints = totalPoints + Number(itemArr.perScore);
        }
      });
      this.judgeList.forEach((itemArr) => {
        const trueItem = itemArr.questionContents.filter((item) => {
          return item.whether === "1";
        });
        if (itemArr.judge === trueItem[0].optionType) {
          totalPoints = totalPoints + Number(itemArr.perScore);
        }
      });
      console.log(totalPoints, "points1");
      const pascalList = this.List;
      console.log(pascalList, "pascalList1");
      const grade =
        totalPoints > this.excellentPoints
          ? "优秀"
          : totalPoints > this.passPoints
          ? "及格"
          : "不及格";
      const params = {
        userId: this.$route.query.uuid, //客户端用户id
        testPaperId: this.$route.query.paperId,
        totalPoints: totalPoints, //提交判分
        testPaperName: this.testPaperName,
        userName: this.$route.query.username,
        grade: grade,
        pascalList: pascalList,
      };
      const res = await submitPaper(params);
      const { code, msg } = res.data;
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      }
      this.$toast.success("提交成功！");
      window.nativeHandler.execute("closeAllWebView", "", "");
    },
  },
};
</script>
<style lang="less" scoped>
.test-container {
  width: 100%;
  padding-top: 12px;
  .paper-content {
    display: flex;
    flex-direction: column;
    padding: 0px 14px 14px 14px;
  }
  .mb8 {
    margin-bottom: 8px;
  }
  .singleChoice {
    margin-bottom: 14px;
    .single-radio {
      display: flex;
      line-height: 24px;
      height: 24px;
      align-items: center;
    }
  }
  .multipleChoice {
    margin-bottom: 24px;
    .checkbox-content {
      display: flex;
      line-height: 24px;
      height: 24px;
      align-items: center;
    }
  }
  .judge {
    margin-bottom: 24px;
  }
  .header {
    margin-bottom: 14px;
    // .main {
    //   position: fixed;
    //   top: 0;
    //   width: 100%;
    //   height: 64px;
    //   line-height: 64px;
    //   display: flex;
    //   color: #fff;
    //   background: #bd2020;
    //   // flex-direction: column;
    //   align-items: center;
    //   z-index: 999;

    //   .icon {
    //     margin-left: 12px;
    //     position: absolute;
    //   }
    //   .iconleft {
    //     margin-left: 12px;
    //   }
    //   .iconright {
    //     margin-right: 12px;
    //   }

    // }
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right {
      padding: 0px 14px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      margin-top: 24px;
      p {
        margin: 4px 0px;
      }
    }
  }
}
.exist-record-div {
  padding: 0px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  // height: calc(100vh - 150px);
  justify-content: space-between;
  .btn-group {
    display: flex;
    flex-direction: column;
    .van-button--primary {
      background-color: #c23a30;
      border-color: #c23a30 !important;
      color: #ecf5ff;
    }
    .van-button--default {
      background: #a6a9ad !important;
      border-color: #a6a9ad !important;
      color: #fff !important;
    }
    .van-button.is-disabled,
    .van-button.is-disabled:focus,
    .van-button.is-disabled:hover {
      color: #c0c4cc !important;
      background-color: #fff !important;
      border-color: #ebeef5 !important;
      cursor: not-allowed !important;
    }
  }
}
.btn {
  margin-top: 16px;
  margin-left: 0px !important;
}
</style>
<style lang="less">
@import "@/assets/styles/el.less";
</style>
