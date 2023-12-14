<template>
   <div class="article-list-page">
      <div v-if="layout === 'mould0'" class="mould-0">
            <h2>{{moduleName}}</h2>
            <van-pull-refresh v-model="loading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <van-cell class="title" @click="goArticle(content.contentId)" v-for="(content, j) in listData" :key="j">
                        <p>{{content.title}}</p>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
      </div>
      <div v-else-if="layout === 'mould1'" class="mould-1">
        <h2>{{moduleName}}</h2>
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell class="info" @click="goArticle(content.contentId)" v-for="(content, j) in listData" :key="j">
                    <div class="rich">
                        <div class="title">{{content.title}}</div>
                        <div class="sub">
                            <span class="source">{{content.source}}</span>
                            <span class="time">{{getDate(content.publishDt)}}</span>
                        </div>
                    </div>
                    
                    <img :src="selectCover(content)" alt="">
                </van-cell>
            </van-list>
        </van-pull-refresh>
      </div>
      <div v-else-if="layout === 'mould2'" class="mould-2">
        <h2>{{moduleName}}</h2>
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell class="info">
                    <template v-if="type === 'RADIO'">
                        <template v-for="(content, j) in listData">
                            <div class="rich"  @click="goArticle(content.contentId, content.label)" :key="j" v-if="content.label === '图书' || content.label === '图书book'">
                                <img :src="content.cover" alt="">
                                <div class="title">{{content.title}}</div>
                            </div>
                        </template>
                        <div class="division"></div>
                        <template v-for="(content, j) in listData">
                            <div class="rich"  @click="goArticle(content.contentId, content.label)" :key="j" v-if="content.label === '课程'">
                                <img :src="content.cover" alt="">
                                <div class="title">{{content.title}}</div>
                            </div>
                        </template>
                        <div class="division"></div>
                        <template v-for="(content, j) in listData">
                            <div class="rich"  @click="goArticle(content.contentId, content.label)" :key="j" v-if="content.label === '影视'">
                                <img :src="content.cover" alt="">
                                <div class="title">{{content.title}}</div>
                            </div>
                        </template>
                        
                    </template>
                     <template v-else>
                            <div class="rich"  @click="goArticle(content.contentId, content.label)" v-for="(content, j) in listData" :key="j">
                                <img :src="content.cover" alt="">
                                <div class="title">{{content.title}}</div>
                            </div>
                        </template>
                </van-cell>
            </van-list>
        </van-pull-refresh>
      </div>
      <div v-else-if="layout === 'mould3'" class="mould-3">
        <h2>{{moduleName}}</h2>
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell class="info">
                    <div class="rich"  @click="goArticle(content.contentId)" v-for="(content, j) in listData" :key="j">
                        <img :src="content.thumbs?content.thumbs[0].url:content.cover" alt="">
                        <div class="title">{{content.title}}</div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import * as dayjs from 'dayjs';
import native from '../../plugins/native';
import {
    getCurrentUrl
} from "@/plugins/config";
const axiosConfig = {
    timeout: 5 * 1000, // 超时时间五秒
    withCredentials: false, // Check cross-site Access-Control
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "deviceId": "123"
    },
    baseURL: "/"
};
import { jiaoyuziliao } from './data.js'

