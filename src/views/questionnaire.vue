<template>
  <div style='height: 100%;padding: 1rem 0.4rem;'>
    <div class="question_box">
      <div class="progress">
        <a class="progress_bar">
          <i
            style="width: 0"
            :style="{
              width:
                (positionFlag / questionData.length) * 100 > 100
                  ? 100
                  : (positionFlag / questionData.length) * 100 + '%',
            }"
          ></i>
          <!-- <span class="first">1</span>
          <span class="end">2</span> -->
        </a>
        <span style="font-size: 14px; color: #444"
          >{{
            positionFlag
              ? positionFlag - 0 + 1 >= questionData.length
                ? questionData.length
                : positionFlag - 0 + 1
              : 1
          }}/{{ questionData.length }}</span
        >
      </div>
      <div class="question_title">
        <a class="count_down">计时器：{{ time }}</a>
        <a class="num" v-if="positionFlag - 0 + 1 > questionData.length">填写信息</a>
        <a class="num" v-else-if='positionFlag - 0 + 1 <= questionData.length && (positionFlag == 0 || positionFlag) '
          >第{{
            positionFlag
              ? positionFlag - 0 + 1 >= questionData.length
                ? questionData.length
                : positionFlag - 0 + 1
              : 1
          }}题</a
        >
      </div>
      <van-form class="question_form" ref="ruleForm" @submit="submitForm">
        <div v-if="positionFlag - 0 + 1 > questionData.length" style='height: 100%'>
          <van-cell-group inset>
            <van-field
              v-model="phone"
              name="电 话"
              label="电 话"
              placeholder="电 话"
              :rules="[{ required: true, message: '请填写电话' }]"
            />
          </van-cell-group>
          <div class="submit_btn">
            <a class="pre_question_btn" @click="preQuestion" :style="{color: !isClick && '#ccc'}">上一题</a>  
            <van-button round block type="primary" native-type="submit" :style="{color: !flag && '#ccc'}"> 提 交 </van-button>
          </div>
        </div>
        <div v-else-if='positionFlag - 0 + 1 <= questionData.length && (positionFlag == 0 || positionFlag)' style='height: 100%'>
          <van-cell-group
            inset
            v-for="(item, index) in questionData"
            :key="index"
            v-if="positionFlag == index"
          >
            <p class="question_list">{{ item.question }}</p>
            <div class="answer">
              <a
                v-for="(items, i) in item.answer"
                :key="i"
                @click="nextQuestion(index, items)"
                :style="{background: answer['an' + (index + 1)] == items && '#409eff', color: answer['an' + (index + 1)] == items && '#fff'}"
                >{{ items }}</a
              >
            </div>
            <div class="submit_btn"  v-if="index > 0">
              <a class="pre_question_btn" @click="preQuestion(index)" :style="{color: !isClick && '#ccc'}">上一题</a>  
            </div>
          </van-cell-group>
        </div>
        <div class="instruction" v-else>
          <h2>总 指 导 语</h2>
          <p class="part">
            以下每道题目描述的都是人们在日常生活中的行为表现或真实感受，请根据您最近一个月的实际状况或想法，选择最符合您个人情况的选项。
          </p>
          <p>例如：</p>
          <p>即使当我一个人的时候，我还是觉得有人在看着我。</p>
          <p class="part"><a>A. 不符合</a><a>B. 有些符合</a><a>C. 比较符合</a><a>D. 符合</a></p>
          <p>如果这种情况完全不符合您平时的行为表现，请点击“不符合”；如果有些符合您平时的行为表现，请点击“有些符合”；如果比较符合您平时的行为表现，请点击“比较符合”；如果完全符合您平时的行为表现，请点击“符合”。</p>
          <a class="start_btn" @click="positionFlag = 0">开 始 测 评</a>
        </div>
      </van-form>
      
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { getCurrentUrl } from "@/plugins/config";
import VConsole from "vconsole";
export default {
  name: "Question",
  data() {
    return {
      stimer: "",
      etimer: "",
      time: "00:00:00",
      positionFlag: null,
      flag: true, // 防止重复提交
      answer: {},
      n_hour: 0,
      n_min: 0,
      n_sec: 0,
      totaltime: 0,
      timeInterval: null,
      phone: "",
      isClick: true,
      questionData: [
        {
          question: "面对疫情，我觉得自己充满无力感。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我最近对很多事情都提不起兴趣。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近我容易哭泣。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "有的时候我感到自己毫无价值。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近总感觉前景黯淡，没有希望。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "您最近的睡眠质量：",
          answer: ["很好", "较好", "较差", "很差"],
        },
        {
          question: "我觉得没有什么精神，精力也比以前差。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我觉得自己会成为别人的负担。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我最近总担心住的小区会有疫情发生。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近很担心网上那些新闻事件会发生在自己身上。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "一看到疫情相关报道，我就坐立难安。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "有时会有恐怖的念头闪现在我的脑海中。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近因为疫情总是感觉抑制不住的心烦。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我觉得比平常容易紧张和着急。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近经常感觉胃不舒服，消化不良。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "最近很难心平气和，总是坐立难安。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "从外面回家后我会反复用酒精或消毒液喷洒、擦拭衣物。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我最近总是难以集中注意力。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "出门时我总觉得自己的口罩没有戴好，需要反复检查调整。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会一遍遍反复查询疫情确诊人数情况。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我头脑中反复出现最近的新闻事件，难以控制或压制它们。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会控制不住地一直刷疫情相关报道和消息。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会不停地想要洗手。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question:
            "当看到新闻报道里面的症状时，会觉得自己也出现了类似的情况（如干咳、乏力等）。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会反复到医院或通过线上问诊确认自己是否已经被感染。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会不断回想我去过的地方、接触的人，排查是否接触过感染源。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "即使经过医生诊断我的身体没问题，我还是忍不住地担心。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我觉得外界充满了病毒，随时都会被感染。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我会频繁测量体温。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我觉得我和家人的身体都还是健康的。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我经常感到对世事的不满。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "这次疫情事件让我觉得大多数人都是难以信任的。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我认为这次疫情事件还要持续很长一段时间。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我感到自己很难适应最近紧张的形势。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "对于未来，我隐隐有一种恐惧感。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我觉得只要一出门就很容易被感染。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "我最近经常因怀疑些事情是否真实而苦恼。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
        {
          question: "总的来说，我感到世界对我是公正的。",
          answer: ["不符合", "有些符合", "比较符合", "符合"],
        },
      ],
    };
  },
  watch: {
    positionFlag() {
      if (this.positionFlag == 0) {
        clearInterval(this.timeInterval);
        this.timer();
      }
    }
  },
  methods: {
    preQuestion(index) {
      if (!this.isClick) return
      this.positionFlag = this.positionFlag - 1
      this.isClick = false
    },
    nextQuestion(i, val) {
      this.answer["an" + (i + 1)] = val;
      this.positionFlag = i + 1;
      this.isClick = true
    },
    submitForm(formName) {
      clearInterval(this.timeInterval);
      this.etimer = Date.now();
      this.answer.tel = this.phone;
      this.answer.stime = this.stimer;
      this.answer.etime = this.etimer;
      this.answer.totaltime = this.totaltime;
      this.answer.guid = this.guid;

    //   console.log('submit')
    //   console.log(formName, this.answer, "answer");
    //   console.log('submit')
      // bonc-column-monitor/questions/insert
    ///cms-app/questions/insert
      if (!this.flag) return
      this.flag = false
      this.$axios
        .post(`${getCurrentUrl("cmsApp")}/questions/insert`, this.answer)
        .then((res) => {
          console.log(res);
          Dialog.alert({
            // title: "答题进度",
            message: "您已成功提交，感谢您的参与！",
          }).then(() => {
            // on close
          });
        })
        .catch((e) => {
          this.flag = true
          Dialog.alert({
            // title: "答题进度",
            message: "请重新提交，感谢您的参与！",
          }).then(() => {
            // on close
          });
          console.log(e);
        });
    },
    timer() {
      this.timeInterval = setInterval(() => {
        let str_sec = this.n_sec;
        let str_min = this.n_min;
        let str_hour = this.n_hour;
        if (this.n_sec < 10) {
          str_sec = "0" + this.n_sec;
        }
        if (this.n_min < 10) {
          str_min = "0" + this.n_min;
        }

        if (this.n_hour < 10) {
          str_hour = "0" + this.n_hour;
        }

        this.time = str_hour + ":" + str_min + ":" + str_sec;
        this.totaltime = str_hour * 60 * 60 + str_min * 60 + str_sec;
        this.n_sec++;
        if (this.n_sec > 59) {
          this.n_sec = 0;
          this.n_min++;
        }
        if (this.n_min > 59) {
          this.n_sec = 0;
          this.n_hour++;
        }
      }, 1000);
      return this.timeInterval;
    }
  },
  mounted() {
      //this.guid = native.getUserInfo().guid;
      this.guid = this.$route.query.uuid || this.$route.query.guid
      if (this.$route.query.vconsole) {
        new VConsole();
      }
  },
  created() {
    this.stimer = Date.now();
  },
};
</script>
<style lang="less" scoped>
.question_box {
  // padding: 1rem 0.4rem;
  height: 100%;
  .progress {
    display: flex;
    align-items: center;
    margin-bottom: 0.6rem;
    width: 100%;
    .first,
    .end {
      position: absolute;
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      line-height: 0.48rem;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border: 0.06rem solid green;
      border-radius: 50%;
      background: #fff;
      text-align: center;
      box-sizing: border-box;
    }
    .progress_bar {
      position: relative;
      display: inline-block;
      margin-right: 0.24rem;
      width: 100%;
      height: 0.2rem;
      background: #eee;
      border-radius: 0.1rem;
      i {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background: #5ab44f;
        border-radius: 0.1rem;
      }
    }
    .end {
      left: auto;
      right: 0;
    }
  }
  .question_title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.28rem;
    .count_down {
      position: absolute;
      left: 0;
      width: 2.12rem;
      font-size: 0.24rem;
    }
    .num {
      // margin-left: 0.9rem;
      font-size: 0.28rem;
      font-weight: 600;
    }
  }
  .question_form {
    position: relative;
    padding: 0.6rem 0.4rem;
    min-height: 8rem;
    box-shadow: 0px 0.06rem 0.08rem 0.02rem #ccc;
    border-radius: 0.1rem;
    .instruction {
      h2 {
        font-size: 0.4rem;
        text-align: center;
      }
      p {
        display: flex;
        justify-content: space-between;
        font-size: 0.28rem;
        line-height: 0.5rem
      }
      .part {
        margin-bottom: 0.4rem;
      }
      .start_btn {
        display: table;
        margin:  0.7rem auto 0;
        padding: 0 0.3rem;
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.3rem;
        color: #444;
        font-weight: 500;
        border: 1px solid #ccc;
        border-radius: 0.35rem;
      }
    }
  }
  .van-cell-group--inset {
    height: 100%;
  }
  .submit_btn {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 0.6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
  .van-button--block {
    display: inline-block;
    width: 2rem;
    height: 0.7rem;
    line-height: 0.7rem;
    font-size: 0.3rem;
    color: #444;
    font-weight: 500;
    border: 1px solid #ccc;
    border-radius: 0.35rem;
    background: #fff;
    text-align: center;
    &:hover, &:focus, &:active {
      background: #fff;
    }
  }
  .question_list {
    margin: 0;
    padding-bottom: 0.4rem;
    font-size: 0.36rem;
    line-height: 0.56rem;
    border-bottom: 0.02rem dashed #ccc;
  }
  .answer {
    display: flex;
    flex-direction: column;
    padding: 0.2rem 0;
    a {
      display: inline-block;
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      font-size: 0.28rem;
      line-height: 0.6rem;
      color: #444;
      border: 0.02rem solid #eee;
      border-radius: 0.1rem;
      &:hover, &:focus, &:active {
        color: #fff;
        background: #409eff;
      }
    }
  }
  .pre_question_btn {
    display: inline-block;
    width: 2rem;
    height: 0.7rem;
    line-height: 0.7rem;
    font-size: 0.3rem;
    color: #444;
    font-weight: 500;
    border: 1px solid #ccc;
    border-radius: 0.35rem;
    text-align: center;
  }
}
.van-cell {
  border: 1px solid #ccc;
  border-radius: 8px;
}
/deep/.van-field__label {
  width: 3em !important;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
  border: none;
}
.van-hairline, .van-hairline--bottom, .van-hairline--left, .van-hairline--right, .van-hairline--surround, .van-hairline--top, .van-hairline--top-bottom {
  position: inherit;
}
</style>
