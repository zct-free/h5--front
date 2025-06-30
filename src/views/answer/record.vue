<template>
    <div class="answerRecord">
        <div class="head">
            <div class="back item" @click="back">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="txt item">答题记录</div>
            <div class="btn item"></div>
        </div>
        <div class="wrapper">
            <div class="timeWrapper">
                <div class="mount">
                    <span class="blod">{{ month }}</span>
                    <span>月</span>
                </div>
                <div class="num">获得积分 {{ allPointCount }}</div>
            </div>
            <div class="listWrapper">
                <div
                    class="listItem"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <div class="icon">
                        <img :src="item.icon" />
                    </div>
                    <div class="content">
                        <div class="text">
                            <div class="title">{{ item.title }}</div>
                            <div class="subheading">
                                {{ item.correctNum }}/{{ item.questionNum }}题
                                {{ item.createTime | getTime }}
                            </div>
                        </div>
                        <div class="chicken">
                            <div class="text" v-if="item.upperLimit || (!item.upperLimit && item.isFirst == false && item.ruleType =='DAILY')">
                                <div class="one">+{{item.points}}</div>
                                <div class="tow">积分领取已达上限</div>
                            </div>
                            <div class="text" v-else-if="!item.upperLimit && item.isFirst == false && item.ruleType !='DAILY'">
                                <div class="one">+{{item.points}}</div>
                                <div class="tow">已领取积分</div>
                                
                            </div>
                            <div class="text" v-else>+{{ item.points }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { questionRuleGet } from "../../../serve/api/answer.js";
import VConsole from "vconsole";
export default {
    data() {
        return {
            list: [
                // {
                //     typeName: "每日答题", //答题规则名
                //     questionNum: 0, //总题量
                //     correctNum: 0, //答对数量
                //     points: 0, //获得积分
                //     createTime: 12312323, //创建时间,
                //     icon: require("@/assets/img/day2.png"),
                // },
            ],
            icon: require("@/assets/img/day2.png"),
            dayIcon: require("@/assets/img/day.png"),
            weekIcon: require("@/assets/img/week.png"),
            specialIcon: require("@/assets/img/special.png"),
            allPointCount: 0,
            month: 1,
        };
    },
    filters: {
        getTime(time) {
            const _time = new Date(time);
            let d = _time.getDate();
            let M = _time.getMonth() + 1;
            let h = _time.getHours();
            let m = _time.getMinutes();

            if (d.toString().length == 1) {
                d = "0" + d;
            }
            if (M.toString().length == 1) {
                M = "0" + M;
            }
            if (h.toString().length == 1) {
                h = "0" + h;
            }
            if (m.toString().length == 1) {
                m = "0" + m;
            }
            return `${M}-${d} ${h}:${m}`;
        },
    },
    mounted() {
        const env = process.env.NODE_ENV;
        if (env !== "k8sproduction") {
            let vConsole = new VConsole();
        }
    },
    async created() {
        let uuid = this.$route.query.uuid;
        const res = await questionRuleGet({
            uuid: uuid,
        });

        if (res.data.code === 1000) {
            this.allPointCount = res.data.data.allPointCount;
            this.list = res.data.data.histories;

            this.list.forEach((item) => {
                let icon;
                if (item.ruleType == "DAILY") {
                    icon = this.dayIcon;
                } else if (item.ruleType == "SPECIAL") {
                    icon = this.specialIcon;
                } else if (item.ruleType == "WEEKLY") {
                    icon = this.weekIcon;
                }
                item.icon = this.icon;
            });
        }
        this.month = new Date().getMonth() + 1;
    },

    methods: {
        back() {
            this.$router.back();
        },
    },
};
</script>

<style lang="less" scoped>
.answerRecord {
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
            margin-left: -20px;
            font-size: 0.32rem;
            font-weight: bolder;
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
    .wrapper {
        padding-top: 1.12rem;
        .timeWrapper {
            height: 1.6rem;
            color: #332929;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 0.2rem;
            .mount {
                font-size: 0.24rem;
                .blod {
                    font-weight: 600;
                    font-size: 0.5rem;
                }
            }
            .num {
                font-size: 0.24rem;
            }
        }
        .listWrapper {
            background: #fff;
            .listItem {
                height: 1.6rem;
                display: flex;
                padding: 0 0.2rem;
                align-items: center;
                .icon {
                    height: 0.64rem;
                    width: 0.64rem;
                }
                .content {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0.34rem;
                    .text {
                        width: 50%;

                        .title {
                            font-size: 0.32rem;
                            color: #332929;
                            height: 50%;

                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .subheading {
                            margin-top: 0.16rem;
                            font-size: 0.24rem;
                            color: #332929;
                        }
                    }
                    .chicken {
                        display: flex;
                        align-items: center;
                        line-height: 24px;
                        font-size: 0.4rem;
                        flex-direction: column;
                        width: 50%;
                        text-align: right;
                        .point {
                            width: 100%;
                            font-size: 0.3rem;
                            
                        }
                        .text {
                            width: 100%;
                            font-size: 0.3rem;
                            .tow {
                                font-size: 0.24rem;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
