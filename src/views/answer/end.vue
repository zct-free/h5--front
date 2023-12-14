<template>
    <div class="answerMain">
        <div class="head">
            <div class="back" @click="backEntry">
                <van-icon name="arrow-left" size="20" />
            </div>
        </div>
        <div class="mainShow" v-if="type == 'special' || type === 'month'">
            <div class="bg"></div>
            <div class="mainPan">
                <div class="top">
                    <div class="text">
                        <div class="title">
                            本次作答分数 {{ correctNum * preScore }}分
                        </div>
                        <!-- <div class="num">{{ questionsNums - errNUm }}</div> -->
                    </div>
                    <div class="img"></div>
                </div>
                <div class="bottom">
                    <div class="textItem">
                        <div class="left">正确率：{{ stats }}%</div>
                        <div class="right" v-if="upperLimit || (!upperLimit && isFirst == false && type =='DAILY')">积分领取已达上限</div>
                        <!-- <div class="right" v-else-if="!upperLimit && isFirst == false && type !='DAILY'">已领取积分</div> -->
                        <div class="right" v-else>积分：+{{ type === 'month' ? reportPoint : point }}</div>
                    </div>
                    <div class="textItem">
                        <!-- <div class="left">错题数：{{ errNUm }}</div>
                        <div class="right">积分：+{{ point }}</div> -->
                    </div>
                    <div class="btns">
                        <div class="btn" @click="reMain" v-if="!upperLimit">再来一次</div>
                        <div class="btn main" @click="lookMain">查看解析</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mainShow" v-else>
            <div class="bg"></div>
            <div class="mainPan">
                <div class="top">
                    <div class="text">
                        <div class="title">本次答对题目</div>
                        <div class="num">{{ questionsNums - errNUm }}</div>
                    </div>
                    <div class="img"></div>
                </div>
                <div class="bottom">
                    <div class="textItem">
                        <div class="left">正确率：{{ stats }}%</div>
                        <div class="right">用时：{{ time }}</div>
                    </div>
                    <div class="textItem">
                        <div class="left">错题数：{{ errNUm }}</div>
                        <div class="right" v-if="upperLimit || (!upperLimit && isFirst == false && type =='DAILY')">积分领取已达上限</div>
                        <div class="right" v-else>积分：+{{ point }}</div>
                        <!-- <div class="right" v-else-if="!upperLimit && isFirst == false && type !='DAILY'">已领取积分</div>
                        <div class="right" v-else>积分：+{{ point }}</div> -->
                    </div>
                    <div class="btns">
                        <div class="btn" @click="backEntry">返回</div>
                        <div class="btn main" @click="reMain">再来一组</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from "md5";
