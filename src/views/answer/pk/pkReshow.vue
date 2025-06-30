<template>
    <div class="answerMain" v-finger:swipe="swipeHandler">
        <div v-if="mainShow">
            <div class="head">
                <div class="back item" @click="reback">
                    <van-icon name="arrow-left" size="20" />
                </div>
                <div class="txt item">赛事回顾</div>

                <div class="record item" @click="openRule">竞赛规则</div>
            </div>
            <!-- <div class="mainWrapper"> -->
            <div v-if="show">
                <div
                    class="wrapper"
                    
                    v-for="(qitem, index) in questions"
                    :key="index"
                >
                    <div class="mainShow">
                        <div class="mainPan">
                            <div class="titleWrapper">
                                <div class="index">
                                    <span class="bold">{{ index + 1 }}</span
                                    ><span>/</span
                                    ><span>{{ questions.length }}</span>
                                </div>
                            </div>

                            <div class="issues">
                                <div class="description">
                                    {{ qitem.name }}
                                </div>
                                <div
                                    v-for="(item, index) in qitem.options"
                                    :key="index"
                                    class="optionItem"
                                    @click="select(index, qitem)"
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
                                            item.type === '' && qitem.type == 3
                                        "
                                    >
                                        <div class="point"></div>
                                    </span>
                                    <span
                                        class="befor"
                                        v-else-if="
                                            item.type === 'selected' &&
                                            qitem.type == 3
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
                                <div class="tip" v-show="qitem.showRrr">
                                    <van-icon name="eye" />
                                    <span class="font" @click="showTip(index)"
                                        >回答错误，查看解析</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="noansw">您未做答</div>
            <!-- </div> -->
            <van-action-sheet v-model="showFlag" title="解析">
                <div
                    class="content"
                    v-html="questions[showFlagIndex].analysis"
                ></div>
            </van-action-sheet>
        </div>
        <van-popup v-model="ruleShow" :round="true">
            <div class="rlueBox">
                <div class="rluehead">
                    <span>竞赛规则</span>
                    <span class="close" @click="closeRule">X</span>
                </div>
                <div class="rlueOne">
                    <div>竞赛规则：</div>
                    <div>1.点击开始比赛，随机匹配用户一名用户参与比赛。</div>
                    <div>
                        2.每题答对+20分，答错不减分，优先获得100分即为胜利。
                    </div>
                    <div>
                        3.每局用户比赛结束，方可生成答题记录，中途退出提前结束的用户可以在比赛结束后查看答题记录。
                    </div>
                    <div>
                        <!-- 4.每赢一局积5分，每日上限10分。 -->
                        4.每日首局获胜获得2分积分，失败积一分，仅限首局有积分。
                    </div>
                </div>
                <div class="rlueTow">
                    <div>温馨提示：</div>
                    <div>
                        用户成功匹配队友即进入答题流程，手机故障、网络不佳等异常情况影响比赛得分和积分，建议检查手机设备并在良好的网络环境下参与答题。
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import {
    questionAdd,
    GroupQuestionList,
    getAnswerHistory,
    getListById,
    getDetailMes,
} from "../../../../serve/api/answer.js";
import VConsole from "vconsole";
import { Dialog } from "vant";
import _ from "lodash";

