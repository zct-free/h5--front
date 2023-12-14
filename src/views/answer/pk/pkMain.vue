<template>
        <match v-if="matching" @matchcancel="matchcancel" :time="showTime" v-finger:swipe="swipeHandler1"/>
        <suc
            v-else-if="sucShow && !matching"
            :myavat="myavat"
            :eachavat="eachavat"
            v-finger:swipe="swipeHandler1"
        />
        <div class="answerMain" v-else v-finger:swipe="swipeHandler">
            <div class="head">
                <div class="back" @click="back">
                    <van-icon name="arrow-left" size="20" />
                </div>
            </div>
            <div class="pkTool">
                <div class="left">
                    <div class="one">
                        <div class="avat">
                            <img :src="myavat" alt="" />
                        </div>
                        <div class="text">{{ myname }}</div>
                    </div>
                    <div class="tow">
                        <div class="poin">{{ myScore }}</div>
                        <div class="num">{{ mycorrectNum }}/{{ mytotalNum }}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="tow">
                        <div class="poin">{{ eachScore }}</div>
                        <div class="num">
                            {{ eachcorrectNum }}/{{ eachtotalNum }}
                        </div>
                    </div>
                    <div class="one">
                        <div class="avat">
                            <img :src="eachavat" alt="" />
                        </div>
                        <div class="text">{{ eachname }}</div>
                    </div>
                </div>
            </div>

            <transition name="slide-fade">
                <div class="wrapper">
                    <div class="mainShow">
                        <div class="mainPan">
                            <div class="titleWrapper"></div>

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
                                    <span class="befor" v-if="item.type === 'err'">
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

                            <!-- <div class="bottom">
                                <span class="bold">{{ nowIdnex + 1 }}</span
                                ><span>/</span><span>{{ questions.length }}</span>
                            </div> -->
                        </div>
                    </div>
                </div>
            </transition>

            <van-popup v-model="endShow" :round="true">
                <div class="showBox">
                    <div class="iconW" v-if="pkWin">
                        <img :src="vicon" alt="" />
                        <div class="text">获得胜利</div>
                    </div>
                    <div class="iconW" v-else>
                        <img :src="ficon" alt="" />
                        <div class="text fail">继续加油</div>
                    </div>
                    <div class="point" v-show="showpkpoint">
                        积分 + {{ pkpoint }} 首局获得积分
                    </div>

                    <div class="users" v-if="pkWin">
                        <div class="win">
                            <div class="left">
                                <div class="avat">
                                    <div class="king">
                                        <img :src="king" alt="" />
                                    </div>
                                    <img :src="myavat" alt="" />
                                </div>
                                <div class="text">
                                    <div class="name">{{ myname }}</div>
                                    <div class="num">
                                        {{ mycorrectNum }}/{{ mytotalNum }}
                                    </div>
                                </div>
                            </div>
                            <div class="right">{{ myScore }}</div>
                        </div>
                        <div class="fail">
                            <div class="left">
                                <div class="avat">
                                    <img :src="eachavat" alt="" />
                                    <!-- <div class="king">
                                        <img :src="king" alt="" />
                                    </div> -->
                                </div>
                                <div class="text">
                                    <div class="name">{{ eachname }}</div>
                                    <div class="num">
                                        {{ eachcorrectNum }}/{{ eachtotalNum }}
                                    </div>
                                </div>
                            </div>
                            <div class="right">{{ eachScore }}</div>
                        </div>
                    </div>
                    <div class="users" v-else>
                        <div class="win">
                            <div class="left">
                                <div class="avat">
                                    <div class="king">
                                        <img :src="king" alt="" />
                                    </div>
                                    <img :src="eachavat" alt="" />
                                </div>
                                <div class="text">
                                    <div class="name">{{ eachname }}</div>
                                    <div class="num">
                                        {{ eachcorrectNum }}/{{ eachtotalNum }}
                                    </div>
                                </div>
                            </div>
                            <div class="right">{{ eachScore }}</div>
                        </div>
                        <div class="fail">
                            <div class="left">
                                <div class="avat">
                                    <!-- <div class="king">
                                        <img :src="king" alt="" />
                                    </div> -->
                                    <img :src="myavat" alt="" />
                                </div>
                                <div class="text">
                                    <div class="name">{{ myname }}</div>
                                    <div class="num">
                                        {{ mycorrectNum }}/{{ mytotalNum }}
                                    </div>
                                </div>
                            </div>
                            <div class="right">{{ myScore }}</div>
                        </div>
                    </div>

                    <div class="contuin" @click="goContuin">
                        <img :src="contuin" alt="" />
                    </div>

                    <div class="rew" @click="goReshow">回顾本局答题</div>
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
    AiGetQuestion,
    AiMoreQuestion,
    AiWin,
    robotInformation
} from "../../../../serve/api/answer.js";
import VConsole from "vconsole";
import { Dialog } from "vant";
import _ from "lodash";
import suc from "./pksuc.vue";
import match from "./pkmatch.vue";
import Vue from "vue";
import VueSocketIO from 'vue-socket.io'
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

            showTime: "00:00", //倒计时显示
            _time: 100, //倒计时
            timer: null,

            mainShow: true, //end展示
            endConfig: {}, //end配置

            reAnaswer: false, //再来一次

            loading: false, //加载中

            libId: null,

            //
            endShow: false,
            sucShow: true,
            matching: true,
            vicon: require("@/assets/img/v.png"),
            ficon: require("@/assets/img/f.png"),
            contuin: require("@/assets/img/contuin.png"),
            king: require("@/assets/img/king.png"),

            pkid: null,
            //我的信息
            mycorrectNum: 0, //正确
            mytotalNum: 0, //总答题
            myScore: 0,
            myname: "",
            myavat: "",
            //对手
            eachcorrectNum: 0,
            eachtotalNum: 0,
            eachScore: 0,
            eachname: "",
            eachavat: "",
            //获胜
            pkWin: false,
            pkEnd: false, //pk结束

            showpkpoint: false,
            pkpoint: 0,

            pktimer: null, //pk时间

            robuteTime: null, //机器人
            aiMode: false, //AI模式
            rot: null,
            rt: 30, //机器人时间
            aiAnswerTimer: null, // 机器人答题定时器
            aiLevel2Count: 0, // 记录机器人答题二级难度题数量
            aiAnswerCount: 0, // 记录机器人答题数量

            catchResults: [],
            hasFin: false, //已经完成一次缓存
            catchNo: 0,
            endRestult: [] // 记录已答题列表
        };
    },
    created() {
        if(window.nativeHandler){
            window.sysBack = this.sysBack
            window.nativeHandler.execute('interceptSysBack', 'true', null);
        }
        const connection = process.env.NODE_ENV === 'k8sproduction'? 'https://apparmy.81.mil.cn' : 'http://172.16.18.131:8186'
        const options = {
            autoConnect:false,
            transports: ['websocket'],
            path: "/answer-app-sock/socket.io/"
        }
        Vue.use(new VueSocketIO({
            debug: true,
            connection, 
            options,
        }))
        this.init();
    },
    mounted() {
        //this.gethistoryRes();
        this.endRestult = this.$store.state.pkQuestionList || [];
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
        this.clientSync.addStatistic(
            'clickStatistic',
            `{
                'id': 'start-answer', 
                'tag': 'pk_two'}
            }`,
            null
        )
    },
    sockets: {
        connect() {
            console.log("链接成功");
        },
        reconnect(data) {
            console.log("重连", data.correctNum);
            window.clearInterval(this.timer);
            this.pkId = data.pkId;
            this.matching = false;
            this.sucShow = false;

            if (data.matchUserInfo) {
                this.eachname = data.matchUserInfo.nickname || "";
                this.eachavat = data.matchUserInfo.portraitUri || "";
            }

            this.eachScore = data.opponentScore || 0;
            this.eachcorrectNum = data.opponentCorrectNum || 0;
            this.eachtotalNum = data.opponentTotalNum || 0;

            if (data.userInfo) {
                this.myname = data.userInfo.nickname || "";
                this.myavat = data.userInfo.portraitUri || "";
            }
            this.myScore = data.score || 0;
            this.mycorrectNum = data.correctNum || 0;
            this.mytotalNum = data.totalNum || 0;

            this.pkTimeStart(data.spendTime);

            this.creatQuest(data.questions);

            //this.gethistoryRes();
        },
        ServerReceive(data) {
            console.log("ServerReceiveServerReceive", data);
        },
        pkWin(data) {
            console.log("pkWin获胜", data);
            window.clearInterval(this.pktimer);
            this._time = 0;
            if (this.$route.query.uuid === data.uuid) {
                this.pkWin = true;
            } else {
                this.eachScore = this.eachScore + 20;
                this.eachcorrectNum = this.eachcorrectNum + 1;
                this.eachtotalNum = this.eachtotalNum + 1;

                this.pkWin = false;
            }
            if (data.point) {
                this.pkpoint = data.point;
                this.showpkpoint = true;
            } else {
                this.showpkpoint = false;
            }

            this.endShow = true;
            this.pkEnd = true;
            this.finsh();
        },
        pkReceive(data) {
            console.log("对方答题事件pkReceive", data);
            if (data.opponentCorrectNum) {
                this.eachcorrectNum = data.opponentCorrectNum || 0;
            }
            if (data.opponentScore) {
                this.eachScore = data.opponentScore || 0;
            }
            this.eachtotalNum = data.opponentTotalNum || 0;
        },
        questionReceive(data) {
            console.log("拿题返回事件questionReceive", data);
            this.addQuest(data.questions);
        },

        ConnectReceive(data) {
            this.pkId = data.pkId;

            if (data.state == 1) {
                window.clearInterval(this.timer);
                this.creatQuest(data.questions);
                this.matching = false;
                setTimeout(() => {
                    this.start()
                }, 1000)
                if (data.matchUserInfo) {
                    this.eachname = data.matchUserInfo.nickname || "";
                    this.eachavat = data.matchUserInfo.portraitUri || "";
                }

                if (data.userInfo) {
                    this.myname = data.userInfo.nickname || "";
                    this.myavat = data.userInfo.portraitUri || "";
                }
            }
        },
    },
    watch: {
        endShow(newValue){
            if(!newValue && this.showTime !== '00:00'){
                this.$router.replace({
                    path: "/answer/pk/pkentry",
                    query: {
                        uuid: this.$route.query.uuid
                    }
                })
            }
        }
    },
    components: {
        suc,
        match,
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
            if(this.matching || this.endShow){
                this.$socket.emit("quit", {
                    uuid: this.$route.query.uuid,
                });
                this.$socket.close();
                this.$router.replace({
                    path: "/answer/pk/pkentry",
                    query: {
                        uuid: this.$route.query.uuid,
                    },
                });
            } else{
                this.back()
            }
        },
        //判分
        async judgment(winer) {
            if (winer == "my") {
                this.pkWin = true;
            } else {
                // this.nowIdnex  = this.nowIdnex - 1
                this.pkWin = false;
            }
            if (this.aiMode) {
                const res = await AiWin({
                    uuid: this.$route.query.uuid,
                    win: this.pkWin,
                    spendTime: this._time, //花费时间，单位秒
                    correctNum: this.mycorrectNum, //正确题数
                    totalNum: this.mytotalNum, //总共答题数
                });
            }

            this.endShow = true;
            this.pkEnd = true;
            this.finsh();
        },
        //机器人
        async initRobute() {
            this.aiMode = true;
            this.$socket.emit("quit", {
                uuid: this.$route.query.uuid,
            });
            this.$socket.close();
            let information = await robotInformation();
            console.log(information,'information');
            if(information.data.code === 1000){
                this.eachname = information.data.data.eachname;
                this.eachavat = information.data.data.eachavat;
            } else{
                let ran = Math.floor(Math.random() * 100);
                this.eachname = `机器人${ran}`;
                this.eachavat =
                "https://appresource.81.mil.cn/image/20210714/df00e6955af343b672f6feaaf34ba7f9.png";
            }
            window.clearInterval(this.timer);
            this.matching = false;
            this.sucShow = true;
            setTimeout(() => {
                this.start()
            }, 1000)

            const res = await AiGetQuestion({
                uuid: this.$route.query.uuid,
            });
            if (res.data.code == 1000) {
                this.creatQuest(res.data.data.questions);

                this.myname = res.data.data.userInfo.nickName;
                this.myavat = res.data.data.userInfo.portraitUri;
            }
            this.robuteRun();
        },
        //机器人运行
        robuteRun() {
            let add = () => {
                // console.log('adding')
                if(this.questions[this.aiAnswerCount].difficultyLevel === 1) {
                    this.eachcorrectNum++;
                }else if(this.questions[this.aiAnswerCount].difficultyLevel === 2) {
                    this.aiLevel2Count += 1
                    if(this.aiLevel2Count%2 === 1){
                        this.eachcorrectNum++;
                    }
                }
                this.eachScore = this.eachcorrectNum * 20;
                this.eachtotalNum++;
                this.aiAnswerCount += 1;
                //停止
                if (this.eachScore >= 100 || this.myScore >= 100) {
                    window.clearTimeout(this.aiAnswerTimer);
                    if(this.eachScore >= 100) {
                        this.judgment("each");
                    }
                }
                //增加题
                if (this.aiAnswerCount + 2 == this.questions.length) {
                    this.moreQuestion();
                }
            };
            this.rot = this.setTime(add);
        },

        //模拟循环
        setTime(fn) {
            //答题随机数
            this.aiAnswerTimer = null;
            let _that = this;
            function run() {
                let t = 8000;
                if(_that.questions[_that.aiAnswerCount].difficultyLevel === 1) {
                    t = 8000;
                    t = Math.floor(Math.random()*(12000-8000+1))+8000;
                }else if(_that.questions[_that.aiAnswerCount].difficultyLevel === 2) {
                    t = 10000;
                }else if(_that.questions[_that.aiAnswerCount].difficultyLevel === 3) {
                    t = 15000;
                }
                if (_that.eachScore < 100 || _that.myScore < 100) {
                    setTimeout(fn, _that.aiAnswerCount === 0? t : 0);
                }
                _that.aiAnswerTimer = setTimeout(run, _that.aiAnswerCount === 0? 2*t : t);

            }
            run();

            return {
                cancel: () => {
                    window.clearTimeout(this.aiAnswerTimer);
                },
            };
        },
        //取消
        matchcancel() {
            this.iOdisconnect();
        },
        //取消链接
        iOdisconnect() {
            this.$socket.emit("quit", {
                uuid: this.$route.query.uuid,
            });
            this.$socket.close();
            this.$router.replace({
                path: "/answer/pk/pkentry",
                query: {
                    uuid: this.$route.query.uuid,
                },
            });
        },
        //创建试题
        creatQuest(questions) {
            questions.forEach((i) => {
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
            this.questions = questions;
        },
        //增加题
        addQuest(questions) {
            questions.forEach((i) => {
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
            this.questions = this.questions.concat(questions);
        },
        //答题
        submitQuest(isRight) {
            if (this.aiMode) {
                // console.log('aiMode提交',this.myScore)
                if (this.myScore >= 100) {
                    this.judgment("my");
                }
            } else {
                if (this.myScore >= 100) {
                    this.judgment("my");
                }
                let data = {
                    action: "answer", //答题动作
                    pkId: this.pkId,
                    uuid: this.$route.query.uuid,
                    correctNum: this.mycorrectNum, //正确题数，包括本题
                    totalNum: this.mytotalNum, //总共答题数
                    correct: isRight, //本题作答正确还是错误
                    spendTime: this._time,
                };
                this.$socket.emit("ServerReceive", data);
            }
        },
        //更多题目
        async moreQuestion() {
            console.log("更多题目");
            if (this.aiMode) {
                const res = await AiMoreQuestion({
                    uuid: this.$route.query.uuid,
                });
                if (res.data.code == 1000) {
                    this.addQuest(res.data.data);
                }
            } else {
                let message = {
                    action: "moreQuestion", //拿题动作
                    pkId: this.pkId,
                    uuid: this.$route.query.uuid,
                };
                this.$socket.emit("ServerReceive", message);
            }
        },
        //答题时间
        pkTimeStart(spendTime) {
            this._time = spendTime || 0;

            this.pktimer = setInterval(() => {
                this._time = this._time + 1;
            }, 1000);
        },
        start() {
            console.log("start");
            this.pkTimeStart();
            this.sucShow = false;
        },
        //继续
        goContuin() {
            this.endRestult = [];
            this.$store.dispatch('SET_Pk_LIST', [])
            this.showTime = "00:00";
            window.clearInterval(this.pktimer);
            window.clearTimeout(this.aiAnswerTimer);
            if (!this.aiMode) {
                this.$socket.emit("quit", {
                    uuid: this.$route.query.uuid,
                });
            }

            this.aiMode = false;
            this.hasFin = false;

            this.$socket.close();

            this.endShow = false;
            this.sucShow = true;
            this.matching = true;

            this.nowIdnex = 0;
            this.mycorrectNum = 0;
            this.mytotalNum = 0;
            this.myScore = 0;

            this.eachcorrectNum = 0;
            this.eachtotalNum = 0;
            this.eachScore = 0;

            this._time = 0;

            setTimeout(() => {
                console.log("开始init");
                this.init();
            }, 1000);

            // this.$socket.emit("start", {
            //     uuid: this.$route.query.uuid,
            // });

            console.log("contuin");
        },
        goReshow() {
            this.$store.dispatch('SET_Pk_LIST', [])
            this.$router.replace({
                path: "/answer/pk/pkReshow",
                query: { uuid: this.$route.query.uuid },
            });
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
            this.pkEnd = false;
            this.startTime = new Date().getTime();

            this.ruleId = this.$route.query.ruleId;

            this.questionGroupId = "61b33471ea328017bfc92f3f";

            this.lookMode = false;

            this.$socket.open();
            this.starTime();
            this.$socket.emit("start", {
                uuid: this.$route.query.uuid,
            });
        },
        starTime() {
            console.log("starTime");
            this._time = 0;

            this.timer = setInterval(() => {
                this._time = this._time + 1;
                this.showTime = this.formateTime(this._time);
                console.log("showTime", this.showTime);
                // this.initRobute();

                //添加机器人

                if (this._time >= this.rt && !this.aiMode) {
                    this.initRobute();
                }
            }, 1000);
        },
        //提前结束
        endT() {
            this.submit(null, undefined, true);
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

            if (historyRes.data.code == 1000) {
                let res = historyRes.data.data;
                this.catchResults = res.results;
                this.catchNo = res.currentQuestionNo;
                // console.log('resresrres',res)
                //  let ids = res.results.map((item) => {
                //     return item.id;
                // });

                // this.nowIdnex = res.currentQuestionNo;
                // let folgNo = res.currentQuestionNo - 1;

                // //已完成,重新答题
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

                // this.results = res.results;

                // let ids = this.results.map((item) => {
                //     return item.id;
                // });

                // await this.listById(ids);

                // if (this.lookMode || this.answerStatus == 1) {
                //     console.log("herere", folgNo);
                //     for (let i = folgNo; i > -1; i--) {
                //         let { options } = this.questions[i];
                //         this.questions[i].finshed = true;

                //         let { difference, intersection, myAnswers } =
                //             res.results[i].answer;

                //         //继续答题
                //         if (this.answerStatus == 1) {
                //             myAnswers.forEach((item) => {
                //                 options[item].type = "selected";
                //             });
                //         } else {
                //             if (!difference) {
                //                 //正确选项
                //                 difference = options
                //                     .map((item, index) => {
                //                         if (item.isAnswer) {
                //                             return index;
                //                         } else {
                //                             return null;
                //                         }
                //                     })
                //                     .filter((item) => item !== null);

                //                 intersection = [];
                //             }

                //             difference.forEach((item) => {
                //                 options[item].type = "right";
                //             });

                //             //判断正确
                //             const isRight = _.isEqual(
                //                 difference.sort(),
                //                 intersection.sort()
                //             );
                //             if (!isRight) {
                //                 intersection.forEach((item) => {
                //                     options[item].type = "err";
                //                 });
                //             }
                //         }
                //     }
                //     this.getright();
                // }
            }
        },
        //获取之前题目
        async listById(ids) {
            const re = await getListById(ids);

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
                this.loading = false;
            }
        },
        //滑动
        swipeHandler(evt) {
            if (evt.direction == "Right") {
                this.back()
            } 
            /* if (evt.direction == "Right") {
                if (this.nowIdnex !== 0) {
                    this.pre();
                }
            } */
        },
        swipeHandler1(evt) {
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
            // if ((this.answerStatus == 3 || this.lookMode) && !this.reAnaswer) {
            //     this.$router.push({
            //         path: "/answer/special",
            //         query: {
            //             uuid: this.$route.query.uuid,
            //             ruleId: this.ruleId,
            //         },
            //     });
            //     return;
            // }

            Dialog.confirm({
                message: `你已经获得${this.myScore}分,确定要退出答题`,
            })

                .then(async () => {
                    this.iOdisconnect();
                    //返回退出
                    // let currentQuestionNo = this.questions.findIndex(
                    //     (question) => {
                    //         return question.finshed == false;
                    //     }
                    // );

                    // this.results = this.results.slice(0, currentQuestionNo);

                    // for (
                    //     let i = currentQuestionNo;
                    //     i < this.questions.length;
                    //     i++
                    // ) {
                    //     const { id, type } = this.questions[i];
                    //     this.results.push({
                    //         id,
                    //         type,
                    //         answer: {},
                    //         result: true,
                    //     });
                    // }

                    // this.endTime = new Date().getTime();
                    // let pramser = {
                    //     uuid: this.$route.query.uuid,
                    //     ruleId: this.ruleId,
                    //     questionGroupId: this.questionGroupId,
                    //     questionNum: this.questions.length,
                    //     correctNum: Number(this.rightNUm), //答对数量
                    //     spendTime: parseInt(
                    //         (this.endTime - this.startTime) / 1000
                    //     ),
                    //     isFinished: false,
                    //     currentQuestionNo,

                    //     results: this.results,
                    // };

                    // const res = await questionAdd(pramser);

                    // if (res.data.code == 1000) {
                    //     this.$router.push({
                    //         path: "/answer/special",
                    //         query: {
                    //             uuid: this.$route.query.uuid,
                    //             ruleId: this.ruleId,
                    //         },
                    //     });
                    // }
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
                // this.endTime = new Date().getTime();
                // this.finsh();
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
        async finsh() {
            this.clientSync.addStatistic(
                'clickStatistic',
                `{
                    'id': 'end-answer', 
                    'tag': 'pk_two'}
                }`,
                null
            )
            // if (currentQuestionNo !== -1) {
            //     this.results = this.results.slice(0, currentQuestionNo);
            //     console.log('this.results', this.results)
            //     console.log(
            //         "啊啊啊啊",
            //         this.results,
            //         currentQuestionNo,
            //         this.questions.length
            //     );
            //     for (
            //         let i = currentQuestionNo;
            //         i < this.questions.length;
            //         i++
            //     ) {
            //         const { id, type } = this.questions[i];
            //         console.log("push");
            //         this.results.push({
            //             id,
            //             type,
            //             answer: {},
            //             result: true,
            //         });
            //     }
            // }
            //  this.nowIdnex= this.nowIdnex-1

            //  if (this.nowIdnex == 0) {
            //     console.log("//未答题");
            //     n = this.questions.length - 1;
            // }
            if (this.hasFin) return;

            this.hasFin = true;

            // if (this.nowIdnex == 0) {
            //     console.log("这里这里");

            //     for (let i = 0; i < this.questions.length; i++) {
            //         const { id, type } = this.questions[i];

            //         this.results.push({
            //             id,
            //             type,
            //             answer: {},
            //             result: true,
            //         });
            //     }
            // }

            this.endTime = new Date().getTime();

            //
           
            //setTimeout(() => {


                 console.log('this.results',this.results,this.catchResults, this.endRestult)
                 
                let n = this.nowIdnex;
                let endRestult = this.endRestult.concat(this.results);
                this.endRestult = endRestult;
                console.log("endRestult",  endRestult, this.endRestult);
                if (!this.win) {
                    n = n - 1;
                } else {
                    n = n + 1;
                }
                if (n < 0) {
                    n = 4;
                }

                let endn = n + this.catchNo - 1;
                endn = this.endRestult.length - 1;
                let pramser = {
                    uuid: this.$route.query.uuid,
                    // ruleId: this.ruleId,
                    // questionGroupId: this.questionGroupId,
                    // questionNum: this.questions.length,
                    questionNum: this.endRestult.length,
                    correctNum: Number(this.rightNUm), //答对数量
                    spendTime: parseInt((this.endTime - this.startTime) / 1000),
                    isFinished: true,
                    currentQuestionNo: endn,

                    results: this.endRestult,
                };
                this.$store.dispatch('SET_Pk_LIST', this.endRestult)
                console.log('this.$store.state.pkQuestionList--11', this.$store.state.pkQuestionList, this.$store.state.pkQuestionList || []);
                console.log("pramser", pramser);

                questionAdd(pramser);
            //}, 1000);
            // const res = await questionAdd(pramser);
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
            // console.log("倒计时2", finshed, nextflag, callback);

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

            rightAnswers.forEach((item) => {
                options[item].type = "right";
            });

            if (!isRight) {
                this.myAnswers.forEach((item) => {
                    options[item].type = "err";
                });
            }

            let answer = {
                difference,
                intersection,
                myAnswers: this.myAnswers,
            };
            this.results = this.results.slice(0, this.nowIdnex);

            //错误处理
            let result = false;

            if (isRight) {
                //正确数+1
                this.mycorrectNum++;
                this.myScore = this.myScore + 20;
                result = true;
            } else {
                result = false;
            }

            //第一次提交
            if (nextflag == undefined) {
                console.log("第一次提交");
                this.show = false;
                this.results.push({
                    id,
                    type,
                    answer,
                    result,
                });
                let iti = setTimeout(() => {
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
            //答题量+1
            this.mytotalNum++;
            //提交

            this.submitQuest(isRight);
            // this.finsh();
            //增加题
            if (this.nowIdnex + 2 == this.questions.length) {
                console.log("这里", this.nowIdnex, this.questions.length);
                this.moreQuestion();
            }
        },
        select(index, question) {
            const { options, type, finshed } = question;
            //仅查看模式
            if (this.lookMode || finshed || this.pkEnd) return;
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

            this.submit();
        },
    },
    destroyed() {
        console.log("销毁");
        if (!this.hasFin) {
            this.finsh();
        }
        window.clearInterval(this.timer);
        window.clearInterval(this.pktimer);
        window.clearTimeout(this.aiAnswerTimer);
        this.$socket.emit("quit", {
            uuid: this.$route.query.uuid,
        });
        this.$socket.close();
    }
};
</script>

<style lang="less" scoped>
.answerMain {
    background: linear-gradient(315deg, #f559ff 0%, #3c00d9 100%);
    height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90;
        color: #fff;
        .back {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
    }
    .pkTool {
        margin-top: 1.12rem;
        height: 3rem;
        background-image: url(../../../assets/img/pktool.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        .left {
            width: 50%;
            height: 1.6rem;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 35px 0 30px;
            .one {
                display: flex;
                flex-direction: column;
                align-items: center;
                .avat {
                    width: 1rem;
                    height: 1rem;
                    border: 1px solid #fff;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    margin-top: 5px;
                    font-size: 0.24rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 1.3rem;
                    text-align: center;
                }
            }
            .tow {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.25rem;

                .poin {
                    font-size: 0.48rem;
                }
                .num {
                    margin-top: 5px;
                    font-size: 0.24rem;
                }
            }
        }
        .right {
            width: 50%;
            height: 1.6rem;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 35px 0 30px;
            .one {
                display: flex;
                flex-direction: column;
                align-items: center;
                .avat {
                    width: 1rem;
                    height: 1rem;
                    border: 1px solid #fff;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    margin-top: 5px;
                    font-size: 0.24rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 1.3rem;
                    text-align: center;
                    //  width: 100px;
                    height: 0.3rem;
                }
            }
            .tow {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.25rem;

                .poin {
                    font-size: 0.48rem;
                }
                .num {
                    margin-top: 5px;
                    font-size: 0.24rem;
                }
            }
        }
    }
    .wrapper {
        height: 100vh;
        margin-top: 0.5rem;
        .mainShow {
            height: 100%;

            .mainPan {
                border-radius: 20px 20px 0 0;
                background: #ffffff;
                box-shadow: 0px 1px 20px -5px rgba(0, 0, 0, 0.1),
                    0px 1px 10px -5px rgba(0, 0, 0, 0.1);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .issues {
                    padding: 0.4rem;
                    height: 100%;
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
                .bottom {
                    align-items: center;

                    text-align: center;
                    padding-bottom: 10px;
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
    .showBox {
        height: 8rem;
        width: 5.12rem;
        border-radius: 16px;
        padding: 0 10px;

        .iconW {
            height: 3rem;
            width: 4rem;

            margin: 0 auto;
            margin-top: -20%;

            img {
                width: 100%;
            }
            .text {
                margin-top: -30px;
                font-size: 0.48rem;
                color: rgba(255, 126, 7, 1);
                line-height: 31px;
                text-align: center;
                font-family: "YouSheBiaoTiHei";
            }
            .fail {
                color: rgba(164, 164, 164, 1);
            }
        }
        .point {
            text-align: center;
            font-size: 0.24rem;
        }
        .users {
            .win {
                background: rgba(255, 225, 104, 1);
                height: 1rem;
                margin-top: 0.4rem;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.25rem;
                color: #fff;
                .left {
                    display: flex;

                    .avat {
                        width: 0.72rem;
                        height: 0.72rem;
                        border: 1px solid #ffffff;
                        border-radius: 50%;
                        position: relative;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .king {
                            position: absolute;
                            top: -5px;
                            left: -5px;
                            height: 0.5rem;
                            width: 0.6rem;
                        }
                    }
                    .text {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;

                        font-size: 0.24rem;
                        margin-left: 10px;
                        .name {
                            overflow: hidden; //超出隐藏
                            text-overflow: ellipsis; //溢出用省略号显示
                            display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
                            // 控制行数
                            -webkit-line-clamp: 2; //超出两行隐藏
                            -webkit-box-orient: vertical; // 从上到下垂直排列子元素
                            color: rgba(255, 104, 15, 1);
                        }
                    }
                }
                .right {
                    font-size: 0.48rem;
                    font-weight: 700;
                }
            }
            .fail {
                background: rgba(240, 240, 240, 1);
                height: 1rem;
                margin: 0.1rem 0 0.4rem 0;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.25rem;
                color: #a4a4a4;
                .left {
                    display: flex;

                    .avat {
                        width: 0.72rem;
                        height: 0.72rem;
                        border: 1px solid #ffffff;
                        border-radius: 50%;
                        position: relative;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .king {
                            position: absolute;
                            top: -5px;
                            left: -5px;
                            height: 0.5rem;
                            width: 0.6rem;
                        }
                    }
                    .text {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;

                        font-size: 0.24rem;
                        margin-left: 10px;
                        .name {
                            color: #233333;
                            overflow: hidden; //超出隐藏
                            text-overflow: ellipsis; //溢出用省略号显示
                            display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
                            // 控制行数
                            -webkit-line-clamp: 2; //超出两行隐藏
                            -webkit-box-orient: vertical; // 从上到下垂直排列子元素
                        }
                    }
                }
                .right {
                    font-size: 0.48rem;
                    font-weight: 700;
                }
            }
        }
        .contuin {
            height: 0.72rem;
            width: 3.4rem;
            margin: 0 auto;
            img {
                height: 100%;
                width: 100%;
            }
        }
        .rew {
            text-align: center;
            font-size: 0.24rem;
            margin: 0.4rem auto;
        }
    }
}

.van-popup {
    overflow-y: visible !important;
}
</style>
