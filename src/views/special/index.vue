<template>
    <div class="special">
        <!-- 头图  图片样式截图，需要修改一下，设计稿 宽度 按照 750 设计 -->
        <div class="header">
            <img :src="topicBanner" />
        </div>

        <!-- 导航 -->
        <div class="nav">
            <div class="nav-item" v-for="(item, i) in navs" :key="i">
                <img :src="i | getImgSrc" alt="部署要求" @click="scrollInto(i)">
                <div class="nav-title">{{item.title}}</div>
            </div>
        </div>

        <!-- 新闻内容 -->
        <div class="news">
            <div class="" v-for="(item, i) in news" :key="i">
                <!-- 文本样式 --> 
                <!-- 部署要求 -->
                <!-- <div class="text" v-if="item.type == 'ARTICLE' && i == 0" id="anchor1">
                    <h2>{{item.moduleName}}</h2>

                    <div class="title" @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                        <p>{{content.title}}</p>
                    </div>

                    <div class="more" @click="goArticleList('mould0', item.moduleId, item.moduleName, item.type)">查看全部</div>
                </div> -->
                <div class="mould-1" v-if="item.type == 'ARTICLE' && i == 0" id="anchor1">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould1', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                    <div class="info" @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                        <div class="rich">
                            <div class="title">{{content.title}}</div>
                            <div class="sub">
                                <span class="source">{{content.source}}</span>
                                <span class="time">{{getDate(content.publishDt)}}</span>
                            </div>
                        </div>
                      <img :src="selectCover(content)" alt="">
                    </div>
                </div>
                
                <!-- banner样式 -->
                <div class="banner" v-if="item.type == 'BANNER'">
                    <img src="@/assets/special/banner.png" @click="goArticle('1114b38d482844dea9ec92481ded9fe0', 'ARTICLE')" />
                </div>

                <!-- 上图下文 3个 图片 -->
                <!-- 重大发现 -->
                <!-- <div class="mould-3" v-if="item.type == 'ARTICLE' && i == 2" id="anchor2">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould3', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                    <div class="info">
                        <div class="rich"  @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                            <img :src="content.thumbs[0].url" alt="">
                            <div class="title">{{content.title}}</div>
                        </div>
                    </div>
                </div> -->
                <!-- 上图下文 -->
                <!-- 重大发现 -->
                <div class="mould-2" v-if="item.type == 'ARTICLE' && i == 2" id="anchor2">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould2', item.moduleId, item.moduleName, 'SUBJECT')">更多</div>
                    </div>
                    
                    <div class="info">
                        <div class="rich"  @click="goArticle(content.contentId, 'SUBJECT')" v-for="(content, j) in eduData" :key="j">
                            <img :src="content.cover" alt="">
                            <div class="title">{{content.title}}</div>
                        </div>
                    </div>
                </div>
                <!-- 精品课程 -->
                <div class="mould-2" v-if="item.type == 'COURSE' && i == 3" id="anchor3">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould2', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                    <div class="info">
                        <div class="rich"  @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                            <img :src="content.cover" alt="">
                            <div class="title">{{content.title}}</div>
                        </div>
                    </div>
                </div>
                <!-- 右图左文 -->
                <!-- 实践活动 -->
                <div class="mould-1" v-if="item.type == 'ARTICLE' && i == 4" id="anchor4">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould1', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                    <div class="info" @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                        <div class="rich">
                            <div class="title">{{content.title}}</div>
                            <div class="sub">
                                <span class="source">{{content.source}}</span>
                                <span class="time">{{getDate(content.publishDt)}}</span>
                            </div>
                        </div>
                        <img v-if="content.thumbs[0]" :src="content.thumbs[0].url" alt="">
                    </div>
                </div>

                <!-- 右图左文 -->
                <!-- 创新成果 -->
                <div class="mould-1" v-if="item.type == 'ARTICLE' && i == 5" id="anchor5">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould1', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                    <div class="info" @click="goArticle(content.contentId, item.type)" v-for="(content, j) in item.records" :key="j">
                        <div class="rich">
                            <div class="title">{{content.title}}</div>
                            <div class="sub">
                                <span class="source">{{content.source}}</span>
                                <span class="time">{{getDate(content.publishDt)}}</span>
                            </div>
                        </div>
                        
                        <img :src="content.thumbs[0].url" alt="">
                    </div>
                </div>

                <!-- 上图下文 -->
                <div class="mould-4" v-if="item.type == 'RADIO' && i == 6" id="anchor6">
                    <div class="column">
                        <h2>{{item.moduleName}}</h2>
                        <div class="more" @click="goArticleList('mould2', item.moduleId, item.moduleName, item.type)">更多</div>
                    </div>
                    
                     <div class="info">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                 <div class="swiper-slide rich"  v-for="(content, j) in swiperData" :key="j">
                                    <div class="imgs-title">{{content.label}}</div>

                                    <div class="imgs-wrap">
                                        <div :data-content-id="swipe.contentId" :data-type="item.type" :data-label="swipe.label" v-for="(swipe, m) in content.data" :key="m">
                                            <img :src="swipe.cover" alt="">
                                            <div class="title">{{swipe.title}}</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { baseConfig } from '@/config/common.js'
