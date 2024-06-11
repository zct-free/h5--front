<template>
    <div
        class="answerMain"
        v-if="status && !loading"
        v-finger:swipe="swipeHandler"
    >
        <div class="head">
            <div class="back" @click="back">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="txt item">有问必答</div>
            <div class="btn item" @click="openExplain()">答题说明</div>
        </div>
        <div class="wrapper">
            <div class="mainShow">
                <div class="bg"></div>
                <div class="mainPan">
                    <div
                        v-for="(i, index) in cards"
                        :key="index"
                        class="mainItem"
                    >
                        <div class="title" v-html="i.title"></div>
                        <!-- <div class="time">{{ i.time }}</div> -->
                        <div class="inWarpper">
                            <div class="left">
                                <div v-if="i.isFirst">还未答题</div>
                                <!-- <div v-else-if="!i.isFirst && !i.upperLimit">还有一次答题机会</div> -->
                                <div v-else-if="i.upperLimit">{{i.points}}分，积分：+10</div>
                            </div>
                            <div class="right">
                                <div
                                    class="leftOne"
                                    v-if="i.upperLimit"
                                    @click="lookMain(i)"
                                >
                                    查看解析
                                </div>
                                <div v-else class="leftTow" @click="gotoMain(i)">
                                    {{ i.answerStatus | getStaus }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="nocan" v-else-if="status && loading">
        <div class="head">
            <div class="back" @click="reback">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="rebtn"></div>
        </div>
        <div class="main">加载中...</div>
    </div>
    <div class="nocan" v-else>
        <div class="head">
            <div class="back" @click="reback">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="rebtn"></div>
        </div>
        <div class="main">暂未开通，期待上线…….</div>
    </div>
</template>

<script>
import {
    questionGroupList,
    getDetailMes,
} from "../../../serve/api/answer.js";
import VConsole from "vconsole";
import { Toast, Dialog  } from "vant";
export default {
    data() {
        return {
            cards: [],
            questions: [
                {
                    id: "111",
                    name: "选择题1", //题目
                    type: 3, //题型 1-选择 2-多选 3-判断
                    options: [],
                },
            ],
            nowIdnex: 0, //当前序号
            finshedIndex: 0, //完成的题目
            watchIng: false, //翻页查看中
            showFlag: false, //提示
            errTip: false, //错误
            doing: true, //正在进行中
            myAnswers: [], //我的答案
            rightAnswer: "", //正确答案

            results: [], //判题结果
            errNUm: 0, //错误数
            startTime: null, //开始时间
            endTime: null, //结束时间

            status: true, //启用
            ruleId: "",
            isAnalysis: true, //解析

            show: true,

            preScore: "",
            limitTime: "",

            loading: false,


            upperLimit:null,
            isFirst:null,
            ruleType:null,
        };
    },
    async created() {
        this.loading = true;
        this.startTime = new Date().getTime();

        this.ruleId = this.$route.query.ruleId;

        const re = await questionGroupList({
            questionRuleId: this.ruleId,
            uuid: this.$route.query.uuid,
        });

        if (re.data.code == 1000) {
            this.cards = re.data.data;
        }

        //获取配置参数
        const detailMes = await getDetailMes({
            questionRuleId: this.ruleId,
        });

        if (detailMes.data.code == 1000) {
            this.status = detailMes.data.data.status == 0 ? false : true;
            this.isAnalysis = detailMes.data.data.isAnalysis;
            this.limitTime = detailMes.data.data.limitTime;
            this.preScore = detailMes.data.data.preScore;

        }
        this.loading = false;
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
    },
    filters: {
        getStaus(answerStatus) {
            let strArr = ['开始答题', '继续答题', '重新答题', '已满分'];
            return strArr[answerStatus];
        },
    },
    computed: {
        typeClass() {
            return function (item) {
                return item.type;
            };
        },
    },
    methods: {
        //查看解析
        lookMain(item) {
            this.$router.push({
                path: "/answer/specialMain",
                query: {
                    uuid: this.$route.query.uuid,
                    ruleId: this.ruleId,
                    questionGroupId: item.id,
                    lookMode: true,
                    route: '/answer/month',
                    answerStatus: 2
                },
            });
        },
        //主页
        gotoMain(item) {
            console.log(item.upperLimit,123456);
            //满分
            if (item.upperLimit) {
                Toast.fail(`您已完成本月考试，成绩为${item.points}分，请在查看解析查看试卷详情`);
                return;
            }
            this.$router.push({
                path: "/answer/specialMain",
                query: {
                    uuid: this.$route.query.uuid,
                    ruleId: this.ruleId,
                    questionGroupId: item.id,
                    lookMode: false,
                    route: '/answer/month'
                },
            });
        },
        //滑动
        swipeHandler(evt) {
            if (evt.direction == "Right") {
                if (this.nowIdnex !== 0) {
                    this.pre();
                }
            }
        },
        back() {
            this.$router.push({
                path: "/answer/entry",
                query: { uuid: this.$route.query.uuid },
            });
            // Dialog.confirm({
            //     message: "确定要退出答题，退出后作答历史将不会保存",
            // })

            //     .then(() => {
            //         console;
            //         this.$router.push({
            //             path: "/answer/entry",
            //             query: { uuid: this.$route.query.uuid },
            //         });
            //         // on confirm
            //     })
            //     .catch(() => {
            //         // on cancel
            //     });
        },
        reback() {
            this.$router.push({
                path: "/answer/entry",
                query: { uuid: this.$route.query.uuid },
            });
        },
        openExplain() {
            const message = `<div>
            <p>1. 每月进行专项答题，答题时间为<span style="font-weight: 500;"> 10 </span>分钟。</p>
            <p>2. 每次答题共<span style="font-weight: 500;"> 10 </span>道，每道题目<span style="font-weight: 500;"> 10 </span>分，满分为<span style="font-weight: 500;"> 100 </span>分。</p>
            <p>3. 答对1题积1分，答错不扣分，每月上限10分。</p>
            </div>`
            //  <p>2. 每次答题有<span style="font-weight: 500;"> 2 </span>次机会，取最高分为最终成绩。</p>
            Dialog.confirm({
                title: '答题说明',
                message,
                showCancelButton: false
            })
        }
    },		
};
</script>

<style lang="less" scoped>
.answerMain {
    background: #f5f5f5;
    height: 100vh;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        background: #ffffff;

        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90;
        .txt {
            margin-right: -30px;
        }
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        .btnWapper {
            width: 3rem;
            display: flex;
            justify-content: space-between;
            .btn {
                height: 0.6rem;
                line-height: 0.6rem;
                width: 1.4rem;
                background: #bf1f22;
                text-align: center;
                color: #ffffff;
                border-radius: 4px;
                font-size: 0.24rem;
            }
        }
    }
    .wrapper {
        padding-top: 1.12rem;
        overflow: scroll;
        .mainShow {
            .bg {
                height: 2rem;
                background: #ffffff;
                background-image: url(../../assets/img/bg.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .mainPan {
                // overflow: scroll;
                height: calc(100vh - 2.3rem);
                margin-top: -1.2rem;
                margin-left: 0.2rem;
                margin-right: 0.2rem;

                

                .mainItem {
                    // height: 2.76rem;
                    background: #ffffff;
                    padding: 0.3rem;
                    margin-bottom: 0.32rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                    0px 1px 10px -5px rgba(0, 0, 0, 0.1);
                    .title {
                        font-weight: 600;
                        font-size: 0.32rem;
                        line-height: 0.5rem;
                    }
                    .time {
                        line-height: 0.74rem;
                        height: 0.74rem;
                        font-size: 0.24rem;
                    }
                    .inWarpper {
                        display: flex;
                        justify-content: space-between;

                        align-items: center;
                        .right {
                            display: flex;
                            align-items: center;
                            height: 1rem;
                            justify-content: space-around;

                            .leftOne {
                                font-weight: 600;
                                font-size: 0.24rem;
                            }
                            .leftTow {
                                width: 1.4rem;
                                height: 0.6rem;
                                line-height: 0.6rem;
                                background: #bf1f22;
                                border-radius: 2px;
                                color: #fff;
                                font-size: 0.24rem;
                                text-align: center;
                                margin-left: 0.3rem;
                            }
                        }
                        .left {
                            color: #a4a4a4;
                            font-size: 0.24rem;
                            margin-bottom: 0.1rem;
                        }
                    }
                }

                .titleWrapper {
                    height: 1.2rem;
                    line-height: 1.2rem;
                    border-bottom: 1px solid #d8d8d8;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.4rem;
                    .type {
                        border-left: 0.08rem solid rgba(253, 137, 44, 1);
                        padding-left: 0.1rem;
                        height: 0.56rem;
                        line-height: 0.56rem;
                        font-weight: 600;
                        font-size: 0.4rem;
                        color: #332929;
                    }
                    .index {
                        font-weight: 600;
                        color: #868686;
                        font-size: 0.32rem;
                        .span {
                            font-size: 0.7rem;
                            font-weight: 600;
                            color: #332929;
                        }
                    }
                }
                .issues {
                    padding: 0.4rem;
                    .description {
                        font-size: 0.32rem;
                        font-weight: 400;
                        color: #332929;
                        line-height: 0.5rem;
                        margin-bottom: 0.4rem;
                    }
                    .optionItem {
                        display: flex;
                        align-items: center;

                        padding: 0.2rem 0.4rem;
                        min-height: 1rem;
                        // line-height: 1rem;
                        border: 1px solid #e8e4e5;
                        background: #f7f7f7;
                        border-radius: 4px;
                        margin: 0.2rem 0;
                        overflow: auto;
                        position: relative;
                    }

                    .selected {
                        background: rgba(255, 238, 239, 1);
                        border: 1px solid #bf1f22;
                    }
                    .err {
                        background: #ffe3e4;
                        color: #d21f22;
                        font-weight: 800;
                    }
                    .right {
                        background: rgba(231, 248, 242, 1);
                        font-weight: 800;
                        color: #15bc83;
                    }
                    .index {
                        height: 0.4rem;
                        justify-content: center;
                        width: 0.4rem;
                        display: flex;
                        align-items: center;
                        margin-right: 0.3rem;
                    }
                    .befor {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 0.4rem;
                        line-height: 0.4rem;
                        width: 0.4rem;
                        margin-right: 0.3rem;
                    }
                    .point {
                        height: 0.4rem;
                        width: 0.4rem;
                        border: 1px solid #e8e4e5;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .pointselected {
                        height: 0.4rem;
                        width: 0.4rem;
                        border: 1px solid #bf1f22;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .otherWapper {
                    margin: 0 0.4rem;

                    .other {
                        height: 0.5rem;
                        background: rgba(21, 188, 131, 0.1);
                        border-radius: 2px;
                        color: rgba(21, 188, 131, 1);
                        display: inline-block;
                        margin: 0.1rem;
                        line-height: 0.5rem;
                        padding: 0 0.1rem;
                        box-sizing: content-box;
                    }
                    .tip {
                        box-sizing: border-box;
                        display: flex;
                        justify-content: flex-end;
                        color: rgba(210, 31, 34, 1);
                        font-weight: 400;

                        font-size: 0.24rem;

                        height: 0.8rem;
                        align-items: center;
                        .font {
                            font-size: 0.24rem;
                            margin-left: 0.1rem;
                        }
                    }
                }
            }
        }
    }
}
.nocan {
    // text-align: center;
    // height: 100vh;
    // line-height: 100vh;
    background: #f5f5f5;
    height: 100vh;
    .head {
        padding: 0 0.5rem 0 0.38rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        background: #ffffff;

        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90;
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }

        .btn {
            height: 0.6rem;
            line-height: 0.6rem;
            width: 1.4rem;
            background: #bf1f22;
            text-align: center;
            color: #ffffff;
            border-radius: 4px;
            font-size: 0.24rem;
        }
    }
    .main {
        text-align: center;
        height: 100vh;
        line-height: 100vh;
    }
}
</style>
<style lang="less">
.van-dialog .van-dialog__message {
    font-size: 0.3rem;
    line-height: 0.4rem;
    white-space: normal;
	text-align: justify;
}
</style>