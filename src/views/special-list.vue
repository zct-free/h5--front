<template>
    <div class="special">
        <!-- 头图  图片样式截图，需要修改一下，设计稿 宽度 按照 750 设计 -->
        <div class="header"></div>

        <!-- 导航 -->
        <div class="nav">
            <div class="nav-item" v-for="(item, i) in navs" :key="i">
                <img src="../assets/special/icon-1.png" alt="部署要求">
                <div class="nav-title">{{item.title}}</div>
            </div>
        </div>

        <!-- 新闻内容 -->
        <div class="news">
            <div class="" v-for="(item, i) in news" :key="i">
                <!-- 文本样式 -->
                <div class="text" v-if="item.type == 'ARTICLE'">
                    <h2>{{item.moduleName}}</h2>

                    <div class="title" @click="goArticle(content.contentId)" v-for="(content, j) in item.records" :key="j">
                        <p>{{content.title}}</p>
                    </div>

                    <div class="more" @click="goArticleList(item.id)">查看全部</div>
                </div>
                
                <!-- banner样式 -->
                <div class="banner">
                    <img src="../assets/special/banner.png" />
                </div>

                <!-- 右图左文 -->
                <!-- <div class="mould-1" v-if="item.type == 'ARTICLE'">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList(item.contentId)">更多</div>
                    </div>
                    
                    <div class="title" @click="goArticle(content.contentId)" v-for="(content, j) in item.records" :key="j">
                        <p>{{content.title}}</p>
                    </div>
                </div> -->

                <!-- 教育模块 -->
                <!-- 教育模块 -->
                <!-- 教育模块 -->
                <!-- 教育模块 -->
                <!-- 教育模块 -->
            </div>
        </div>
    </div>
</template>

<script>
// import { baseConfig } from '@/config/common.js'
// const { SERVER_DOMIN } = baseConfig
import axios from 'axios';
import qs from 'qs';
import native from '../plugins/native';

const axiosConfig = {
    timeout: 5 * 1000, // 超时时间五秒
    withCredentials: false, // Check cross-site Access-Control
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "deviceId": "123"
    },
    baseURL: "/"
};

const http = axios.create(axiosConfig);

export default {
    data() {
        return {
            navs: [
                {
                    title: '部署要求',
                    icon: '',
                },
                {
                    title: '重大教育',
                    icon: '',
                },
                {
                    title: '精品课程',
                    icon: '',
                },
                {
                    title: '实践活动',
                    icon: '',
                },
                {
                    title: '创新成果',
                    icon: '',
                },
                {
                    title: '书视荟萃',
                    icon: '',
                }
            ],
            news: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            // http://apitikr.bonc.local/
            // http://apitikr.bonc.local1111/
            // https://cms-api.81.mil.cn/
            
            const res = await http.get(`https://cms-api.81.mil.cn/api/content/topic/contentList`, 
                {
                    params: {
                        contentId: '681d9b21a3814e00a3bab2832da2aa76'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            
            const {code, msg, data} = res.data;
            
            this.news = data.moduleContentVos;
            console.log(data)
        },

        // 点击文章详情
        /**
         * id: 文章id
         */
        goArticle(id) {
            let path = `xxqj://tkNews?id=${id}`;
            native.appJump(path);
        },

        // 点击文章详情
        /**
         * id: 专题分组id
         */
        goArticleList(id) {
            native.appJump('https://baidu.com');
        },
    },
    // computed: {
        
    // }
};
</script>

<style lang="less" scoped>
.special {
    background: #f6f6f6;
}
.header {
    height: 3.4rem;
    background: url('../assets/special/header.png') no-repeat;
    background-size: 100%;
}

.nav {
    box-shadow: 0px 0px 2px #ccc;
    background: #fff;
    margin: -.3rem .28rem .3rem .28rem;
    border-radius: 4px;
    padding: .35rem .35rem .15rem .35rem;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;


    .nav-item {
        width: 33%;
        text-align: center;

        img {
            width: .75rem;
            height: .75rem;
        }
    }

    .nav-title {
        height: .58rem;
        line-height: .58rem;
        font-size: .22rem;
        margin-bottom: .18rem;
    }
}

.news {
    padding: 0 .28rem;
}


.text {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0 .2rem;

    h2 {
        font-size: .3rem;
        margin: 0 0 .3rem 0;
    }

    .title {
        display: flex;
        align-items: center;
        font-size: .26rem;
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

    .more {
        border-top: 1px dashed #ececec;
        height: .8rem;
        line-height: .8rem;
        font-size: .22rem;
        margin: 0 -.2rem;
        text-align: center;
        color: #7a7a7a;

        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }
}

.banner {
    margin-bottom: .3rem;
}

.mould-1 {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0 .2rem;

    .column {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 .3rem 0;

        h2 {
            font-size: .3rem;
            margin: 0;
        }
    }

    .title {
        display: flex;
        align-items: center;
        font-size: .26rem;
        color: #494949;
        padding: .18rem .18rem .18rem 0;
        line-height: 1.4;
    }

    .more {
        font-size: .22rem;
        text-align: center;
        color: #7a7a7a;


        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }
}
</style>
