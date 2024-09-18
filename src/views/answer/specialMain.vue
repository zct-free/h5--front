<template>
    <div class="answerMain" v-if="!loading" v-finger:swipe="swipeHandler">
        <div v-if="mainShow">
            <div class="head">
                <div class="back" @click="back">
                    <van-icon name="arrow-left" size="20" />
                </div>
                <div class="btnWapper">
                    <div v-if="nextShow">
                        <div
                            class="btn"
                            @click="submit"
                            v-if="doing && !questions[nowIdnex].finshed"
                        >
                            {{ nowIdnex + 1 === questions.length ? "完成" : "确定" }}
                        </div>
                        <div class="btn" @click="next" v-else>
                            {{ nowIdnex + 1 === questions.length
                                ? "完成"
                                : "下一题"
                            }}
                        </div>
                    </div>
                    <div class="btn" @click="pre" v-if="nowIdnex > 0">
                        上一题
                    </div>
                    <div @click="pre" v-else></div>
                </div>
            </div>
            <transition name="slide-fade">
                <div class="wrapper" v-show="show">
                    <div class="mainShow">
                        <div class="bg"></div>
                        <!-- {{ myAnswers }} -->
                        <!-- {{ results.length}} -->
                        <!-- {{ nowIdnex }} -->
                        <!-- {{ questions[nowIdnex].finshed }} -->
                        <!-- {{ results[nowIdnex] }} -->
                        <!-- {{rightNUm}} -->
                        <div class="limitTime" :class="last?'count-down':''" v-show="!lookMode">
                            剩余时间：{{ showTime }}
                        </div>
                        <div class="mainPan">
                            <div class="titleWrapper">
                                <div class="type">
                                    {{ questions[nowIdnex].type | getType }} ({{
                                       getScore
                                    }}分)
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
                                <div class="tip" v-show="isAnalysis  && questions[nowIdnex].analysis">
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
        <End
            v-else
            :confing="endConfig"
            @reMain="reMain"
            @lookMain="lookMain"
            :type="answerType === '/answer/special' ? 'special' : 'month'"
        />
    </div>
    <div class="nocan" v-else>
        <div class="head">
            <div class="back" @click="reback">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="rebtn"></div>
        </div>
        <div class="main">加载中...</div>
    </div>
</template>

