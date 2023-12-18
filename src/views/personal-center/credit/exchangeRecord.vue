<template>
    <div>
        <ul v-if="recordList.length">
            <li v-for="(item,index) in recordList" :key="index">
                <div class="left">
                    <img :src="item.product_pic" alt="">
                    <div class="middle">
                        <p>{{ item.product_name }}</p>
                        <p>使用积分：{{item.convert_eb}}</p>
                    </div>
                </div>   
                <p>{{item.create_time | getTime}}</p>
            </li>
        </ul>
        <div class="empty" v-else>
            <div class="nothing">
                <img :src="emptyImg" alt="">
                <p>暂无数据</p>
            </div>
        </div>
    </div>
</template>
<script>
import { exchangeHistory } from '../../../../serve/api/integral'
export default {
    data(){
        return{
            recordList: [],
            emptyImg: require('@/assets/编组 4.png')
        }
    },
    async created(){
        const res = await exchangeHistory({
          userId: window.localStorage.getItem("uuid"),
          startTime: '',
          endTime: '',
          productName: '',
          pageSize: 10,
          pageNum: 1
        })
        let {data} = res.data
        // console.log(JSON.parse(data));
        const arr = JSON.parse(data).response.body.userproList.userproVo.length ? JSON.parse(data).response.body.userproList.userproVo : [JSON.parse(data).response.body.userproList.userproVo]
        this.recordList = arr
    },
    filters: {
        getTime(time){
            let date = new Date(time)
            let y = date.getFullYear()
            let m = date.getMonth()+1
            let d = date.getDate()
            let h = date.getHours()
            let minute = date.getMinutes()
            return `${ y }-${ ('0' + m).length > 2 ? m : '0' + m }-${ ('0' + d).length > 2 ? d : '0'+d } ${ ('0' + h).length > 2 ? h : '0'+h}:${ ('0' + minute).length > 2 ? minute : '0'+ minute }`
        }
    }
}
</script>
<style lang="less" scoped>
    li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.5rem;
        margin: 0.3rem 0.2rem 0;
        padding: 0.1rem 0.2rem;
        border: 1px solid #ccc;
        border-radius: 0.05rem;
        .left{
            width: 3.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        img{
            width: 1.2rem;
            height: 1.3rem;
            border-radius: 0.03rem;
        }
        .middle{
            line-height: 0.5rem;
        }
    }
    .empty{
        text-align: center;
        width: 3rem;
        height: 1.3rem;
        margin: auto;
        height: 100vh;
        position: relative;
        .nothing{
            position: absolute;
            top: 45%;
            transform: translateY(-50%);
            width: 100%;
        }
        img{
            width: 1.8rem;
        }
        p{
            line-height: 1.5rem;
            font-size: 30px;
            color: #B3B3B3;
            text-align: center;
            font-weight: 500;
        }
    }
</style>