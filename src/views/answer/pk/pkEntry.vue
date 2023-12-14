<template>
    <div class="pkEntry">
        <div class="bg">
            <div class="head">
                <div class="back item" @click="back">
                    <van-icon name="arrow-left" size="20" />
                </div>
                <div class="back item"></div>
                <div class="back item" @click="openRule">竞赛规则 </div>
            </div>
            <div class="avatWrapper">
                <div class="avat">
                    <img :src="portraitUri" alt="" />
                </div>
                <div class="name">{{ nickname }}</div>
            </div>

            <div class="pointWrapper">
                <div class="point">我的积分：{{ point }}</div>
                <div class="text">
                    今日积分奖励局 {{ alreadyGet }}/{{ cloudGet }}
                </div>
            </div>

            <div class="btn" @click="goMatch">
                <img :src="start" alt="" />
            </div>
        </div>
        <div class="rankList">
            <div class="listHead">
                <span class="icon">结果</span>
                <span class="item">成绩</span>
                <span class="item other">正确/答题数</span>
                <span class="item">时间</span>
            </div>
            <div class="ListMain" v-if="list.length">
                <div
                    class="listItem"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <span class="item icon">
                        <img :src="vl" alt="" v-if="item.win" />
                        <img :src="fl" alt="" v-else />
                    </span>
                    <span class="item">{{ item.suc }}</span>
                    <span class="item other">{{ item.err }}</span>
                    <span class="item">{{ item.time }}</span>
                </div>
            </div>
            <div class="ListMain" v-else>
                <div class="noListMain">
                    <div class="noList">
                        <img :src="nolist" alt="" />
                    </div>
                    <div class="text">今天还未参加竞赛</div>
                </div>
            </div>
        </div>
        <van-popup v-model="ruleShow" :round="true">
            <div class="rlueBox">
                <div class="rluehead">
                    <span>竞赛规则</span>
                    <span class="close" @click="closeRule">X</span>
                </div>
                <div class="rlueOne">
                    <div>竞赛规则：</div>
                    <div>1.点击开始比赛，随机匹配用户一名用户参与比。</div>
                    <div> 2.每题答对+20分，答错不减分，优先获得100分即为胜利。</div>
                    <div>3.每局用户比赛结束，方可生成答题记录，中途退出提前结束的用户可以在比赛结束后查看答题记录。</div>
                    <div>4.每日首局获胜获得2分积分，失败积一分，仅限首局有积分。</div>
                    <!-- <div>4.每赢一局积5分，每日上限10分。</div> -->
                </div>
                <div  class="rlueTow">
                    <div>温馨提示：</div>
                    <div>用户成功匹配队友即进入答题流程，手机故障、网络不佳等异常情况影响比赛得分和积分，建议检查手机设备并在良好的网络环境下参与答题。</div>
                    
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import md5 from "md5";
// import { integrateAdd, questionRuleList } from "../../../serve/api/answer.js";
import VConsole from "vconsole";
import { todayScore, userInfo } from "../../../../serve/api/answer.js";
export default {
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            nolist: require("@/assets/img/nolist.png"),
            start: require("@/assets/img/start.png"),
            vl: require("@/assets/img/vl.png"),
            fl: require("@/assets/img/fl.png"),
            //用户信息
            nickname: "",
            portraitUri: "",
            cloudGet: "",
            alreadyGet: "",
            point: "",
            ruleShow: false,
        };
    },
    created(){
        if(window.nativeHandler){
            window.sysBack = this.sysBack
            window.nativeHandler.execute('interceptSysBack', 'true', null);
        }
    },
    async mounted() {
        const res = await todayScore({
            uuid: this.$route.query.uuid,
        });
        if (res.data.code == 1000) {
            let _list = res.data.data.map((item) => {
                return {
                    win: item.win,
                    suc: item.score,
                    err: `${item.correctNum}/${item.totalNum}`,
                    time: this.formateTime(item.spendTime),
                };
            });
            this.list = _list;
        }

        const user = await userInfo({
            uuid: this.$route.query.uuid,
        });
        if (user.data.code == 1000) {
            this.portraitUri = user.data.data.portraitUri;
            this.nickname = user.data.data.nickname;
            this.point = user.data.data.point;
            this.cloudGet = user.data.data.cloudGet;
            this.alreadyGet = user.data.data.alreadyGet;
        }
    },
    methods: {
        sysBack(){
            this.back()
        },
        openRule() {
            this.ruleShow = true
        },
        closeRule() {
            this.ruleShow = false
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
        back() {
            this.$router.push({
                path: "/answer/entry",
                query: { uuid: this.$route.query.uuid },
            });
        },
        goMatch() {
            this.$router.push({
                path: "/answer/pk/pkmain",
                query: { uuid: this.$route.query.uuid },
            });
        },
    }
};
</script>

