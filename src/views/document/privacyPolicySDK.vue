<template>
    <div class="privacy-policy">
        <!-- <div class="head">
            <div class="back item" @click="back">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="txt item">学习强国隐私政策</div>
            <div class="btn item"></div>
        </div> -->
        <div class="wrapper">
            <!-- <p style="textAlign: center;fontWeight: 500;fontSize: 0.32rem;lineHeight: 1.2rem;">学习强国隐私政策</p> -->
            <p style="lineHeight: 0.4rem;text-align: center;"><span style="fontWeight: 500;">学习强军APP - 涉及收集用户信息的第三方SDK列表</span></p><br/>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为保障学习强军App的稳定运行或实现相关功能，我们可能会接入由第三方提供的软件开发包（SDK）实现前述目的。我们接入的部分第三方SDK可能涉及收集用户信息，用于向用户提供服务。我们会评估该第三方收集信息的合法性、正当性、必要性，要求第三方对您的信息采取保护措施，并且严格遵守相关法律法规与监管要求。</p><br/>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了向用户提供更多服务、保证服务稳定性和质量或者升级相关功能时，我们可能需要调整我们接入的第三方SDK。我们会及时在本页面向您说明涉及收集用户信息的第三方SDK的最新情况：</p><br/>
            
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">第三方SDK来源：保利威</span></p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息用途/目的：视频展示和播放服务</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息类型：常用设备信息</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三方隐私权政策链接：<a href="https://www.meishesdk.com/protocol/cn/privacyPolicy.html">https://www.meishesdk.com/protocol/cn/privacyPolicy.html</a></p><br/>
            
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">第三方SDK来源：Bugly</span></p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息用途/目的：排查崩溃问题,帮助APP提升稳定性</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息类型：常用设备信息、网络连接信息</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三方SDK来源：<a href="https://privacy.qq.com/document/preview/fc748b3d96224fdb825ea79e132c1a56">https://privacy.qq.com/document/preview/fc748b3d96224fdb825ea79e132c1a56</a></p><br/>
            
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">第三方SDK来源：X5</span></p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息用途/目的：禁用细化控制、网络优化</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息类型：常用设备信息</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三方隐私权政策链接：<a href="https://x5.tencent.com/docs/privacy.html">https://x5.tencent.com/docs/privacy.html</a></p><br/>
            
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">第三方SDK来源：咪咕视频</span></p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息用途/目的：内容上传</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息类型：常用设备信息</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三方隐私权政策链接：<a href="https://passport.migu.cn/portal/privacy/protocol?sourceid=203005">https://passport.migu.cn/portal/privacy/protocol?sourceid=203005</a></p><br/>
            
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="fontWeight: 500;">第三方SDK来源：融云IM</span></p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息用途/目的：提高推送到达率、用于排障</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收集个人信息类型：常用设备信息</p>
            <p style="lineHeight: 0.4rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三方隐私权政策链接：<a href="https://doc.rongcloud.cn/rcloud/-/-/privacy">https://doc.rongcloud.cn/rcloud/-/-/privacy</a></p><br/>

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
        //this.clientSync.showTitle('学习强国-第三方SDK列表');
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
.privacy-policy {
    height: 100vh;
    .head {
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.12rem;
        background: #ffffff;

        .txt {
            flex: 1;
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
        padding:0.3rem;
        background: #f5f5f5;
        //height: calc(100% - 1.12rem);
        overflow-y: auto;
    }
    a {
        word-break: break-all;
    }
}
</style>