import { integrateAdd } from "../../../serve/api/answer.js";
import { baseConfig } from "@/config/common.js";
const {
  SERVER_NAME: { credits },
} = baseConfig;
export default {
    data() {
        return {
            startTime: "",
            endTime: "",
            errNUm: "",
            questionsNums: "",
            stats: "",

            time: "00:00:00",

            uuid: "",
            ruleId: "",
            to: "main", //跳转路由
            preScore: 1,
            correctNum: 1,
            libId: null,
            isFirst: false,
            upperLimit: false,
            reportPoint: 0,
        };
    },
    props: {
        confing: {},
        type: "",
    },
    methods: {
        backEntry() {
            this.$router.push({
                path: "/answer/entry",
                query: { uuid: this.uuid },
            });
        },
        lookMain() {
            this.$emit("lookMain");
        },
        reMain() {
            this.$emit("reMain");
        }
    },
    async created() {
        let {
            startTime,
            endTime,
            errNUm,
            questionsNums,
            point,
            reportPoint,
            ruleId,
            isAnalysis,
            to,
            answerStatus,
            questionGroupId,
            preScore,
            correctNum,
            isFirst,
            libId,
            upperLimit,
        } = this.confing;
        this.startTime = startTime;
        this.endTime = endTime;
        this.errNUm = errNUm;
        this.questionsNums = questionsNums;
        this.point = point;
        this.reportPoint =  this.type === 'month' ? reportPoint : point;
        this.ruleId = ruleId;
        this.isAnalysis = isAnalysis;
        this.to = to;
        this.questionGroupId = questionGroupId;
        this.answerStatus = answerStatus;
        this.preScore = preScore;
        this.correctNum = correctNum;
        this.isFirst = isFirst;
        this.upperLimit = upperLimit;
        this.libId = libId;
        const _seconds = parseInt((endTime - startTime) / 1000);

        let hours = "00";
        let minutes = "0";
        let seconds = "0";

        if (_seconds > 59) {
            minutes = Math.floor(_seconds / 60);
            seconds = _seconds - minutes * 60;
        } else {
            seconds = _seconds;
        }
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.time = `${hours}:${minutes}:${seconds}`;

        this.stats = Math.floor(
            (Number(questionsNums - errNUm) / Number(questionsNums)) * 100
        );

        this.uuid = this.$route.query.uuid;
        console.log("正确率正确率正确率", this.stats);
        if (this.stats >= 60 || this.type === "month" || this.type === "DAILY") {
            //积分
            let time = new Date();
            let uniqueId = md5(time);

            const env = process.env.NODE_ENV;
            let idObj = {
                DAILY: 'd69b6c5aad5f47babe23a2bccb24a696',
                month: '46b3923492e9459d9f1db1d81f729f73',
            }
            let taskId = "";
            switch (env) {
                case "development":
                    taskId = `3864e87fdf1a44ddb24d7b3979bd9fda`;
                    break;
                case "relase":
                    taskId = `3864e87fdf1a44ddb24d7b3979bd9fda`;
                    break;
                case "relasebcos":
                    taskId = `3864e87fdf1a44ddb24d7b3979bd9fda`;
                    break;
                // 客户生产
                case "production":
                    taskId = `${idObj[this.type]}`;
                    break;
                case "k8sproduction":
                    taskId = `${idObj[this.type]}`;
                    break;
                default:
                    taskId = `${idObj[this.type]}`;
                    break;
            }
            let res = await this.$axios.get(credits + "/taskList", {
                params: {
                    userId: window.localStorage.getItem("uuid"),
                },
            });
            let { data } = res;
            console.log(res);
            let task = {};
            if(data.code === 1000) {
                let { taskList } = data.data;
                task = taskList.find((item) => item.taskId === "d69b6c5aad5f47babe23a2bccb24a696");
            }

            if(reportPoint <= 0 && task.doValue === '10'){
                return;
            } else if(reportPoint <= 0 && task.doValue !== '10'){
                reportPoint = 10 - task.doValue;
            }
            let params;
            if (this.libId) {
                params = {
                    functionData: {
                        userId: this.uuid, //用户id，需要透传
                        taskId: taskId, //任务 id，需要透传
                        uniqueId: uniqueId, //新增积分唯一性id，需要透传
                        taskSubject: this.libId,
                    },
                    topic: "INTEGRAL", // 无需修改 ，
                    userUuid: this.uuid, //用户id //需要透传
                };
            } else {
                params = {
                    functionData: {
                        userId: this.uuid, //用户id，需要透传
                        taskId: taskId, //任务 id，需要透传
                        uniqueId: uniqueId, //新增积分唯一性id，需要透传
                    },
                    topic: "INTEGRAL", // 无需修改 ，
                    userUuid: this.uuid, //用户id //需要透传
                };
            }

            console.log("积分积分", JSON.stringify(params), reportPoint);

            for (let i = 0; i < reportPoint; i++) {
                params.functionData.uniqueId = params.functionData.uniqueId + i;
                await integrateAdd(params);
            }
        }
    },
};
</script>

<style lang="less" scoped>
.answerMain {
    background: #f5f5f5;
    height: 100vh;
    .head {
        padding: 0 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        background: #ffffff;
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        .btn {
            height: 0.6rem;
            line-height: 0.6rem;
            width: 1.4rem;
            background: rgba(191, 31, 34, 1);
            text-align: center;
            color: #ffffff;
            border-radius: 4px;
            font-size: 0.24px;
        }
    }

    .mainShow {
        .bg {
            height: 2rem;
            background: #ffffff;
            background-image: url(../../assets/img/bg.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .mainPan {
            margin-top: -1.2rem;
            margin-left: 0.4rem;
            margin-right: 0.4rem;
            background: #ffffff;
            box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                0px 1px 10px -5px rgba(0, 0, 0, 0.1);
            .top {
                height: 2.6rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.6rem;
                .text {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .title {
                        font-size: 0.28rem;
                    }
                    .num {
                        font-size: 0.7rem;
                    }
                }
                .img {
                    height: 2rem;
                    width: 2rem;
                    background-image: url(../../assets/img/gold.png);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }
            }
            .bottom {
                padding: 0.6rem;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.6);
                font-size: 0.28rem;

                .textItem {
                    display: flex;
                    margin-bottom: 0.3rem;
                    .left {
                        width: 40%;
                    }
                    .right {
                        margin-left: 1rem;
                    }
                }
                .btns {
                    margin-top: 0.7rem;
                    display: flex;
                    justify-content: space-between;
                    .btn {
                        width: 2.66rem;
                        height: 0.8rem;
                        line-height: 0.8rem;
                        text-align: center;
                        border-radius: 4px;
                        border: 1px solid #bf1f22;
                    }
                    .main {
                        background: #bf1f22;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