// const { SERVER_DOMIN } = baseConfig
import axios from 'axios';
import native from '../../plugins/native';
import * as dayjs from 'dayjs';
import { Swiper } from "swiper/swiper-bundle.cjs";
import "swiper/swiper-bundle.min.css";
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

const http = axios.create(axiosConfig);
let that
import { jiaoyuziliao } from './data.js'

export default {
    data() {
        that = this

        // 处理教育资料数据
        let data = []; // 分组
        jiaoyuziliao.forEach((ele, index) => {
            let newdata = ele.data.filter((e, i) => {
                            return i <= 1
                        });
            if (ele.module == '课程') {
                return
            }

            data.push(
                {
                    label: ele.module,
                    data: newdata
                }
            )
        })

        return {
            topicBanner: '', // 头图
            navs: [],
            news: [],
            deviceId: '', // 设备ID
            contentId: this.$route.query.contentId, //栏目ID
            contentName: '',
            icon1: require('@/assets/special/icon-1.png'),
            icon2: require('@/assets/special/icon-2.png'),
            icon3: require('@/assets/special/icon-3.png'),
            icon4: require('@/assets/special/icon-4.png'),
            icon5: require('@/assets/special/icon-5.png'),
            icon6: require('@/assets/special/icon-6.png'),
            // 重大教育数据
            eduData: [
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
            ],
            // 轮播数据
            swiperData: data
        }
    },
    mounted() {
        this.contentId = this.$route.query.contentId;
        native.showTitle('忠诚维护核心 矢志奋斗强军');
        this.deviceId = native.getDeviceInfo.deviceId;
        this.getData();
    },
    filters: {
      getImgSrc(index) {
        return that[`icon${index + 1}`]
      }
    },
    methods: {
        async getData() {
            // http://apitikr.bonc.local/
            // http://apitikr.bonc.local1111/
            // https://cms-api.81.mil.cn/
            
            const res = await http.get(`${getCurrentUrl('taike')}/api/content/topic/contentList`, 
                {
                    params: {
                        contentId: this.contentId,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'deviceId': this.deviceId
                    }
                }
            );

            const {code, data} = res.data;
            
            if (code == 1) {
                // 接口失败
                // alert(1);
                return;
            }
            this.topicBanner = data.topicBanner;
            this.contentName = data.title;
            data.moduleContentVos.forEach(element => {
                this.navs.push({
                    title: element.moduleName,
                    moduleId: element.moduleId
                });
            });

            this.news = data.moduleContentVos;
            this.news.splice(1, 0, {
                type: 'BANNER'
            });
            setTimeout(()=> {
                this.initSwiper()
            }, 0)
            console.log(data);
        },

        // 点击文章详情
        /**
         * id: 文章id,
         * type: 数据类型
         * label: 轮播下的数据类型
         */
        goArticle(id, type, label) {
            let path = '';
            if (type === 'ARTICLE') {
                path = `xxqj://tkNews?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            } else if (type === 'COURSE'){
                path = `xxqj://course?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            } else if (type === 'RADIO'){
                console.log('label: ', label)
                
                if (label === '图书' || label === '有声读物') {
                    path = `xxqj://bookAudio?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                } else if (label === '影视') {
                    path = `xxqj://movie?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                } else if (label === '课程') {
                    path = `xxqj://course?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                } else if (label === '图书book') {
                    path = `xxqj://book?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
                }
            } else if (type === "SUBJECT") {
                path = `xxqj://subject?id=${id}&columnName=${this.contentName}&columnId=${this.contentId}`;
            }
            native.appJump(path);
        },

        // 点击更多
        /**
         * type: 按布局划分页面
         * id: 专题分组id
         */
        goArticleList(layout, moduleId, moduleName, type) {
            const layout1 = layout === 'mould4'? 'mould3': layout;
            //native.appJump('https://baidu.com');
            this.$router.push({
                path: `/special/articleList`,
                query: { contentId: this.contentId, contentName: this.contentName, moduleId, moduleName, layout: layout1, type },
            });
        },

        /**
         * 转换时间
         */
        getDate(time) {
            return dayjs(time).format('YYYY-MM-DD');
        },
        //初始化轮播
        initSwiper() {
            new Swiper(".swiper-container", {
                slidesPerView: 1.4,
                spaceBetween: -15,
                centeredSlides: true,
                loop: true,
                autoplay:{
                    delay: 2000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                on: {
                    click: (e)=> {
                        const activeSlider = window.document.getElementsByClassName('swiper-slide-active')[0].getElementsByClassName('imgs-wrap')[0]
                        const firstChild = activeSlider.firstChild; // 当前预览的第一张图片元素
                        const lastChild = activeSlider.lastChild;  // 当前预览的第二张图片元素
                        const firstChildPosition = firstChild.getBoundingClientRect();
                        const lastChildPosition = lastChild.getBoundingClientRect();
                        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        if(e.touches.currentX >= firstChildPosition.x && e.touches.currentX <= firstChildPosition.x +firstChildPosition.width && 
                        e.touches.currentY >= firstChildPosition.y + scrollTop && e.touches.currentY <= firstChildPosition.y + scrollTop + firstChildPosition.height) {
                            // 当前鼠标点击的是第一张图坐标区域
                            this.goArticle(firstChild.dataset.contentId, firstChild.dataset.type, firstChild.dataset.label)
                        }else if(e.touches.currentX >= lastChildPosition.x && e.touches.currentX <= lastChildPosition.x +lastChildPosition.width && 
                        e.touches.currentY >= lastChildPosition.y + scrollTop && e.touches.currentY <= lastChildPosition.y + scrollTop + lastChildPosition.height) {
                            // 当前鼠标点击的是第二张图坐标区域
                            this.goArticle(lastChild.dataset.contentId, lastChild.dataset.type, lastChild.dataset.label)
                        }
                    }
                }
            });
        },
        // 锚点定位
        scrollInto(index) {
            document.querySelector(`#anchor${index + 1}`).scrollIntoView(true)
        },
        // 部署要求图片
        selectCover(content) {
            let cover = content.thumbs && content.thumbs.length? content.thumbs[0].url : content.pictures[0].url
            return cover;
        },
    }
};
</script>
<style lang="less" scoped>
.special {
    background: #f6f6f6;
}
.header {
    height: 3.4rem;
    //background: url('../../assets/special/header.png') no-repeat;
    //background-size: 100%;
    img {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
}

.nav {
    position: relative;
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
        font-size: .24rem;
        margin-bottom: .18rem;
    }
}

.news {
    padding: 0 .28rem .3rem;
}


.text {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0 .2rem;

    h2 {
        font-size: .32rem;
        margin: 0 0 .3rem 0;
    }

    .title {
        display: flex;
        align-items: center;
        font-size: .3rem;
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
        font-size: .24rem;
        margin: 0 -.2rem;
        text-align: center;
        color: #7a7a7a;

        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../../assets/special/arrow.png') no-repeat;
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
        margin: 0 0 .1rem 0;

        h2 {
            font-size: .32rem;
            margin: 0;
        }

       
    }

    .more {
        font-size: .24rem;
        text-align: center;
        color: #7a7a7a;


        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }

    .info {
        display: flex;
        padding-top: .2rem;
        padding-bottom: .3rem;
        border-bottom: 1px solid #e1e1e1;
        img {
            width: 2.14rem;
            height: 1.2rem;
            border-radius: 2px;
        }

        &:last-of-type {
            border-bottom: none;
        }
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


.mould-2 {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0 .2rem;

    .column {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 .1rem 0;

        h2 {
            font-size: .32rem;
            margin: 0;
        }

       
    }

    .more {
        font-size: .24rem;
        text-align: center;
        color: #7a7a7a;


        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }

    .info {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        padding-top: .2rem;

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
    }

}

.mould-3 {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0 .2rem;

    .column {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 .1rem 0;

        h2 {
            font-size: .32rem;
            margin: 0;
        }

       
    }

    .more {
        font-size: .24rem;
        text-align: center;
        color: #7a7a7a;

        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }

    .info {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        padding-top: .2rem;

        img {
            width: 100%;
            border-radius: 2px;
            margin-bottom: .2rem;
        }
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
.mould-4 {
    background: #fff;
    border-radius: 4px;
    margin-bottom: .3rem;
    box-shadow: 0px 0px 2px #ccc;
    padding: .4rem .2rem 0.3rem .2rem;

    .column {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 .1rem 0;

        h2 {
            font-size: .32rem;
            margin: 0;
        }

       
    }

    .more {
        font-size: .24rem;
        text-align: center;
        color: #7a7a7a;


        &::after {
            display: inline-block;
            content: '';
            width: .09rem;
            height: .16rem;
            background: url('../../assets/special/arrow.png') no-repeat;
            background-size: 100%;
            margin-left: .1rem;
        }
    }
    .info {
        height: 3.4rem;
        .imgs-title {
            height: .8rem;
            line-height: .75rem;
            font-size: 0.24rem;
        }
        .imgs-wrap {
            display: flex;
            flex: 1;
            width: 100%;
            justify-content: space-around;
            padding: 0px .12rem;
            & > div {
                display: flex;
                flex-direction: column;
                width: 1.5rem;
                img {
                    height: 1.86rem;
                    border-radius: 4px;
                }
                .title {
                   margin-top: 0.1rem;
                }
            }
        }
    }
}
.mould-2 .title,
.mould-3 .title,
.mould-4 .title {
    display:-webkit-box;/**对象作为伸缩盒子模型展示**/
    -webkit-box-orient:vertical;/**设置或检索伸缩盒子对象的子元素的排列方式**/
    -webkit-line-clamp:2;/**显示的行数**/
    overflow:hidden;/**隐藏超出的内容**/
}
.swiper-container {
    width: 100%;
    height: 100%;
    .swiper-slide {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        font-size: .2rem;
        border-radius: 4px;
        background: #f4f4f4;

        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        transition: 300ms;
        transform: scale(0.8)!important;
        padding: 0 1.5rem;
    }
    .swiper-slide-active,.swiper-slide-duplicate-active{
        transform: scale(1)!important;
        padding: 0;
    }
}
</style>
