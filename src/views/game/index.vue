<template>

   <div class="game-list-page">
    <div class="scrolling-banner" v-show="isShowTip">
        <span class="update-tip">网络游戏已于近日升级新版本，请升级新版本体验获取最新的游戏体验吧~~</span>
    </div>
      <div  @click="goDetail(content.url)" v-for="(content, j) in listData" :key="j">
            
            <div class="game-item">
                <div class="game-item-left"><img :src="content.icon"/></div>
                <div class="game-item-right">
                    <div class="game-item-show">
                        <div class="content game-item-title">{{content.title}}</div>
                        <div class="content game-item-desc">{{content.desc}}</div>
                    </div>
                </div>
                <div class="game-item-next"><span class="game-arrow"></span></div>
            </div>
                   
      </div>
      
    </div>
</template>

<script>
import { getGameList } from "../../../serve/api/game.js";

export default {
    data() {
        return {
            guid: '',
            token: '',
            listData: [],
            isShowTip: false,
        }
    },
    mounted() {
        this.guid =  this.$route.query.guid || "";
        this.token = this.$route.query.token || "";
        this.isShowTip = (this.$route.query.isShowTip && this.$route.query.isShowTip == 1) ?  true : false;
        this.initData();
    },
    methods: {
       async initData() {
            const res = await getGameList({
                guid: this.guid,
            });

            const {code, data} = res.data;
            if(code === 1000 && data && data.length) {
                this.listData = data;//此接口只有一页
            }else {
                //todo
            }
       },
        // 点击详情
        goDetail(url) {
            const sufStr = "guid=" + this.guid + "&token=" + this.token;
            // location.href =  url.indexOf('?') > -1 ? url + "&" + sufStr : url + "?" + sufStr;
            location.href = url.includes('?') ? `${url}&${sufStr}` : `${url}?${sufStr}`;
        }
    }
};
</script>
<style lang="less" scoped>
.game-list-page {
    padding: 0.2rem;
    background-color: #f5f6fa;
    .scrolling-banner {
        position: relative;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        box-sizing: border-box;
        padding: 10px;
        background-color: #FBECEC;
        color: #FB7E36;
        font-size: 0.25rem;
        line-height: 1.2;
        .update-tip {
            display: inline-block;
            padding-left: 100%;
            animation: scrollText 10s linear infinite;
        }
    }
    @keyframes scrollText {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
    }
    
    img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.2rem;
    }
    .game-item {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        border-radius: 0.2rem;
        height: 2rem;
        align-items: center;
        padding: 0.2rem;
        margin-top: 0.3rem;
        .game-item-right{
            height: 100%;
            margin-left: 0.32rem;
            flex: 1;
            .game-item-show{
                .content{
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;
                    overflow:hidden;

                    &.game-item-title{
                        color: #000;
                        font-weight: 700;
                        font-size: 0.4rem;
                    }

                    &.game-item-desc{
                        color: #545454;
                        margin-top: 0.2rem;
                        font-size: 0.25rem;
                        line-height: 0.4rem;
                    }
                }
            }
            
        }
        
        .game-item-next{
            padding: 0.1rem;
            .game-arrow{
                display: block;
                width: 0.4rem;
                height: 0.4rem;
                background: url("../../assets/img/game_jiantou_logo.webp") no-repeat;
                background-size: 120%;
            }
        }
    }
    
}

</style>