<script>
import {
    questionAdd,
    GroupQuestionList,
    getAnswerHistory,
    getListById,
    getDetailMes,
} from "../../../serve/api/answer.js";
// import VConsole from "vconsole";
import { Dialog } from "vant";
import _ from "lodash";
import End from "./end.vue";
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
            last: false,
            _time: 100, //倒计时
            timer: null,

            mainShow: true, //end展示
            endConfig: {}, //end配置

            reAnaswer: false, //再来一次

            loading: false, //加载中

            libId: null,
            answerType: '/answer/special',
            correct: [],
            // answerType: 'special'
        };
    },
    created() {
        this.init();
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            // let vConsole = new VConsole();
        }
        if(this.$route.query.lookMode == "true") {
            this.clientSync.addStatistic(
                'clickStatistic',
                `{
                    'id': 'view-analysis', 
                    'tag': ${this.$route.query.route === '/answer/month'? 'up_month':'up_special'}
                }`,
                null
            )
        }else {
            this.clientSync.addStatistic(
                'clickStatistic',
                `{
                    'id': 'start-answer', 
                    'tag': ${this.$route.query.route === '/answer/month'? 'up_month':'up_special'}
                }`,
                null
            )
        }
        
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
        }
    },
    components: {
        End,
    },
    computed: {
        typeClass() {
            return function (item) {
                return item.type;
            };
        },
        nextShow(){
            if(this.lookMode) return true;

            let { options } = this.questions[this.nowIdnex]
            return options.some(item => item.type === 'selected')
        },
        getScore() {
            let idArr = [ '630ec885f4598b73750518dc', '62e7841470cb1b5b71bd4a8c', '62bea5cad911fb0603fc5545', '62947d34d7a9ef4b20b1ab15' ]
            if(idArr.some(item => item === this.questionGroupId)) {
                return 5
            }
            return this.preScore;
        }
    },
    methods: {
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
            this.last = false
            this.correct = []
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
            this.answerType = this.$route.query.route
            this.questionGroupId = this.$route.query.questionGroupId;

            this.lookMode = this.$route.query.lookMode == "true" ? true : false;

            //获取题目
            const re = await GroupQuestionList({
                questionGroupId: this.questionGroupId,
            });
            if (re.data.code == 1000) {
                if(this.questionGroupId === '6337b59270cb1b5b71bd4a9f'){
                    re.data.data.list = re.data.data.list.slice(0, 10)
                }
                
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
            const detailMes = await getDetailMes({
                questionRuleId: this.ruleId,
                questionGroupId: this.questionGroupId,
                uuid: this.$route.query.uuid,
            });
            if (detailMes.data.code == 1000) {
                this.isAnalysis = detailMes.data.data.isAnalysis;
                this.limitTime = detailMes.data.data.limitTime;
                this.answerStatus = detailMes.data.data.answerStatus;
                this.preScore = detailMes.data.data.preScore;
                this.libId = detailMes.data.data.libId;
                // this.status = detailMes.data.data.status  == 0 ? false : true;
                if (!this.lookMode) {
                    this.starTime(this.limitTime);
                }
            }
            if(this.$route.query.answerStatus === '2'){
                this.answerStatus = 2
            }

            //判断需要解析模式
            if (
                this.answerStatus == 1 ||
                this.answerStatus == 2 ||
                this.answerStatus == 3
            ) {
                this.needShow = true;
            }

            if (this.needShow == true) {
                this.gethistoryRes();
            } else {
                this.loading = false;
            }
        },
        starTime(time) {
            this._time = time * 60;
            // this._time = this._time - 25;
            this.timer = setInterval(() => {
                if (this._time == 0) {
                    window.clearInterval(this.timer);
                    // console.log("倒计时1");
                    let currentQuestionNo = this.questions.findIndex(
                        question => question.finshed === false
                    );
                    if(this.nowIdnex < currentQuestionNo){
                        let aggregate = [];
                        let correct = [];
                        let { myAnswers } = this.results[this.nowIdnex].answer;
                        this.questions[this.nowIdnex].options.forEach((item, index) => {
                            if(item.type === 'selected'){
                                aggregate.push(index);
                            }
                            if(item.isAnswer){
                                correct.push(index);
                            }
                        });
                        // console.log(myAnswers, aggregate, 'aggregateaggregate');
                        if(!_.isEqual(myAnswers.sort(), aggregate)){
                            this.results[this.nowIdnex].answer.myAnswers = aggregate;
                            this.results[this.nowIdnex].answer.intersection = aggregate;
                            let identical = _.isEqual(aggregate, correct);
                            let qw = this.correct.some(item => item === this.nowIdnex);
                            console.log(identical, qw);
                            if(!identical && qw){
                                this.rightNUm--
                            } else if(identical && !qw){
                                this.rightNUm++
                            }
                        }
                        let last = [];
                        let lastIsAnswer = [];
                        this.questions[currentQuestionNo].finshed = true;
                        this.questions[currentQuestionNo].options.forEach((item, index) =>{
                            if(item.type === 'selected'){
                                last.push(index);
                            }
                            if(item.isAnswer){
                                lastIsAnswer.push(index);
                            }
                        });
                        let { id, type } = this.questions[currentQuestionNo];
                        const difference = lastIsAnswer;
                        const intersection = last;
                        let result = _.isEqual(last,lastIsAnswer);
                        this.results.push({
                            id,
                            type,
                            answer: {
                                difference,
                                intersection,
                                myAnswers: intersection
                            },
                            result
                        });
                        this.rightNUm = result ? this.rightNUm + 1 : this.rightNUm;
                        this.finsh(true);
                        return
                    }
                    this.submit(null, undefined, true);
                    return;
                }
                if(this._time <= 10){
                    this.last = true
                }
                this._time = this._time - 1;
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
                questionGroupId: this.questionGroupId,
            });

            if (historyRes.data.code == 1000) {
                const res = historyRes.data.data;

                this.nowIdnex = res.currentQuestionNo;
                let folgNo = res.currentQuestionNo - 1;

                //已完成,重新答题
                if (this.needShow) {
                    folgNo = res.currentQuestionNo;
                    this.nowIdnex = 0;

                    if (this.lookMode) {
                        this.errTip = true;
                    } else {
                        this.errTip = false;
                    }

                    if (this.answerStatus == 1) {
                        folgNo = res.currentQuestionNo - 1;
                        this.nowIdnex = res.currentQuestionNo;
                    }
                    if (this.lookMode) {
                        folgNo = res.currentQuestionNo;
                        this.nowIdnex = 0;
                    }
                }
                if(this.questionGroupId === '6337b59270cb1b5b71bd4a9f'){
                    folgNo = 9
                }
                this.results = res.results;

                let ids = this.results.map((item) => {
                    return item.id;
                });

                await this.listById(ids);

                if (this.lookMode || this.answerStatus == 1) {
                    // console.log("herere", folgNo);
                    for (let i = folgNo; i > -1; i--) {
                        // console.log(i, this.questions);
                        let { options } = this.questions[i];
                        this.questions[i].finshed = true;

                        let { difference, intersection, myAnswers } =
                            res.results[i].answer;

                        //继续答题
                        if (this.answerStatus == 1) {
                            myAnswers.forEach((item) => {
                                options[item].type = "selected";
                            });
                        } else {
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
                                intersection.forEach((item) => {
                                    options[item].type = "err";
                                });
                            }
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
                if(this.questionGroupId === '6337b59270cb1b5b71bd4a9f'){
                    re.data.data = re.data.data.slice(0, 10);
                }
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
                if (this.nowIdnex !== 0) {
                    this.pre();
                }
            }
        },
        back() {
            if ((this.answerStatus == 3 || this.lookMode) && !this.reAnaswer || this.answerType === '/answer/month') {
                this.$router.push({
                    path: this.answerType,
                    query: {
                        uuid: this.$route.query.uuid,
                        ruleId: this.ruleId,
                    },
                });
                window.clearInterval(this.timer);
                return;
            }
            Dialog.confirm({
                message: "考试尚未完成，是否确认退出？",
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
                            path: this.answerType,
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
                path: "/answer/entry",
                query: { uuid: this.$route.query.uuid },
            });
        },
        showTip() {
            this.showFlag = true;
            this.clientSync.addStatistic(
                'clickStatistic',
                `{
                    'id': 'view-tips', 
                    'tag': ${this.$route.query.route === '/answer/month'? 'up_month':'up_special'}
                }`,
                null
            )
        },
        pre() {
            this.show = false;
            let timer = setTimeout(() => {
                let selectArr = [];
                let zheng = [];
                this.questions[this.nowIdnex].options.forEach((item, index) => {
                    if(item.type === 'selected'){
                        selectArr.push(index);
                    }
                    if(item.isAnswer){
                        zheng.push(index);
                    }
                });
                let correct = this.correct.some(item => item === this.nowIdnex);
                if(!selectArr.length && correct){
                    this.rightNUm--;
                    this.correct = this.correct.filter(item => item !== this.nowIdnex)
                } else {
                    if(this.myAnswers.length && this.results[this.nowIdnex]){
                        let yes = _.isEqual(selectArr, zheng);
                        // console.log('进来？？？', a, correct);
                        if(yes && !correct){
                            this.rightNUm++;
                            this.correct.push(this.nowIdnex);
                        } else if(!yes && correct){
                            this.rightNUm--;
                            this.correct = this.correct.filter(item => item !== this.nowIdnex)
                        }
                    }
                }
                this.myAnswers = []
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
                if (this.answerStatus == 3 || this.lookMode) {
                    this.$router.push({
                        path: this.answerType,
                        query: {
                            uuid: this.$route.query.uuid,
                            ruleId: this.ruleId,
                        },
                    });
                    return;
                }
                    window.clearInterval(this.timer);
                    this.endTime = new Date().getTime();
                    this.finsh();
            } else {
                this.show = false;
                let timer = setTimeout(() => {
                    // console.log("lookModelookMode", this.lookMode);
                    if (!this.lookMode) {
                        //非观察模式,可修改提交
                        if (f == undefined) {
                            // this.myAnswers = this.results[this.nowIdnex].answer.myAnswers
                            this.submit({}, true);
                        }
                    }
                    this.myAnswers = [];
                    this.nowIdnex++;
                    // this.myAnswers = this.results[this.nowIdnex] ? this.results[this.nowIdnex].answer.myAnswers : [];
                    this.doing = true;
                    this.show = true;
                    this.getright();
                }, 300);
                console.log(timer);
                timer = null;
            }
        },
        //完成
        async finsh(falg) {
            let currentQuestionNo = this.questions.findIndex((question) => {
                return question.finshed == false;
            });

            if (currentQuestionNo !== -1) {
                this.results = this.results.slice(0, currentQuestionNo);
                // console.log("啊啊啊啊", this.results,currentQuestionNo,this.questions.length);
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

            console.log("结束", this.results);

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
                const { point, upperLimit, isFirst, reportPoint } = res.data.data;

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
                    reportPoint: this.answerType === '/answer/special' ? point : reportPoint,
                };
                this.clientSync.addStatistic(
                    'clickStatistic',
                    `{
                        'id': 'end-answer', 
                        'tag': ${this.$route.query.route === '/answer/month'? 'up_month':'up_special'}
                    }`,
                    null
                )
            }
        },
        //返现选项
        getright() {
            const question = this.questions[this.nowIdnex];
            const { options, type, id, finshed } = question;
            console.log(id, finshed);
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
            if(!this.questions[0].finshed && this.results.length > 1){
                this.results = [];
            }
            const question = this.questions[this.nowIdnex];
            var { options, type, id, finshed } = question;
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
            if(!this.myAnswers.length){
                // console.log(this.nowIdnex,'myAnswers');
                let myAnswers = []
                this.questions[this.nowIdnex].options.forEach((item,index)=>{
                    if(item.type === 'selected'){
                        myAnswers.push(index)
                    }
                })
                this.myAnswers = myAnswers
            }
            // console.log(this.myAnswers);
            //判断正确
            let isRight = _.isEqual(
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
            // if(!callback){
            //     this.results = this.results.slice(0, this.nowIdnex);
            // }
            //错误处理
            let result = isRight;

            //第一次提交
            if (nextflag == undefined) {
                console.log('第一次提交');
                this.show = false;
                let iti = setTimeout(() => {
                    this.results.push({
                        id,
                        type,
                        answer,
                        result,
                    });
                    this.show = true;
                    let past = this.correct.some(item => item === this.nowIdnex)
                    if (isRight && !past) {
                        this.rightNUm++;
                        this.correct.push(this.nowIdnex);
                    }

                    if (callback) {
                        this.finsh(true);
                    } else {
                        this.next({}, true);
                    }
                }, 500);
                console.log(iti);
                iti = null;
            } else {
                this.results[this.nowIdnex] = {
                        id,
                        type,
                        answer,
                        result,
                    };
                this.next({}, undefined);
                if(!isRight && this.rightNUm > 0){
                    if(this.correct.find(item => item === this.nowIdnex) !== undefined){
                        this.rightNUm--;
                    }
                    this.correct = this.correct.filter(item => item !== this.nowIdnex);
                }
                
                // console.log(this.rightNUm,'🗡');
                if (isRight && this.correct.find(item => item === this.nowIdnex) === undefined) {
                    this.correct.push(this.nowIdnex)
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
                    const flag = this.myAnswers.findIndex(
                        element => element === index 
                    );
                    // console.log(flag,'flag');
                    this.myAnswers.splice(flag, 1);
                } else {
                    // if(this.questions[this.nowIdnex].finshed && this.results[this.nowIdnex]){
                    //     this.myAnswers = this.results[this.nowIdnex].answer.myAnswers
                    // }
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
            &>div{
                float: right;
            }
            &>:nth-child(1){
                margin-left: 0.2rem;
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
    }
    .wrapper {
        padding-top: 1.12rem;
        .mainShow {
            position: relative;
            .bg {
                height: 2rem;
                background: #ffffff;
                background-image: url(../../assets/img/bg.png);
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
            .count-down{
                color: red;
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