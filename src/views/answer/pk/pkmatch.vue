<template>
    <div class="pkamtch">
        <div class="bg">
            <div class="head">
                <div class="back item" @click="cancel">
                    <van-icon name="arrow-left" size="20" />
                </div>
            </div>
        </div>
        <div class="rote">
            <img :src="icon" alt="" />
        </div>
        <div class="textW">
            <div class="time">{{time}}</div>
            <div class="text">匹配中...</div>
        </div>
        <div class="tip">
            <div>小贴士</div>
            <div>
                1942年8月至12月，山东军区主力部队在日照地方武装和热情群众的支持下，先后发动了三次甲子山反顽战役。第三次甲子山反顽战役是由八路军第一一五师政治委员罗荣桓、代师长陈光、山东分局书记朱瑞亲自坐镇指挥。
            </div>
            <div>
                ——《中国共产党山东省日照市历史》（第一卷），中共党史出版社2017年版
            </div>
        </div>

        <div class="pass" @click="cancel">取消匹配</div>
    </div>
</template>
<script>
export default {
    props:{
        time:{
            default:'00'
        }
    },
    data() {
        return {
            icon: require("@/assets/img/rote.png"),
        };
    },
    methods: {
        cancel() {
            this.$emit('matchcancel')
            // this.$router.push({
            //     path: "/answer/pk/pkmain",
            //     query: { uuid: this.$route.query.uuid },
            // });
        },
    },
};
</script>

<style lang="less" scoped>
.pkamtch {
    background: #f5f5f5;
    height: 100vh;
    background: linear-gradient(315deg, #3c00d9 0%, #f559ff 100%);

    .bg {
        height: 1.12rem;
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
            color: #ffffff;
        }
    }
    .rote {
        height: 5.16rem;
        width: 5.16rem;
        margin: 0 auto;
        animation: mymove 2s linear infinite;
        img {
            width: 100%;
            height: 100%;
        }
        @keyframes mymove {
            from {
                transform: rotate(0);
            }
            to {
                transform: rotate(360deg);
            }
        }
    }
    .textW {
        width: 100%;
        margin: 0 auto;
        color: #fff;
        position: absolute;
        top:3.16rem;
        // left: %;
        text-align: center;
        .time {
            font-size: 0.3rem;
        }
        .text {
            margin-top: 0.1rem;
            font-size: 0.7rem;
            font-family: "YouSheBiaoTiHei";
        }
    }
    .tip {
        font-size: 0.24rem;
        height: 3.8rem;
        width: 6rem;
        margin: 1.12rem auto;
        color: #ffffff;
        border-radius: 8px;
        background: linear-gradient(
            315deg,
            rgba(255, 252, 246, 0.1) 0%,
            rgba(255, 255, 255, 0.1) 100%
        );
        box-shadow: 0px 0px 12px 0px rgba(196, 196, 196, 0.2);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.3rem;
        align-items: center;
        line-height: 0.36rem;
    }
    .pass {
        text-align: center;
        width: 100px;
        margin: 0 auto;
        color: #ffffff;
        font-size: 0.24rem;
    }
}
</style>