<template>
    <div class="answerExplain">
        <div class="head">
            <div class="back item" @click="back">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="txt item">使用说明</div>
            <div class="btn item"></div>
        </div>
        <div class="wrapper">
            <p style="textAlign: center;fontWeight: 500;fontSize: 0.32rem;lineHeight: 1.2rem;">作业式教育专栏“学习先锋”</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亲爱的战友们，你现在看到的是作业式教育模式“学习先锋”答题专栏。它是集时事政治、军事科技、历史文化等内容于一身的百宝箱，它能让你在问答与互动中学习理论、开拓视野、增长才干。来吧，展现你最强大脑的时刻到了！</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“学习先锋”包括有问必答、挑战自我和对抗竞赛三种答题模式。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">一、有问必答。</span>在打开“学习强军”的同时，你就已打开了“学习先锋”的海量题库。每月<span style="fontWeight: 500;">&nbsp;1&nbsp;</span>日，“学习先锋”专栏会在“学习强军”主页推送本月学习内容和作业习题，附赠参考答案哦。答对一题得<span style="fontWeight: 500;">&nbsp;5&nbsp;</span>分！如果你还没有准备充分，那就点击“学习”按钮，进入相应专题，开启自学之旅吧；如果你还没有准备好答题的心情，没关系，点击“忽略”按钮吧，但只有<span style="fontWeight: 500;">&nbsp;5&nbsp;</span>次机会哦。之后“学习先锋”会牢牢锁定你，直到你答题完毕，再从你的视线里消失。如果你仍想继续学习，可以在“学习强军”首页找到它。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">二、挑战自我。</span>这是对你知识储备的考验，这里有很多你意想不到的难题。系统随机精选<span style="fontWeight: 500;">&nbsp;20&nbsp;</span>道题，不限定答题时间，每答对<span style="fontWeight: 500;">&nbsp;1&nbsp;</span>题得<span style="fontWeight: 500;">&nbsp;1&nbsp;</span>分。答对继续，答错离场；如再挑战，需重新开始。快来看看你能闯到多少关吧！</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">三、对抗竞赛。</span>主要分双人对抗和三人竞赛。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: bold;fontFamily: cursive;">1．双人对抗。</span>点击空位邀请<span style="fontWeight: 500;">&nbsp;1&nbsp;</span>名好友或用户（随机）参与对战，擂主具备开局权限。每次<span style="fontWeight: 500;">&nbsp;25&nbsp;</span>道题，每题答对加<span style="fontWeight: 500;">&nbsp;5&nbsp;</span>分，答错不减分，优先获得<span style="fontWeight: 500;">&nbsp;100&nbsp;</span>分即为胜利。每局比赛最多<span style="fontWeight: 500;">&nbsp;10&nbsp;</span>分钟，<span style="fontWeight: 500;">&nbsp;10&nbsp;</span>分钟内无选手到达<span style="fontWeight: 500;">&nbsp;100&nbsp;</span>分则全部失败。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: bold;fontFamily: cursive;">2．三人竞赛。</span>每组由系统随机匹配在线用户<span style="fontWeight: 500;">&nbsp;3&nbsp;</span>人，匹配成功开始作答。每次<span style="fontWeight: 500;">&nbsp;25&nbsp;</span>道题，每题答对加<span style="fontWeight: 500;">&nbsp;5&nbsp;</span>分，答错不减分，优先获得<span style="fontWeight: 500;">&nbsp;100&nbsp;</span>分即为胜利。每局比赛最多<span style="fontWeight: 500;">&nbsp;10&nbsp;</span>分钟，<span style="fontWeight: 500;">&nbsp;10&nbsp;</span>分钟内无选手到达<span style="fontWeight: 500;">&nbsp;100&nbsp;</span>分则全部失败。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答题积分将进行综合排名并适时更新，每名用户都能看到个人全网排名情况。</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;还等什么，学霸们速速集结吧！</p><br/>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;温馨提示：手机故障、网络不佳等异常情况会影响答题得分和排名，建议答题前检查手机设备并在良好的网络环境下参与答题。</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    mounted() {
    },
    async created() {
    },

    methods: {
        back() {
            this.$router.back();
        },
    },
};
</script>

<style lang="less" scoped>
.answerExplain {
    height: 100vh;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        background: #ffffff;

        /* position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 90; */

        .txt {
            margin-left: -20px;
            font-size: 0.32rem;
            font-weight: spaner;
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
        padding: 0rem 0.3rem 0.3rem;
        background: #f5f5f5;
        height: calc(100% - 1.12rem);
        overflow-y: auto;
    }
}
</style>
