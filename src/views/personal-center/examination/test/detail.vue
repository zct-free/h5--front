<template>
  <div class="test-container">
    <!-- <div class="header">
      <i class="iconfont el-icon-arrow-left" @click="$router.back()"></i>
      <el-button >返回</el-button>
      <h3 class="title">{{ testPaperName }}</h3>
    </div> -->
    <h3 class="title">{{ testPaperName }}</h3>
    <div class="divider">
      <p class="mb8">考生：{{ userName }}</p>
      <p class="mb8">得分：{{ totalPoints }}</p>
      <p class="mb8">成绩：{{ grade }}</p>
    </div>
    <div class="main-content">
      <div v-if="singleChoiceList && singleChoiceList.length > 0">
        <h4 class="sub-title">单选题</h4>
        <div
          v-for="(itemArr, index) in singleChoiceList"
          :key="index"
          class="singleChoice"
        >
          <p class="mb8">{{ itemArr.pascalName }}</p>
          <van-radio-group v-model="itemArr.singleChoice">
            <van-radio
              v-for="item in itemArr.questionContents"
              :name="item.optionType"
              :key="item.sn"
              :disabled="true"
              checked-color="#c23a30"
              class="single-radio"
            >
              {{ item.optionType }}，{{ item.content }}
            </van-radio>
          </van-radio-group>

          <p>正确答案：{{ itemArr.solution }}</p>
        </div>
      </div>
      <div v-if="multipleChoiceList && multipleChoiceList.length > 0">
        <h4>多选题</h4>
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
              :disabled="true"
              checked-color="#c23a30"
            >
              {{ item.optionType }}，{{ item.content }}
            </van-checkbox>
          </van-checkbox-group>
          <p>正确答案：{{ itemArr.solution }}</p>
        </div>
      </div>
      <div v-if="judgeList && judgeList.length > 0">
        <h4>判断题</h4>
        <div class="judge" v-for="(itemArr, index) in judgeList" :key="index">
          <p class="mb8">{{ itemArr.pascalName }}</p>
          <van-radio-group v-model="itemArr.judge">
            <van-radio
              v-for="item in itemArr.questionContents"
              :key="item.sn"
              :name="item.optionType"
              :disabled="true"
              checked-color="#c23a30"
            >
              {{ item.optionType == 0 ? "错误" : "正确" }}，{{ item.content }}
            </van-radio>
          </van-radio-group>
          <p>正确答案：{{ itemArr.solution == 0 ? "错误" : "正确" }}</p>
        </div>
      </div>
      <van-button @click="answerAgain" v-if="haveAnswerChoice" type="primary"
        >重新答题</van-button
      >
    </div>
  </div>
</template>

<script>
import { getPaperDetail } from "../../../../../serve/api/test.js";
export default {
  data() {
    return {
      totalPoints: "",
      grade: "",
      userName: "",
      testPaperName: "",
      paperList: [],
      singleChoiceList: [],
      multipleChoiceList: [],
      judgeList: [],
      haveAnswerChoice: true,
    };
  },
  mounted() {
    this.getPaperDetail();
  },
  methods: {
    answerAgain() {
      // this.$router.push({
      //   path: "/testpaper",
      //   query: {
      //     paperId: this.$route.query.testPaperId,
      //     uuid: this.$route.query.uuid,
      //     // 似乎无法拿到id了
      //     userId:'1',
      //     username:this.$route.query.username,
      //   },
      // });
      const testPaperId = this.$route.query.testPaperId;
      const testPaperName = this.$route.query.testPaperName;
      if (
        window.nativeHandler &&
        typeof window.nativeHandler.execute === "function"
      ) {
        window.nativeHandler.execute(
          "clickStatistic",
          `{
            "id": "click_my_exam_detail_answer",
            "paperId": ${testPaperId},
            "paperName": ${testPaperName}
        }`,
          null
        );
      }
      // console.log($route.query,'query')
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
        "beginExam",
        `{
          "url":"${transmitUrl}/?paperId=${testPaperId}&userId=1",
          "testPaperName":${testPaperName},
          "type":"考试"
        }`,
        ""
      );
    },
    async getPaperDetail() {
      const params = {
        userId: this.$route.query.uuid,
        testPaperId: this.$route.query.testPaperId,
        id: this.$route.query.id,
      };
      const res = await getPaperDetail(params);
      const { data, msg, code } = res.data;
      if (code !== 1000) {
        this.$toast.fail(msg);
        return;
      }
      this.totalPoints = data.totalPoints;
      this.userName = data.userName;
      this.testPaperName = data.testPaperName;
      this.grade = data.grade;
      this.paperList = data.pascalList;
      this.haveAnswerChoice = data.isrepeat;
      this.singleChoiceList = data.pascalList.filter((item) => {
        return item.pascalType === "单选";
      });
      this.singleChoiceList.forEach((item, index) => {
        let solution = "";
        item.questionContents.forEach((item) => {
          if (solution && item.whether === "1") {
            solution = solution + "," + item.optionType;
          } else if (item.whether === "1") {
            solution = item.optionType;
          }
        });
        console.log(solution, "solution");
        this.$set(this.singleChoiceList[index], "solution", solution);
        console.log(this.singleChoiceList[index], "index");
      });
      this.multipleChoiceList = data.pascalList.filter((item) => {
        return item.pascalType === "多选";
      });
      this.multipleChoiceList.forEach((item, index) => {
        let solution = "";
        item.questionContents.forEach((item) => {
          if (solution && item.whether === "1") {
            solution = solution + "," + item.optionType;
          } else if (item.whether === "1") {
            solution = item.optionType;
          }
        });
        console.log(solution, "solution");
        this.$set(this.multipleChoiceList[index], "solution", solution);
        console.log(this.singleChoiceList[index], "index");
      });
      this.judgeList = data.pascalList.filter((item) => {
        return item.pascalType === "判断";
      });
      this.judgeList.forEach((item, index) => {
        let solution = "";
        item.questionContents.forEach((item) => {
          if (solution && item.whether === "1") {
            solution = solution + "," + item.optionType;
          } else if (item.whether === "1") {
            solution = item.optionType;
          }
        });
        this.$set(this.judgeList[index], "solution", solution);
      });
      console.log(this.singleChoiceList, "single");
      console.log(this.multipleChoiceList, "multi");
      console.log(this.judgeList, "judge");
    },
  },
};
</script>

<style>
</style>
<style lang="less" scoped>
.test-container {
  width: 100%;
  .main-content {
    display: flex;
    flex-direction: column;
    padding: 0px 14px 14px 14px;
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
}
.divider {
  margin-left: 14px;
  margin-top: 24px;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style lang="less">
@import "@/assets/styles/el.less";
</style>