const http = axios.create(axiosConfig);
export default {
    data() {
        return {
            uuid: '',
            layout: this.$route.query.layout,
            contentId: this.$route.query.contentId, // 栏目ID
            contentName: this.$route.query.contentName,
            moduleId: this.$route.query.moduleId, // 分组ID
            moduleName: this.$route.query.moduleName,
            type: this.$route.query.type,
            listData: [],
            loading: false,//加载状态
            finished: false,//是否加载
            page: {
                pageSize: 30,
                pageNum: 1,
            },
            deviceId: '', // 设备ID
        }
    },
    mounted() {
        this.uuid = native.getUserInfo.guid,
        this.layout = this.$route.query.layout,
        this.contentId = this.$route.query.contentId, // 栏目ID
        this.contentName = this.$route.query.contentName,
        this.moduleId = this.$route.query.moduleId, // 分组ID
        this.moduleName = this.$route.query.moduleName,
        this.type = this.$route.query.type,
        this.deviceId = native.getDeviceInfo.deviceId;
        this.initData()
    },
    methods: {
       async initData() {
           let url = '';
           let params = {};
           if(this.type === 'ARTICLE') {
                console.log('this.moduleName--', this.moduleName);
                url = `${getCurrentUrl('taike')}/api/content/topic/contentList/page2`;
                params = {
                    contentId: this.contentId,
                    moduleId: this.moduleId,
                    current: this.page.pageNum,
                    size: this.page.pageSize

                };
               
           }else if(this.type === 'COURSE') {
               url = `${getCurrentUrl('app')}/course-app/party/getPartyLibrary`;
               params = {
                    contentId: this.contentId,
                    moduleId: this.moduleId,
                    guid: this.uuid,
                    pageNum: this.page.pageNum,
                    pageSize: this.page.pageSize

                };
           }else if(this.type === 'RADIO') {
               /* url = `${getCurrentUrl('app')}/cms-app/culture/queryArticleProjectGroup`;
               params = {
                    contentId: this.contentId,
                    moduleId: this.moduleId,
                    type: 'radio',
                    guid: this.uuid,
                    pageNum: this.page.pageNum,
                    pageSize: this.page.pageSize

                }; */
                // 扁平化处理
                let data = []
                jiaoyuziliao.forEach((ele, index) => {
                    // data.push(ele.)
                    if(ele.module !== '学习图书') {
                        ele.data.forEach((e, i) => {
                        data.push(e)
                    })
                    }
                })
                console.log(data)
                this.listData = data;
                this.loading = false;
                this.finished = true;
                return
           }else if(this.type === 'SUBJECT') {
                this.listData = [
                    {
                        contentId: '653951a3540b47d087f6740aa0174e85',
                        title: '学习习近平强军思想',
                        cover: 'https://cms-cdn.81.mil.cn/img/20220415/321d5a84a4b1435b9c34be56c48104a2.png'
                    },
                    {
                        contentId: 'd075d1b13c8347f1b1c86ef3c03e2380',
                        title: '维护核心 听从指挥',
                        cover: 'https://cms-cdn.81.mil.cn/img/20220415/90e3d0d487824ca58f7e69d2a0eb649f.png'
                    },
                        {
                        contentId: '6fa98cd9e8474c11b5316d692c217078',
                        title: '奋进新征程 建功新时代',
                        cover: 'https://cms-cdn.81.mil.cn/thumbnail/20220221/c18b27c28bec47fa99d1469b4c73242c.png'
                    },
                        {
                        contentId: '7f54ac54ec8d43639dd674c3e1fc419d',
                        title: '喜迎党的二十大',
                        cover: 'https://cms-cdn.81.mil.cn/img/20220415/2ef8795f82554466a70184b5dea64f47.png'
                    }
                ]
                this.loading = false;
                this.finished = true;
                return
           }
           let res = {};
           if(this.type === 'ARTICLE') {
               res = await http.get(url, 
                    {
                        params
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "deviceId": this.deviceId
                        },
                        baseURL: "/"
                    }
                );

           }else {
                res = await this.$axios.get(url, 
                    {
                        params
                    }
                );
           }

            const {code, msg, data} = res.data;
            if(code === 0 || code === 1000) {
                if(this.type === 'ARTICLE') {
                    this.listData = this.listData.concat(data.records);//追加数据
                }else {
                    this.listData = this.listData.concat(data.list);//追加数据
                }
                this.loading = false; // 加载状态结束
                if(this.type === 'ARTICLE' && !data.records.length || this.type !== 'ARTICLE' && !data.list.length) {
                    this.finished = true;
                }else{
                    this.finished = false;
                }        
            }else {
                this.$message.error(msg);
            }
       },
       onLoad() {
           this.page.pageNum += 1;
           this.initData();
       },
       /**
         * 转换时间
         */
        getDate(time) {
            return dayjs(time).format('YYYY-MM-DD');
        },
        onRefresh() {
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.onLoad();
        },
        // 点击文章详情
        /**
         * id: 文章id
         */
        goArticle(id, label) {
            console.log('id: ', id)
            console.log('label: ', label)

            let path = '';
            if(this.type === 'ARTICLE') {
                path = `xxqj://tkNews?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            }else if(this.type === 'COURSE'){
                path = `xxqj://course?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            }else if(this.type === 'RADIO'){
                if(label === '图书') {
                    path = `xxqj://bookAudio?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                }else if(label === '图书book') {
                    path = `xxqj://book?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                }else if(label === '影视') {
                    path = `xxqj://movie?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                }else if(label === '课程') {
                    path = `xxqj://course?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                }
            }else if(this.type === "SUBJECT") {
                path = `xxqj://subject?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            }
            native.appJump(path);
        },
        // 部署要求图片
        selectCover(content) {
            let cover = content.thumbs && content.thumbs.length? content.thumbs[0].url : content.pictures[0].url
            return cover;
        }
    }
};
</script>
<style lang="less" scoped>
.article-list-page {
    padding: 0.3rem 0.28rem;
}
h2 {
    font-size: .32rem;
    margin: 0 0 .3rem 0;
}
.mould-0 {
    .title {
        display: flex;
        align-items: center;
        font-size: .28rem;
        color: #494949;
        padding: .18rem .18rem .18rem 0;
        line-height: 1.4;

        &::before {
            content: '';
            display: block;
            width: .1rem;
            height: .1rem;
            border-radius: 100%;
            background: #cdcdcd;
            margin-right: .2rem;
            flex-shrink: 0;
        }
    }
}
.mould-1 {
    .info {
        padding-top: .2rem;
        padding-bottom: .3rem;
        border-bottom: 1px solid #e1e1e1;
        .van-cell__value {
            display: flex;
        }
        img {
            width: 2.14rem;
            height: 1.2rem;
            border-radius: 2px;
        }

        &:last-of-type {
            border-bottom: none;
        }
        .rich {
            flex: 1;
        }

        .title {
            font-size: .3rem;
            line-height: .38rem;
            color: #323232;
            margin-bottom: .26rem;
        }

        .source {
            font-size: .22rem;
            margin-right: .3rem;
            color: #8b8b8b;
            line-height: 1;
        }

        .time {
            font-size: .22rem;
            color: #8b8b8b;
            line-height: 1;
        }
    }
}
.mould-2 {
    .info {
        padding-top: .2rem;
        .van-cell__value {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            flex-wrap: wrap;
        }
        img {
            width: 100%;
            border-radius: 2px;
            margin-bottom: .2rem;
        }
        .rich {
            width: 3.1rem;
        }

        .title {
            font-size: .26rem;
            line-height: 1.1;
            color: #323232;
            margin-bottom: .3rem;
            text-align: center;
        }
        .division {
            width: 100%;
            border: 1px solid #f8f8f8;
            margin-bottom: 0.2rem;
        }
    }

}
.mould-3 {
    .info {
        padding-top: .2rem;
        .van-cell__value {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            flex-wrap: wrap;
        }

        img {
            width: 100%;
            border-radius: 2px;
            margin-bottom: .2rem;
        }
        .rich {
            width: 2rem;
        }

        .title {
            font-size: .26rem;
            line-height: 1.1;
            color: #323232;
            margin-bottom: .3rem;
            text-align: center;
        }
    }

}
.mould-2 .title,
.mould-3 .title {
    display:-webkit-box;/**对象作为伸缩盒子模型展示**/
    -webkit-box-orient:vertical;/**设置或检索伸缩盒子对象的子元素的排列方式**/
    -webkit-line-clamp:2;/**显示的行数**/
    overflow:hidden;/**隐藏超出的内容**/
}
</style>