<style lang="less" scoped>
.pkEntry {
    background: #f5f5f5;
    height: 100vh;
    overflow: auto;
    .bg {
        height: 9rem;
        background: linear-gradient(315deg, #3c00d9 0%, #f559ff 100%);
        background-image: url(../../../assets/img/pklistbg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 1.12rem 0;
        .head {
            padding: 0 0.2rem;
            display: flex;
            justify-content: space-between;
            height: 1.12rem;
            line-height: 1.12rem;
            margin-bottom: 0.2rem;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 90;
            color: #fff;
        }
        .avatWrapper {
            color: #fff;
            .avat {
                margin: 0 auto;
                width: 2rem;
                height: 2rem;
                border: 2px solid rgba(255, 142, 46, 1);
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                font-size: 0.4rem;
                font-weight: 500;
                text-align: center;
                margin-top: 0.2rem;
            }
        }

        .pointWrapper {
            color: #fff;
            .point {
                text-align: center;

                width: 122px;
                height: 36px;
                line-height: 36px;
                background: linear-gradient(
                    270deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 55%,
                    rgba(255, 255, 255, 0) 100%
                );
                border-radius: 4px;
                border: 1px solid;
                border-image: linear-gradient(
                        270deg,
                        rgba(255, 120, 139, 0),
                        rgba(255, 255, 255, 1),
                        rgba(255, 121, 139, 0)
                    )
                    1 1;
            }
            .text {
                font-size: 0.24rem;
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
                margin-top: 0.1rem;
            }
        }
        .btn {
            width: 80%;
        }
    }
    .rankList {
        background: #fff;
        margin: 0.4rem 0.4rem 0 0.4rem;
        border-radius: 10px;
        .listHead {
            height: 0.8rem;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: rgba(164, 164, 164, 1);
            .item {
                min-width: 1rem;
                // border: 1px solid red;
                text-align: center;
            }
            .other {
                width: 2rem;
            }
            .icon {
                width: 0.9rem;
                text-align: center;
            }
        }
        .ListMain {
            .listItem {
                display: flex;
                justify-content: space-around;
                height: 0.6rem;
                color: #233333;
                font-size: 0.24rem;
                .item {
                    // border: 1px solid blue;
                    width: 1rem;
                    text-align: center;
                }
                .other {
                    width: 2rem;
                }
                .icon {
                    margin: 0 10px;
                    width: 0.54rem;
                    height: 0.32rem;
                    img {
                        height: 100%;
                        width: 100%;
                    }
                }
            }
            .noListMain {
                height: 6rem;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                .noList {
                    height: 1.88rem;
                    width: 3.6rem;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    margin-top: 0.3rem;
                    color: #a4a4a4;
                }
            }
        }
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
            color:rgba(35, 51, 51, 1);
            font-size: 0.24rem;
            margin: 10px 0;
        }
        .rlueTow {
            color:rgba(164, 164, 164, 1);
            font-size: 0.24rem;
            ;
        }
    }
}
</style>
