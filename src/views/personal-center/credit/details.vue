<template>
    <div>
        <img :src="detail.img" alt="">
        <p class="integral">{{detail.integral}}积分</p>
        <p class="name"><span>商品: </span>{{detail.name}}</p>
        <p class="brief"><span>商品简介: </span> {{detail.brief}}</p>
    </div>
</template>
<script>
export default {
    data(){
        return{
            detail: {
                img: 'https://img2.baidu.com/it/u=2664068708,3692726148&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=736',
                name: '腾讯大网卡',
                brief: '腾讯王卡月租仅29元，月享30G专属流量不限速；玩游戏、刷朋友圈、看视频通通享专属流量；近200款腾讯APP享专属流量畅玩无忧;全国无漫游,亲情号免费打，赠来电显示；不限速高速上网；全国免费送货上门。立即在线申请，即可免费加入王卡会员，还有多项特权等您来领取！',
                integral: 50
            }
        }
    },
    created(){
        console.log(this.$route.query);
    }
}
</script>
<style lang="less" scoped>
    img{
        width: 7.5rem;
        height: 7.92rem;
    }
    p{
        margin: 0.25rem 0 0.08rem 0.3rem;
        font-size: 0.38rem;
        span{
            font-size: 0.45rem;
            font-weight: 600;
            color: #323232;
        }
    }
    .integral{
        font-size: 0.4rem;
        font-weight: 500;
        color: #FA5F25;
    }
    // .name{
    //     font-size: 0.45rem;
    //     font-weight: 600;
        
    // }
    .brief{
        line-height: 0.8rem;
        padding-right: 0.3rem;
    }
</style>