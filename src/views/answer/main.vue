<template>
    <div class="answerMain" v-if="status && !loading" v-finger:swipe="swipeHandler">
        <div v-if="mainShow">
            <div class="head">
                <div class="back" @click="back">
                    <van-icon name="arrow-left" size="20" />
                </div>
                <div class="btnWapper">
                    <div class="btn" @click="pre" v-if="nowIdnex > 0">
                        上一题
                    </div>
                    <div @click="pre" v-else></div>
                    <div
                        class="btn"
                        @click="submit"
                        v-if="doing && !questions[nowIdnex].finshed"
                    >
                        {{
                            nowIdnex + 1 === questions.length ? "完成" : "确定"
                        }}
                    </div>
                    <div class="btn" @click="next" v-else>
                        {{
                            nowIdnex + 1 === questions.length
                                ? "完成"
                                : "下一题"
                        }}
                    </div>
                </div>
            </div>
            <transition name="slide-fade">
                <div class="wrapper" v-show="show">
                    <div class="mainShow">
                        <div class="bg"></div>
                        <div class="mainPan">
                            <div class="titleWrapper">
                                <div class="type">
                                    {{ questions[nowIdnex].type | getType }}
                                </div>
                                <div class="index">
                                    <span class="bold">{{ nowIdnex + 1 }}</span
                                    ><span>/</span
                                    ><span>{{ questions.length }}</span>
                                </div>
                            </div>

                            <div class="issues">
                                <div class="description">
                                    {{ questions[nowIdnex].name }}
                                </div>
                                <div
                                    v-for="(item, index) in questions[nowIdnex]
                                        .options"
                                    :key="index"
                                    class="optionItem"
                                    @click="select(index, questions[nowIdnex])"
                                    :class="typeClass(item)"
                                >
                                    <span
                                        class="befor"
                                        v-if="item.type === 'err'"
                                    >
                                        <van-icon
                                            name="clear"
                                            color="#bf1f22"
                                            size="0.4rem"
                                        />
                                    </span>
                                    <span
                                        class="befor"
                                        v-else-if="item.type === 'right'"
                                    >
                                        <van-icon
                                            name="checked"
                                            color="#15bc83"
                                            size="0.4rem"
                                        />
                                    </span>
                                    <span
                                        class="befor"
                                        v-else-if="
                                            item.type === '' &&
                                            questions[nowIdnex].type == 3
                                        "
                                    >
                                        <div class="point"></div>
                                    </span>
                                    <span
                                        class="befor"
                                        v-else-if="
                                            item.type === 'selected' &&
                                            questions[nowIdnex].type == 3
                                        "
                                    >
                                        <div class="pointselected"></div>
                                    </span>
                                    <span class="index" v-else>{{
                                        item.optionName
                                    }}</span>
                                    <span class="text">{{
                                        item.optionContent
                                    }}</span>
                                </div>
                            </div>
                            <div class="otherWapper">
                                <!-- <span class="other">推荐：陕西学习平台</span> -->
                                <!-- <span class="other">出题：中共延安市委理论讲师团</span> -->
                                <div class="tip" v-show="isAnalysis && questions[nowIdnex].analysis">
                                    <van-icon name="eye" />
                                    <span class="font" @click="showTip"
                                        >查看提示</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="parseBox" v-show="errTip">
                        <div class="parseMain">
                            <div class="titleWrapper">
                                <div class="type">答案解析</div>
                            </div>
                            <div class="parseContent">
                                <div class="right">
                                    正确答案: {{ rightAnswer }}
                                </div>
                                <div
                                    class="html"
                                    v-html="questions[nowIdnex].analysis"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <van-action-sheet v-model="showFlag" title="提示">
                        <div
                            class="content"
                            v-html="questions[nowIdnex].analysis"
                        ></div>
                    </van-action-sheet>
                </div>
            </transition>
        </div>
        <End v-else :confing="endConfig" type="DAILY" @reMain="reMain" />
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
    questionRuleGet,
    questionAdd,
    questionList,
    questionRuleList,
    getDetailMes,
} from "../../../serve/api/answer.js";
import VConsole from "vconsole";
import { Dialog, ImagePreview } from "vant";
import _ from "lodash";
import End from "./end.vue";
export default {
    data() {
        return {
            questions: [
                {
                    id: "111",
                    name: "选择题1", //题目
                    type: 3, //题型 1-选择 2-多选 3-判断
                    options: [
                        
                    ],
                },
            ],
            nowIdnex: 0, //当前序号
            finshedIndex: 0, //完成的题目

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
            mainShow: true,
            endConfig: {},

             loading:false
        };
    },
    components: {
        End,
    },
    created() {
        this.init();
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
        this.clientSync.addStatistic(
            'clickStatistic',
            `{
                'id': 'start-answer', 
                'tag': 'up_day'
            }`,
            null
        )
    },
    filters: {
        getType(type) {
            let name = "";
            if (type == 1) {
                name = "单选题";
            } else if (type == 3) {
                name = "判断题";
            } else if (type == 2) {
                name = "多选题";
            }
            return name;
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
        reMain() {
            this.mainShow = true;
            this.errTip = false;
            this.nowIdnex = 0;
            this.finshedIndex = 0;
            this.myAnswers = [];
            this.results = [];
            this.errNUm = 0;
            this.doing = true;
            this.init();
        },
        async init() {
            this.loading =true
            this.startTime = new Date().getTime();

            this.ruleId = this.$route.query.ruleId;

            const re = await questionList({
                questionRuleId: this.ruleId,
            });

            if (re.data.code == 1000) {
                re.data.data.forEach((i) => {
                    if (i.keyWord) {
                        //设置key
                        var regex = /,|，/;
                        let keys = i.keyWord.split(regex);

                        keys.forEach((key) => {
                            if (key.trim() == "") {
                                return;
                            }
                            var reg = new RegExp("" + key + "", "g");
                            var ne = `<span style="color:#d21f22">${key}</span>`;

                            i.analysis = i.analysis.replace(reg, ne);
                        });
                    }

                    i.finshed = false;

                    //设置type
                    if (i.options) {
                        i.options.forEach((k) => {
                            k.type = "";
                        });
                    }
                });

                this.questions = re.data.data;
            }
            //获取配置参数
            const detailMes = await getDetailMes({
                questionRuleId: this.ruleId,
            });
            console.log("detailMes", detailMes);
            if (detailMes.data.code == 1000) {
                this.status = detailMes.data.data.status == 0 ? false : true;
                this.isAnalysis = detailMes.data.data.isAnalysis;
                this.limitTime = detailMes.data.data.limitTime;
                this.preScore = detailMes.data.data.preScore;
            }

            this.loading =false
        },
        getright() {
            const question = this.questions[this.nowIdnex];
            const { options, type, id, finshed } = question;

            //正确选项
            const rightAnswers = options
                .map((item, index) => {
                    if (item.isAnswer) {
                        return index;
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== null);

            const list = rightAnswers.sort().map((item) => {
                return options[item].optionName;
            });

            //判断题处理
            if (type == 3) {
                let item = rightAnswers[0];
                this.rightAnswer = options[item].optionContent;
            } else {
                this.rightAnswer = list.join(" ");
            }
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
            Dialog.confirm({
                message: "确定要退出答题，退出后作答历史将不会保存",
            })

                .then(() => {
                    console;
                    this.$router.push({
                        path: "/answer/entry",
                        query: { uuid: this.$route.query.uuid },
                    });
                    // on confirm
                })
                .catch(() => {
                    // on cancel
                });
        },
        reback() {
            this.$router.push({
                path: "/answer/entry",
                query: { uuid: this.$route.query.uuid },
            });
        },
        showTip() {
            this.showFlag = true;
        },
        pre() {
            this.show = false;
            let timer = setTimeout(() => {
                this.nowIdnex--;
                this.doing = false;
                this.errTip = true;
                this.show = true;
                this.getright();
            }, 500);
            timer = null;
        },
        async next() {
            // this.show = false;
            // let timer = setTimeout(() => {
            //     this.show = true;
            // }, 500);
            // timer = null;

            if (this.nowIdnex + 1 === this.questions.length) {
                //完成
                this.endTime = new Date().getTime();

                let uuid = this.$route.query.uuid;

                let pramser = {
                    // uuid: uuid,
                    // ruleId: this.ruleId,
                    // questionNum: this.questions.length,
                    // correctNum: Number(this.questions.length - this.errNUm), //答对数量
                    // spendTime: parseInt((this.endTime - this.startTime) / 1000),
                    // results: this.results,

                    uuid: this.$route.query.uuid,
                    ruleId: this.ruleId,

                    questionNum: this.questions.length,
                    correctNum: Number(this.questions.length - this.errNUm), //答对数量
                    spendTime: parseInt((this.endTime - this.startTime) / 1000),
                    isFinished: true,
                    currentQuestionNo: this.nowIdnex,
                    results: this.results,
                };
                const res = await questionAdd(pramser);
                if (res.data.code == 1000) {
                    const { point,upperLimit } = res.data.data;
                    // console.log('添加后',res.data.data,isFirst)
                    this.mainShow = false;

                    this.endConfig = {
                        startTime: this.startTime,
                        endTime: this.endTime,
                        errNUm: this.errNUm,
                        questionsNums: this.questions.length,
                        point,
                        uuid,
                        upperLimit,
                        ruleId: this.ruleId,
                        isAnalysis: this.isAnalysis,
                        to: "main",
                        reportPoint: point
                    };
                    this.clientSync.addStatistic(
                        'clickStatistic',
                        `{
                            'id': 'end-answer', 
                            'tag': 'up_day'}
                        }`,
                        null
                    )
                }
            } else {
                this.myAnswers = [];
                this.nowIdnex++;
                this.doing = true;
                this.errTip = false;

                if (this.questions[this.nowIdnex].finshed) {
                    this.errTip = true;
                    this.getright();
                }
            }
        },
        submit() {
            const question = this.questions[this.nowIdnex];
            const { options, type, id, finshed } = question;

            if (finshed) {
                this.doing = false;
                return;
            }
            //判题
            this.doing = false;

            //正确选项
            const rightAnswers = options
                .map((item, index) => {
                    if (item.isAnswer) {
                        return index;
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== null);

            //判断正确
            const isRight = _.isEqual(
                rightAnswers.sort(),
                this.myAnswers.sort()
            );

            const list = rightAnswers.sort().map((item) => {
                return options[item].optionName;
            });

            //判断题处理
            if (type == 3) {
                let item = rightAnswers[0];
                this.rightAnswer = options[item].optionContent;
            } else {
                this.rightAnswer = list.join(" ");
            }

            const difference = _.difference(rightAnswers, this.myAnswers); //err
            const intersection = _.intersection(rightAnswers, this.myAnswers); //right

            rightAnswers.forEach((item) => {
                options[item].type = "right";
            });

            if (!isRight) {
                this.myAnswers.forEach((item) => {
                    options[item].type = "err";
                });
            }

            question.finshed = true;

            //错误处理
            if (!isRight) {
                // this.show = false;
                // let iti = setTimeout(() => {
                // console.log("错误");
                this.errTip = true;

                this.results.push({
                    id,
                    type,
                    result: false,
                });
                // this.show = true;
                this.errNUm++;
                // }, 500);
            } else {
                this.show = false;
                let iti = setTimeout(() => {
                    this.results.push({
                        id,
                        type,
                        result: true,
                    });
                    this.show = true;
                    this.next();
                }, 500);
            }
            // this.next()
        },
        select(index, question) {
            const { options, type, finshed } = question;
            if (!this.doing || finshed) return;
            if (type == 1) {
                //单选题
                if (options[index].type === "selected") {
                    options.forEach((item) => {
                        item.type = "";
                    });
                    this.myAnswers = [];
                } else {
                    options.forEach((item) => {
                        item.type = "";
                    });
                    this.myAnswers = [];
                    options[index].type = "selected";
                    this.myAnswers.push(index);
                }
            } else if (type == 3) {
                //判断题
                if (options[index].type === "selected") {
                    options.forEach((item) => {
                        item.type = "";
                    });
                    this.myAnswers = [];
                } else {
                    options.forEach((item) => {
                        item.type = "";
                    });
                    this.myAnswers = [];
                    options[index].type = "selected";
                    this.myAnswers.push(index);
                }
            } else if (type == 2) {
                //多选题
                if (options[index].type === "selected") {
                    options[index].type = "";
                    const flag = this.myAnswers.findIndex(
                        element => element === index
                    );
                    this.myAnswers.splice(flag, 1);
                } else {
                    options[index].type = "selected";
                    this.myAnswers.push(index);
                }
            }

            console.log(this.myAnswers);
        },
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
                margin-left: 0.2rem;
                margin-right: 0.2rem;
                background: #ffffff;
                box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                    0px 1px 10px -5px rgba(0, 0, 0, 0.1);
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
                        .bold {
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
        .parseBox {
            background: #f5f5f5;
            padding-bottom: 0.3rem;
            .parseMain {
                height: 300px;
                margin-top: 0.3rem;
                margin-left: 0.4rem;
                margin-right: 0.4rem;
                background: #ffffff;
                box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                    0px 1px 10px -5px rgba(0, 0, 0, 0.1);
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
                }
                .parseContent {
                    padding: 0.4rem;
                    .right {
                        font-weight: 600;
                        color: #332929;
                        line-height: 0.32rem;
                        font-size: 0.32rem;
                        margin-bottom: 0.2rem;
                    }
                    .html {
                        color: #707579;
                        line-height: 0.48rem;
                        font-size: 0.32rem;
                    }
                }
            }
        }

        .content {
            height: 60vh;
            border-top: 0.02rem solid rgba(0, 0, 0, 0.1);
            padding: 0.5rem;
            font-size: 0.32rem;
            font-weight: 400;
            color: #332929;
            line-height: 0.48rem;
        }
    }
    .slide-fade-enter-active {
        transition: all 0.2s ease;
    }
    .slide-fade-leave-active {
        transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
}
.nocan {
    // text-align: center;
    // height: 100vh;
    // line-height: 100vh;
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
