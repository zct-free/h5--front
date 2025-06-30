<template>
    <div class="answerEntry">
        <div class="head">
            <div class="back item" @click="back">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="txt item">学习先锋</div>
            <!-- <div @click="gotoRecord" class="record item">答题记录</div> -->
            <div @click="gotoExplain" class="record item">使用说明</div>
        </div>
        <img src="@/assets/img/answer/banner.png" class="banner" />
        <div class="wrapper" v-show="show">
            <div
                :class="['cardsItem', item.ruleType]"
                v-for="(item, index) in list"
                :key="index"
                @click="gotoMain(item)"
            >
                <div class="name">
                    <div>
                        <div class="title">{{ item.title }}</div>
                        <div class="subheading">{{ item.slogan }}</div>
                    </div>
                </div>
            </div>
            <div class="module-title">对抗竞赛</div>
            <div class="competition">
                <div class="pk double-pk"  @click="gotoDoublePk">
                    <div class="name">
                        <div class="title">双人对抗</div>
                        <div class="subheading">竞技对抗 充实自我</div>
                    </div>
                </div>
                 <!-- <div class="pk three-pk"  @click="gotoThreePk"> -->
                    <div class="pk three-pk">
                    <div class="name">
                        <div class="title">三人竞赛</div>
                         <div class="subheading">正在研发中 敬请期待</div>
                        <!-- <div class="subheading">在线对抗 能者胜</div> -->
                    </div>
                </div>
            </div>
            <div class="module-title">学习成绩</div>
            <ul class="each-achievement">
                <li v-for="(item, index) in eachAchievement" :key="item.id" :class="selectIndex === index? 'selected': ''" @click="selected(index)">{{item.name}}</li>
            </ul>
            <div class="transcript">
                <div class="row header">
                    <span>排名</span>
                    <span>用户</span>
                    <span>得分</span>
                    <span>时间</span>
                </div>
                <div class="row" v-for="(item, index) in transcript" :key="index">
                    <span v-if="item.imgSrc">
                        <img :src="item.imgSrc" alt="111">
                    </span>
                    <span v-else>{{ index + 1 }}</span>
                    <span class="useName">{{ item.useName }}</span>
                    <span>{{ item.score > 100 ? 100 : item.score }}</span>
                    <span>{{ item.answerTime | time }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from "md5";
import { integrateAdd, questionRuleList, questionRank } from "../../../serve/api/answer.js";
import VConsole from "vconsole";
export default {
    data() {
        return {
            cards: [
                {
                    title: "每日答题",
                    subheading: "太阳每天都是新的",
                    icon: require("@/assets/img/day.png"),
                },
            ],
            icon: require("@/assets/img/day.png"),
            monthIcon: require("@/assets/img/answer/month.png"),
            dayIcon: require("@/assets/img/answer/daily.png"),
            weekIcon: require("@/assets/img/answer/weekly.png"),
            specialIcon: require("@/assets/img/answer/special.png"),
            pkIcon: require("@/assets/img/pkicon.png"),
            list: [],
            uuid: "",
            show:false,
            // ruleId: "",
            // status:1, //0-未启用 1-启用

            eachAchievement: [
                {
                    type: 'MONTH',
                    name: '有问必答'
                },
                // {
                //     id: 2,
                //     name: '挑战自我'
                // },
                // {
                //     id: 3,
                //     name: '对抗竞赛'
                // },
                // {
                //     id: 4,
                //     name: '成绩排行'
                // }
            ],
            selectIndex: 0,
            transcript: [],
            img0: require('@/assets/img/answer/first.png'),
            img1: require('@/assets/img/answer/second.png'),
            img2: require('@/assets/img/answer/third.png')
        };
    },
    async created() {
        if(window.nativeHandler){
            window.sysBack = this.back
            window.nativeHandler.execute('interceptSysBack', 'true', null);
        }
        this.uuid = this.$route.query.uuid;
        const res = await questionRuleList();
        let { code, data } = res.data
        if (code == 1000) {
            // this.ruleId = res.data.data[0].id;
            // this.status = res.data.data[0].status;
            let item1 = data.findIndex(item => item.ruleType === 'MONTH' );
            item1 = data.splice(item1,1)[0];
            let item2 = data.findIndex(item => item.ruleType === 'DAILY' );
            data.unshift(item1, data.splice(item2,1)[0]);
            this.list = data;
            this.show = true
        }
        this.getTranscript()
        this.list = this.list
            .map((item) => {
                if (item.filed == false && item.status == 1) {
                    return item;
                }
            })
            .filter((item) => item !== undefined);

        this.list.forEach((item) => {
            let icon;
            if (item.ruleType == "DAILY") {
                icon = this.dayIcon;
                item.subheading = "太阳每天都是新的";
            } else if (item.ruleType == "SPECIAL") {
                icon = this.specialIcon;
                item.subheading = "周而复始，如期而至";
            } else if (item.ruleType == "WEEKLY") {
                icon = this.weekIcon;
                item.subheading = "术业有专攻，道义有精论";
            } else if(item.ruleType == "MONTH"){
                icon = this.monthIcon
            }
            item.title = item.ruleName;
            // item.subheading = "太阳每天都是新的";
            item.icon = icon;
        });
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
    },
    filters: {
        time(value){
            if (value) {
                const regNumber = /^\d+$/
                let time = value
                if (regNumber.test(value)) {
                time = Number(value)
            }
                const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
                const year = date.getFullYear()
                const month = `0${date.getMonth() + 1}`.slice(-2)
                const sdate = `0${date.getDate()}`.slice(-2)
                // 拼接
                const result = `${year}/${month}/${sdate}`
                // 返回
                return result
            }
            return ''
        }
    },
    methods: {
        back() {
            window.nativeHandler.execute("closeAllWebView", "", "");
        },
        // 三人竞赛
        gotoThreePk() {
            this.$router.push({
                path: "/answer/pk/threePk",
                query: { uuid: this.uuid },
            });
        },
        // 双人pk
        gotoDoublePk() {
            this.$store.dispatch('SET_Pk_LIST', [])
            this.$router.push({
                path: "/answer/pk/pkentry",
                query: { uuid: this.uuid },
            });
        },
        // 答题记录
        gotoRecord() {
            this.$router.push({
                path: "/answer/record",
                query: { uuid: this.uuid },
            });
        },
        // 使用说明
        gotoExplain() {
            this.$router.push({
                path: "/answer/explain"
            });
        },
        async gotoMain(item) {
            // window.nativeHandler.execute('interceptSysBack', 'false', null);
            const { ruleType, libId } = item;

            //积分
            let time = new Date();
            let uniqueId = md5(time);

            const env = process.env.NODE_ENV;
            let taskId = "";
            switch (env) {
                case "development":
                    taskId = `57777c83810f4290b25fa42a3a51ec44`;
                    break;
                case "relase":
                    taskId = `57777c83810f4290b25fa42a3a51ec44`;
                    break;
                case "relasebcos":
                    taskId = `57777c83810f4290b25fa42a3a51ec44`;
                    break;
                // 客户生产
                case "production":
                    taskId = `3998c9efe2af4bf88ce49c78eb2bfa0e`;
                    break;
                case "k8sproduction":
                    taskId = "3998c9efe2af4bf88ce49c78eb2bfa0e";
                    break;
                default:
                    taskId = `3998c9efe2af4bf88ce49c78eb2bfa0e`;
                    break;
            }
            // console.log("unidunid", this.uuid);
            // console.log("环境变量", env);
            let params;
            if (libId) {
                params = {
                    functionData: {
                        userId: this.uuid, //用户id，需要透传
                        taskId: taskId, //任务 id，需要透传
                        uniqueId: uniqueId, //新增积分唯一性id，需要透传
                        taskSubject: libId,
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

            // 每日
            if (ruleType == "DAILY") {
                this.$router.push({
                    path: "/answer/main",
                    query: {
                        uuid: this.uuid,
                        ruleId: item.id,
                    },
                });
                console.log("积分积分", JSON.stringify(params));
                await integrateAdd(params);
            } else if (ruleType == "WEEKLY") {
                //每周
                this.$router.push({
                    path: "/answer/week",
                    query: {
                        uuid: this.uuid,
                        ruleId: item.id,
                    },
                });
            } else if (ruleType == "SPECIAL") {
                //每周
                this.$router.push({
                    path: "/answer/special",
                    query: {
                        uuid: this.uuid,
                        ruleId: item.id,
                    },
                });
            } else if(ruleType == 'MONTH'){
                //每月
                this.$router.push({
                    path: "/answer/month",
                    query: {
                        uuid: this.uuid,
                        ruleId: item.id,
                    },
                });
            }
        },
        async getTranscript(){
            let ruleId = this.list.find(item=>{
                return item.ruleType === this.eachAchievement[this.selectIndex].type
            })
            if(!ruleId) return
            const res = await questionRank({
                ruleId: ruleId.id
            })
            // console.log(res);
            let {code, data} = res.data
            if(code === 1000 && data.length){
                this.transcript = data
                this.transcript[0].imgSrc = this.img0
                this.transcript[1].imgSrc = this.img1
                this.transcript[2].imgSrc = this.img2
            }
        },
        selected(index){
            this.selectIndex = index
        }
    }
};
</script>

<style lang="less" scoped>
.answerEntry {
    background: #fff;
    height: 100vh;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;

        height: 1.12rem;
        line-height: 1.12rem;
        margin-bottom: 0.2rem;
        background: #ffffff;

        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90;
        .txt {
            font-size: 0.32rem;
            font-weight: 600;
            color: #332929;
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
    }
    .banner {
        width: 100%;
        padding-top: 1.12rem;
    }
    .wrapper {
        .cardsItem {
            margin: 0.2rem;
            box-sizing: border-box;
            height: 1.7rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            &.MONTH {
                background-image: url(../../assets/img/answer/cards-item1.png);
            }
            &.SPECIAL{
                background-image: url(../../assets/img/answer/cards-item4.png);
            }
            &.DAILY{
                background-image: url(../../assets/img/answer/cards-item2.png);
            }
            &.WEEKLY{
                background-image: url(../../assets/img/answer/cards-item3.png);
            }
            .name {
                height: 100%;
                .title {
                    margin-bottom: 0.2rem;
                    font-size: 0.32rem;
                    font-weight: 500;
                    color: #ffffff;
                }
                .subheading {
                    font-size: 0.26rem;
                    font-weight: 400;
                    color: #ffffff;
                }
            }
            .icon {
                height: 1.3rem;
                width: 1.3rem;
                img {
                    width: 100%;
                    height: 100%;
                    border: 0;
                }
            }
        }
        .module-title {
            margin: 0rem 0.2rem;
            padding-top: 0.1rem;
            font-size: 0.32rem;
            color: #000000;
            font-weight: 800;
        }
        .competition {
            display: flex;
            justify-content: space-between;
            margin: 0.2rem;
        }
        .pk {
            box-sizing: border-box;
            height: 2rem;
            width: calc(50% - 0.1rem);
            border-radius: 8px;
            padding: 0.3rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            .name {
                .title {
                    margin-bottom: 0.2rem;
                    font-size: 0.32rem;
                    font-weight: 500;
                    color: #ffffff;
                }
                .subheading {
                    font-size: 0.26rem;
                    font-weight: 400;
                    color: #ffffff;
                }
            }
            .icon {
                height: 100%;
                //width: 100%;
                text-align: right;
                img {
                    //width: 100%;
                    height: 100%;
                    border: 0;
                }
            }
        }
        .three-pk {
            background-image: url(../../assets/img/answer/three-pk.png);
        }
        .double-pk {
            background-image: url(../../assets/img/answer/double-pk.png);
        }
        .each-achievement{
            margin: 0.2rem 0.2rem 0;
            display: flex;
            background-color: #ffe2dc;
            border-radius: 0.6rem;
            line-height: 0.75rem;
            li{
                width: 25%;
                text-align: center;
            }
        }
        .selected{
            background-color: #fe6e51;
            border-radius: 0.6rem;
            color: #ffffff;
        }
        .transcript{
            margin: 0 0.2rem;
            min-height: 2rem;
            padding-bottom: 0.3rem;
            .row{
                width: 100%;
                border-bottom: 1px solid #ccc;
                img{
                    width: 0.4rem;
                    height: 0.36rem;
                    transform: translateY(25%);
                }
            }
            span{
                width: 22%;
                line-height: 1rem;
                display: inline-block;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:nth-child(1) {
                    width: 10%;
                }
                &:nth-child(2) {
                    width: 44%;
                    text-align: left;
                    padding-left: 10%;
                }
                &:nth-child(3) {
                    width: 10%;
                }
                &:nth-child(4) {
                    width: 36%;
                }
            }
            // .useName{
            //     padding-left: 10%;
            //     text-align: left;
            // }
        }
    }
}
</style>
