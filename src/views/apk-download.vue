<template>
    <div class="down">
        <div class="btn-position">
            <div class="btn" @click="click"><img src="../assets/icon_android.png" alt="">安卓下载<img src="../assets/download_arrow.png" alt=""></div>
            <div v-if="!isdownload" class="down-tip">{{ downTip }}</div>
        </div>
        <van-overlay :show="show">
            <div class="wrapper">
                <i class="iconfont icon-shou"></i>
                <h2 class="block">
                    1、点击右上角设置按钮<br />
                    <br />
                    2、选择在浏览器中打开
                </h2>
            </div>
        </van-overlay>
    </div>
</template>

<script>
import { baseConfig } from '@/config/common.js'
const { SERVER_DOMIN } = baseConfig

export default {
    data() {
        return {
            show: false,
            codeID: this.$route.query.codeID, //Object.prototype.hasOwnProperty.call(this.$route.query, "codeID")? this.$route.query.codeID : 0,
            //downloadUrlD: 'https://appresource.81.mil.cn/cms/file/20210721/94b97a4ef5384c778adf7e62088d9d55.apk',
            downloadUrl: '',
            isdownload: true, // 是否获取到有效下载地址
            downTip: '', // 下载失效错误提示
        };
    },
    mounted() {
        this.getDownloadUrl();
    },
    methods: {
        async getDownloadUrl() {
            const res = await this.$axios.get(`${SERVER_DOMIN}/cms-app/apk/download?uuid=${this.codeID}`);
            const {code, msg, data} = res.data;
            if (code === 1000) {
                this.downloadUrl = data.downloadUrl;
            }else {
                this.downTip = msg;
                this.$toast.fail(msg);
            }
        },
        click() {
            if (this.isWX) {
                this.show = true;
                return;
            }
            let a = document.createElement("a");
            if(!this.downloadUrl.length) {
                this.isdownload = false;
                return;
                //this.downloadUrl = this.downloadUrlD;
            }
            a.href = this.downloadUrl;
            a.download = this.downloadUrl;
            a.click();
        }
    },
    computed: {
        isWX() {
            const ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == "micromessenger";
        }
    }
};
</script>

<style lang="less" scoped>
.down {
    position: relative;
    background: url(../assets/download.jpg) no-repeat;
    background-size: 100% 100%;
    height: 100vh;
    .btn-position {
        width: 100%;
        position: absolute;
        top: 64%;
        text-align: center;
    }
    .btn {
        width: 56%;
        margin: 0 auto;
        color: #001d92;
        font-size: 22px;
        border-radius: 8px;
        background: #fff;
        padding: 8px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .down-tip {
        margin-top: 10px;
        color: #646566;
    }
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.block {
    color: #fff;
    padding: 20px;
    border: 2px dashed #fff;
}

.icon-shou {
    font-size: 46px;
    color: #fff;
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>
