<template>
    <div class="">
        <div class="top">
            <div class="date">
                <div class="lecture-swiper">
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            <div
                                class="swiper-slide"
                                v-for="(item, index) in monthList"
                                :key="index"
                                @click="gainMonth(index)"
                            >
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dotted"></div>
                <div class="lecture-swiper">
                    <div class="swiper-day">
                        <div class="swiper-wrapper">
                            <div
                                class="swiper-slide"
                                v-for="(item, index) in dayList"
                                :key="index"
                                @click="gainDay(index)"
                            >
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border"></div>
            </div>
        </div>
        <div class="content">
            <h1>
                历史上的<span>{{ month }}月{{ day }}号</span>
            </h1>
            <div class="year" v-for="(item, index) in datalist" :key="index">
                <h2>{{ item.year | fromatYear }}</h2>
                <div class="right">
                    <!-- <p class="title">{{item.category}}</p> -->
                    <p>{{ item.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Swiper } from "swiper/swiper-bundle.cjs";
import "swiper/swiper-bundle.min.css";
import { getHistoryToDay } from "../../../serve/api/today.js";

export default {
    filters: {
        fromatYear(val) {
            let res = val;
            if (val.indexOf("年") > -1) {
                res = val.substring(0, 4);
            }
            return res;
        }
    },
    data() {
        return {
            monthList: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            dayList: [],
            month: null,
            day: null,
            index: 1,
            index1: 1,
            historyList: {},
            datalist: []
        };
    },
    created() {
        this.init();
    },
    mounted() {},
    methods: {
        async getHistoryToDay(month, day) {
            let params = {
                month,
                day
            };
            const res = await getHistoryToDay(params);
            const { data, msg, code } = res.data;
            if (code === 1000) {
                this.datalist = data.historyEvenList;
            } else {
                this.$toast.fail(msg);
            }
        },
        async init() {
            // const res = await this.$axios.get("/history");
            // this.historyList = res.data.list;
            //this.historyList = list;

            let now = new Date();
            let month = now.getMonth();
            let day = now.getDate() - 1;
            this.gainMonth(month, true);
            this.gainDay(day, true);
            this.guolv();
        },
        gainMonth(index, init = false) {
            this.index = index;
            this.month = index + 1;
            let now = new Date();
            let year = now.getFullYear();
            let day = new Date(year, index + 1, 0);
            let dayCount = day.getDate();
            this.dayList = [];
            for (let i = 1; i < dayCount + 1; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                this.dayList.push(i);
            }
            setTimeout(() => {
                this.initSwiper();
            }, 0);
            if (!init) {
                this.guolv();
            }
        },
        guolv() {
            let { month, day } = this;
            month = month < 10 ? `0${month}` : month;
            day = day < 10 ? `0${day}` : day;

            this.getHistoryToDay(month, day);

            //let listkey = `${month}${day}`;
            //this.datalist = this.historyList[listkey] || {};
        },
        gainDay(e, init = false) {
            this.index1 = e;
            let that = this;
            setTimeout(function() {
                that.initSwiper1();
            }, 5);
            this.day = e + 1;
            if (!init) {
                this.guolv();
            }
        },
        //初始化轮播
        initSwiper() {
            const swiper = new Swiper(".swiper-container", {
                slidesPerView: "auto",
                centeredSlides: true,
                observer: true,
                observeParents: true,
                spaceBetween: 0
            });
            var idx = this.index;
            swiper.slideTo(idx, 100, false);
        },
        initSwiper1() {
            const swiper1 = new Swiper(".swiper-day", {
                slidesPerView: "auto",
                centeredSlides: true,
                observer: true,
                observeParents: true,
                spaceBetween: 0
            });
            var idx1 = this.index1;
            swiper1.slideTo(idx1, 100, false);
        }
    }
};
</script>
<style lang="less" scoped>
.top {
    background-color: #28292d;
    .dotted {
        width: 7.15rem;
        height: 0.008rem;
        border: 0.01rem dotted #a5a6aa;
        margin: auto;
    }
    .date {
        width: 6rem;
        margin: auto;
        position: relative;
        overflow: hidden;
        .border {
            width: 1rem;
            height: 1.65rem;
            border: 0.05rem solid #ffb300;
            border-radius: 0.1rem;
            position: absolute;
            top: 0;
            left: 2.5rem;
        }
    }
    .lecture-swiper {
        overflow: hidden;
        .swiper-slide {
            text-align: center;
            width: 0.93rem !important;
            color: #fff;
            line-height: 0.83rem;
            font-size: 0.26rem;
        }
        .swiper-day {
            line-height: 0.72rem;
        }
    }
}
.content {
    // width: 6.92rem;
    margin: auto;
    padding-right: 0.2rem;
    h1 {
        font-size: 0.48rem;
        font-weight: normal;
        color: #000000;
        margin-left: 1.2rem;
        margin: 0.6rem 0 0.84rem 1.2rem;
        span {
            margin-left: 0.25rem;
            color: #dd1921;
        }
    }
    .year {
        display: flex;
        margin-top: 0.84rem;
        h2 {
            height: 0.5rem;
            color: #edeeee;
            font-size: 0.6rem;
            transform: rotate(-90deg);
            margin: 0;
            margin-top: 0.3rem;
        }

        .right {
            width: 100%;
            border-left: 0.03rem solid #eeeeee;
            font-size: 0.25rem;
            line-height: 0.57rem;
            position: relative;

            &::after {
                border: 5px solid rgba(0, 0, 0, 0);
                content: "";
                border-left: 5px solid red;
                font-size: 0;
                position: absolute;
                top: 0;
            }

            .title {
                font-size: 0.4rem;
                margin-bottom: 0.2rem;
            }

            p {
                margin-left: 0.26rem;
                font-size: 0.28rem;
                line-height: 0.56rem;
            }
        }
    }
}
</style>