export default {
    data() {
        return {
            questions: [
                {
                    id: "",
                    name: "", //题目
                    type: 3, //题型 1-选择 2-多选 3-判断
                    options: [],
                },
            ],
            nowIdnex: 0, //当前序号

            showFlag: false, //提示
            errTip: false, //错误
            doing: true, //正在进行中
            myAnswers: [], //我的答案
            rightAnswer: "", //正确答案

            results: [], //判题结果
            errNUm: 0, //错误数
            rightNUm: 0, //正确数
            startTime: null, //开始时间
            endTime: null, //结束时间

            status: true, //启用
            ruleId: "",
            isAnalysis: true, //解析
            answerStatus: 0, //0未作答  1 继续答题 2重新答题  3 已满分
            show: true, //显示题目框 动画使用

            preScore: "", //分数
            limitTime: "", //时间
            lookMode: false, //观察

            needShow: false, //需要返显

            showTime: "", //倒计时显示
            _time: 100, //倒计时
            timer: null,

            mainShow: true, //end展示
            endConfig: {}, //end配置

            reAnaswer: false, //再来一次

            loading: false, //加载中

            libId: null,

            showFlagIndex: 0,
            ruleShow: false,
        };
    },
    created() {
        this.init();
        if(window.nativeHandler){
            window.sysBack = this.sysBack
            window.nativeHandler.execute('interceptSysBack', 'true', null);
        }
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
        this.clientSync.addStatistic(
            'clickStatistic',
            `{
                'id': 'view-analysis', 
                'tag': 'pk_two'}
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
        sysBack(){
            this.reback()
        },
        openRule() {
            this.ruleShow = true;
        },
        closeRule() {
            this.ruleShow = false;
        },
        //解析
        lookMain() {
            this.mainShow = true;
            this.init();
            this.lookMode = true;
            this.needShow = true;
            this.reAnaswer = false;
        },
        reMain() {
            this.mainShow = true;
            this.errTip = false;
            this.nowIdnex = 0;

            this.myAnswers = [];
            this.results = [];
            this.errNUm = 0;
            this.rightNUm = 0;
            this.doing = true;
            this.reAnaswer = true;
            this.init();
        },
        async init() {
            this.loading = true;
            this.startTime = new Date().getTime();

            this.ruleId = this.$route.query.ruleId;

            this.questionGroupId = this.$route.query.questionGroupId;

            this.lookMode = true;

            //获取题目
            const re = await GroupQuestionList({
                questionGroupId: this.questionGroupId,
            });
            if (re.data.code == 1000) {
                re.data.data.list.forEach((i) => {
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

                this.questions = re.data.data.list;
            }
            //获取配置
            // const detailMes = await getDetailMes({
            //     questionRuleId: this.ruleId,
            //     questionGroupId: this.questionGroupId,
            //     uuid: this.$route.query.uuid,
            // });
            // if (detailMes.data.code == 1000) {
            //     this.isAnalysis = detailMes.data.data.isAnalysis;
            //     this.limitTime = detailMes.data.data.limitTime;
            //     this.answerStatus = detailMes.data.data.answerStatus;
            //     this.preScore = detailMes.data.data.preScore;
            //     this.libId = detailMes.data.data.libId;
            // }

            this.needShow = true;

            this.gethistoryRes();
            // } else {
            //     this.loading = false;
            // }
        },
        starTime(time) {
            this._time = time * 60;

            this.timer = setInterval(() => {
                if (this._time == 0) {
                    window.clearInterval(this.timer);
                    this.submit(null, undefined, true);
                    // this.finsh();
                    return;
                }
                // this._time = this._time - 5;
                this.showTime = this.formateTime(this._time);
            }, 1000);
        },
        formateTime(time) {
            const h = parseInt(time / 3600);
            const minute = parseInt((time / 60) % 60);
            const second = Math.ceil(time % 60);

            const hours = h < 10 ? "0" + h : h;
            const formatSecond = second > 59 ? 59 : second;
            return `${hours > 0 ? `${hours}:` : ""}${
                minute < 10 ? "0" + minute : minute
            }:${formatSecond < 10 ? "0" + formatSecond : formatSecond}`;
        },

        //获取结果值
        async gethistoryRes() {
            const historyRes = await getAnswerHistory({
                uuid: this.$route.query.uuid,
                ruleType: "pkRestore",
            });
            console.log("historyRes", historyRes);
            if (historyRes.data.code == 1000) {
                const res = historyRes.data.data;

                this.nowIdnex = 0;
                let folgNo = res.currentQuestionNo;
                this.nowIdnex = 0;

                console.log("获取结果值", res.results);
                if (res.results.length == 0) {
                    this.show = false
                    return
                }
                
                //已完成,重新答题
                // if (this.needShow) {
                //     folgNo = res.currentQuestionNo;
                //     this.nowIdnex = 0;

                //     if (this.lookMode) {
                //         this.errTip = true;
                //     } else {
                //         this.errTip = false;
                //     }

                //     if (this.answerStatus == 1) {
                //         folgNo = res.currentQuestionNo - 1;
                //         this.nowIdnex = res.currentQuestionNo;
                //     }
                //     if (this.lookMode) {
                //         folgNo = res.currentQuestionNo;
                //         this.nowIdnex = 0;
                //     }
                // }

                this.results = res.results;

                let ids = this.results.map((item) => {
                    return item.id;
                });

                await this.listById(ids);

                if (this.lookMode) {
                    console.log("herere", folgNo);
                    for (let i = folgNo; i > -1; i--) {
                        let { options } = this.questions[i];
                        this.questions[i].finshed = true;

                        let { difference, intersection, myAnswers } =
                            res.results[i].answer;

                        //继续答题

                        if (!difference) {
                            //正确选项
                            difference = options
                                .map((item, index) => {
                                    if (item.isAnswer) {
                                        return index;
                                    } else {
                                        return null;
                                    }
                                })
                                .filter((item) => item !== null);

                            intersection = [];
                        }

                        difference.forEach((item) => {
                            options[item].type = "right";
                        });

                        //判断正确
                        const isRight = _.isEqual(
                            difference.sort(),
                            intersection.sort()
                        );
                        if (!isRight) {
                            console.log("错误", this.questions[i]);
                            this.questions[i].showRrr = true;
                            intersection.forEach((item) => {
                                options[item].type = "err";
                            });
                        }
                    }
                    this.getright();
                }
            }
        },
        //获取之前题目
        async listById(ids) {
            const re = await getListById(ids);

            if (re.data.code == 1000) {
                console.log("re.data.data", re.data.data.length);
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
                this.loading = false;
            }
        },
        //滑动
        swipeHandler(evt) {
            if (evt.direction == "Right") {
                this.$router.push({
                    path: "/answer/pk/pkentry",
                    query: {
                        uuid: this.$route.query.uuid,
                    },
                });
            } 
        },
        back() {
            if ((this.answerStatus == 3 || this.lookMode) && !this.reAnaswer) {
                this.$router.push({
                    path: "/answer/special",
                    query: {
                        uuid: this.$route.query.uuid,
                        ruleId: this.ruleId,
                    },
                });
                window.clearInterval(this.timer);
                return;
            }

            Dialog.confirm({
                message: "确定要退出答题",
            })

                .then(async () => {
                    //返回退出
                    let currentQuestionNo = this.questions.findIndex(
                        (question) => {
                            return question.finshed == false;
                        }
                    );

                    this.results = this.results.slice(0, currentQuestionNo);

                    for (
                        let i = currentQuestionNo;
                        i < this.questions.length;
                        i++
                    ) {
                        const { id, type } = this.questions[i];
                        this.results.push({
                            id,
                            type,
                            answer: {},
                            result: true,
                        });
                    }

                    this.endTime = new Date().getTime();
                    let pramser = {
                        uuid: this.$route.query.uuid,
                        ruleId: this.ruleId,
                        questionGroupId: this.questionGroupId,
                        questionNum: this.questions.length,
                        correctNum: Number(this.rightNUm), //答对数量
                        spendTime: parseInt(
                            (this.endTime - this.startTime) / 1000
                        ),
                        isFinished: false,
                        currentQuestionNo,

                        results: this.results,
                    };

                    const res = await questionAdd(pramser);

                    if (res.data.code == 1000) {
                        this.$router.push({
                            path: "/answer/special",
                            query: {
                                uuid: this.$route.query.uuid,
                                ruleId: this.ruleId,
                            },
                        });
                    }
                    window.clearInterval(this.timer);
                })
                .catch((err) => {
                    console.log(err);
                    // on cancel
                });
        },
        reback() {
            this.$router.push({
                path: "/answer/pk/pkentry",
                query: { uuid: this.$route.query.uuid },
            });
        },
        showTip(index) {
            this.showFlagIndex = index;
            this.showFlag = true;
        },
        pre() {
            this.show = false;
            let timer = setTimeout(() => {
                this.nowIdnex--;
                this.doing = false;
                this.show = true;
                this.getright();
            }, 500);
            timer = null;
        },
        async next(e, f) {
            if (!this.show) {
                return;
            }
            //完成
            if (this.nowIdnex + 1 === this.questions.length) {
                window.clearInterval(this.timer);
                if (this.answerStatus == 3 || this.lookMode) {
                    this.$router.push({
                        path: "/answer/special",
                        query: {
                            uuid: this.$route.query.uuid,
                            ruleId: this.ruleId,
                        },
                    });
                    return;
                }
                this.endTime = new Date().getTime();
                this.finsh();
            } else {
                this.show = false;
                let timer = setTimeout(() => {
                    console.log("lookModelookMode", this.lookMode);
                    if (!this.lookMode) {
                        //非观察模式,可修改提交
                        if (f == undefined) {
                            this.submit({}, true);
                        }
                    }
                    this.myAnswers = [];
                    this.nowIdnex++;
                    this.doing = true;
                    this.show = true;
                    this.getright();
                }, 300);
                timer = null;
            }
        },
        //完成
        async finsh(falg) {
            let currentQuestionNo = this.questions.findIndex((question) => {
                return question.finshed == false;
            });
            console.log("falg", currentQuestionNo, falg);

            console.log("之前", this.results);

            if (currentQuestionNo !== -1) {
                this.results = this.results.slice(0, currentQuestionNo);
                for (
                    let i = currentQuestionNo;
                    i < this.questions.length;
                    i++
                ) {
                    const { id, type } = this.questions[i];

                    this.results.push({
                        id,
                        type,
                        answer: {},
                        result: true,
                    });
                }
            }

            let n = this.nowIdnex;

            //未答题

            if (currentQuestionNo == 0 && this.nowIdnex == 0) {
                console.log("//未答题");
                n = this.questions.length - 1;
            }
            //倒计时提交
            if (falg) {
                console.log("倒计时提交");
                n = this.questions.length - 1;
            }

            this.endTime = new Date().getTime();

            let uuid = this.$route.query.uuid;

            let pramser = {
                uuid,
                ruleId: this.ruleId,
                questionGroupId: this.questionGroupId,
                questionNum: this.questions.length,
                correctNum: Number(this.rightNUm), //答对数量
                spendTime: parseInt((this.endTime - this.startTime) / 1000),
                isFinished: true,
                currentQuestionNo: n,

                results: this.results,
            };

            console.log("pramser", pramser);

            const res = await questionAdd(pramser);

            if (res.data.code == 1000) {
                const { point, upperLimit, isFirst } = res.data.data;

                this.mainShow = false;

                this.errNUm = this.questions.length - this.rightNUm;
                this.endConfig = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    errNUm: this.errNUm,
                    questionsNums: this.questions.length,
                    questionGroupId: this.questionGroupId,
                    point,
                    upperLimit,
                    isFirst,
                    uuid,
                    libId: this.libId,
                    correctNum: Number(this.rightNUm),
                    answerStatus: this.answerStatus,
                    ruleId: this.ruleId,
                    isAnalysis: this.isAnalysis,
                    preScore: this.preScore,
                    to: "special",
                };
            }
        },
        //返现选项
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
        submit(e, nextflag, callback) {
            const question = this.questions[this.nowIdnex];
            var { options, type, id, finshed } = question;
            console.log("倒计时2", finshed, nextflag, callback);
            if (finshed && !nextflag && !callback) {
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

            question.finshed = true;

            //判断题处理
            if (type == 3) {
                let item = rightAnswers[0];
                this.rightAnswer = options[item].optionContent;
            } else {
                this.rightAnswer = list.join(" ");
            }

            const difference = rightAnswers;
            const intersection = this.myAnswers;

            let answer = {
                difference,
                intersection,
                myAnswers: this.myAnswers,
            };
            this.results = this.results.slice(0, this.nowIdnex);

            //错误处理
            let result = false;

            if (isRight) {
                result = true;
            } else {
                result = false;
            }
            //第一次提交
            if (nextflag == undefined) {
                // console.log("第一次提交");
                this.show = false;
                let iti = setTimeout(() => {
                    this.results.push({
                        id,
                        type,
                        answer,
                        result,
                    });
                    this.show = true;
                    if (isRight) {
                        this.rightNUm++;
                    }

                    if (callback) {
                        this.finsh(true);
                    } else {
                        this.next({}, true);
                    }
                }, 500);

                iti = null;
            } else {
                console.log("修改修改修改");
                this.results.push({
                    id,
                    type,
                    answer,
                    result,
                });
                this.next({}, undefined);

                this.rightNUm--;
                if (isRight) {
                    this.rightNUm++;
                }
            }
        },
        select(index, question) {
            const { options, type } = question;
            //仅查看模式
            if (this.lookMode) return;
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
                    const flag = this.myAnswers.find(
                        (element) => element === index
                    );
                    this.myAnswers.splice(flag, 1);
                } else {
                    options[index].type = "selected";
                    this.myAnswers.push(index);
                }
            }
        },
    },
    destroyed() {
        window.clearInterval(this.timer);
    },
};
</script>

<style lang="less" scoped>
.answerMain {
    background: linear-gradient(315deg, #f559ff 0%, #3c00d9 100%);
    min-height: 100vh;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;

        color: #ffffff;
        // border: 1px solid red;
        // position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90;
        .item {
            width: 33.3%;
        }
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        .txt {
            margin-left: -20px;
            font-size: 0.32rem;
            font-weight: 600;
            color: #fff;
            text-align: center;
        }
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        .record {
            text-align: right;
        }
        .item {
            width: 33.3%;
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
    // .mainWrapper {
    //     padding-top: 1.12rem;
    .wrapper {
        padding-top: 1.12rem;
        margin: 0.5rem 0;
        .mainShow {
            position: relative;
            .bg {
                height: 2rem;
                background: #ffffff;
                background-image: url(../../../assets/img/bg.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .limitTime {
                position: absolute;
                height: 0.4rem;
                width: 3rem;
                top: 0.4rem;
                left: 0.4rem;
            }
            .mainPan {
                margin-top: -1.2rem;
                margin-left: 0.4rem;
                margin-right: 0.4rem;
                background: #ffffff;
                box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                    0px 1px 10px -5px rgba(0, 0, 0, 0.1);
                .titleWrapper {
                    height: 0.5rem;
                    line-height: 0.5rem;

                    text-align: center;
                    padding: 0 0.4rem;

                    .index {
                        font-weight: 600;
                        color: #868686;
                        font-size: 0.24rem;
                        .bold {
                            font-size: 0.24rem;
                            font-weight: 600;
                            color: #868686;
                        }
                    }
                }
                .issues {
                    padding: 0.4rem;
                    .description {
                        font-size: 0.32rem;

                        color: rgba(35, 51, 51, 1);
                        font-weight: 600;

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
                        overflow: auto;
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
    }
    .noansw {
        color: #fff;
        text-align: center;
    }
    // }

    .content {
        height: 60vh;
        border-top: 0.02rem solid rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #332929;
        line-height: 0.48rem;
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
    .rlueBox {
        height: 7rem;
        width: 5.12rem;
        border-radius: 16px;
        padding: 0 10px;
        line-height: 18px;
        .rluehead {
            color: rgba(35, 51, 51, 1);
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 1rem;
            border-bottom: 1px solid rgba(164, 164, 164, 1);
            .close {
                display: inline-block;
                width: 0.48rem;
                height: 0.48rem;
                font-size: 0.4rem;
            }
        }
        .rlueOne {
            color: rgba(35, 51, 51, 1);
            font-size: 0.24rem;
            margin: 10px 0;
        }
        .rlueTow {
            color: rgba(164, 164, 164, 1);
            font-size: 0.24rem;
        }
    }
}
</style>