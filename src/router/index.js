import Vue from "vue";
import VueRouter from "vue-router";
// import Meeting from '../views/Meeting.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: "/today",
        name: "历史上的今天",
        component: () => import("../views/today/index.vue")
    },
    {
        path: "/testpaper",
        name: "试卷页面",
        component: () => import("../views/test.vue")
    },
    {
        path: "/classes/rank",
        name: "Rank",
        title: "排行榜",
        component: () => import("../views/news-edu/classes/rank.vue")
    },
    {
        path: "/personal-center/examination2",
        name: "PersonalCenterExamination2",
        title: "个人中心--考试2",
        component: () =>
            import("@/views/personal-center/examination/test/index.vue")
    },
    {
        path: "/personal-center/examination2/detail",
        name: "考试详情",
        component: () =>
            import("@/views/personal-center/examination/test/detail.vue")
    },
    {
        path: "/403",
        name: "Forbidden",
        title: "无权限",
        component: () => import("@/views/403.vue")
    },
    // {
    //     path: "/expire",
    //     name: "Download",
    //     title: "下载",
    //     component: () => import("@/views/download.vue")
    // },
    {
        path: "/download",
        name: "Download",
        title: "下载",
        component: () => import("@/views/download.vue")
    },
    {
        path: "/short",
        name: "Short",
        title: "下载",
        component: () => import("@/views/download.vue")
    },
    {
        path: "/apk/download",
        name: "apkDownload",
        title: "下载",
        component: () => import("@/views/apk-download.vue")
    },
    {
        path: "/personal-center/task",
        name: "PersonalCenter",
        title: "个人中心--任务",
        component: () => import("@/views/personal-center/task/index.vue")
    },
    // 个人中心--任务
    {
        path: "/personal-center/des",
        name: "PersonalCenterDes",
        title: "个人中心--明细",
        component: () => import("@/views/personal-center/task/des.vue")
    },
    // 个人中心--任务--积分明细
    {
        path: "/personal-center/task/integral-details",
        name: "PersonalCenterTaskIntegralDetails",
        title: "个人中心--任务--积分明细",
        component: () =>
            import("@/views/personal-center/task/IntegralDetails.vue")
    },
    {
        path: "/credit-rank",
        name: "CreditRank",
        title: "学分银行",
        component: () => import("@/views/credit-rank/index.vue")
    },
    // {
    //     path: "/control",
    //     name: "control",
    //     title: "控制运营商",
    //     component: () => import("@/views/personal-center/credit/control.vue")
    // },
    {
        path: "/groups-detailed",
        name: "GroupsDetailed",
        title: "群组积分详情",
        component: () => import("@/views/credit-rank/groupsDetailed.vue")
    },
    {
        path: "/personal-center/credit/complete",
        name: "PersonalCenterCreditComplete",
        title: "兑换完成页面",
        component: () => import("@/views/personal-center/credit/complete.vue")
    },
    {
        path: "/personal-center/credit",
        name: "PersonalCenterCredit",
        title: "个人中心--学分银行",
        component: () => import("@/views/personal-center/credit/index.vue")
    },
    {
        path: "/personal-center/productDetails",
        name: "productDetails",
        title: "商品详情",
        component: () => import("@/views/personal-center/credit/details.vue")
    },
    {
        path: "/personal-center/exchangeRecord",
        name: "exchangeRecord",
        title: "积分兑换记录",
        component: () => import("@/views/personal-center/credit/exchangeRecord.vue")
    },
    {
        path: "/group-ranking",
        name: "GroupRanking",
        title: "群小组排行",
        component: () => import("@/views/group-ranking/GroupRanking.vue")
    },
    {
        path: "/thematic-ranking",
        name: "thematicRanking",
        title: "专题排行",
        component: () => import("@/views/thematic-ranking/index.vue")
    },
    {
        path: "/answer/entry",
        name: "answerEntry",
        title: "答题",
        component: () => import("@/views/answer/entry.vue")
    },
    {
        path: "/answer/main",
        name: "answerMain",
        title: "答题",
        component: () => import("@/views/answer/main.vue")
    },
    {
        path: "/answer/end",
        name: "answerEnd",
        title: "答题",
        component: () => import("@/views/answer/end.vue")
    },
    {
        path: "/answer/record",
        name: "answerRecord",
        title: "答题-答题记录",
        component: () => import("@/views/answer/record.vue")
    },
    {
        path: "/answer/explain",
        name: "answerExplain",
        title: "答题-使用说明",
        component: () => import("@/views/answer/explain.vue")
    },
    {
        path: "/answer/week",
        name: "answerWeek",
        title: "答题",
        component: () => import("@/views/answer/week.vue")
    },
    {
        path: "/answer/weekMain",
        name: "answerWeekMain",
        title: "答题",
        component: () => import("@/views/answer/weekMain.vue")
    },
    {
        path: "/answer/special",
        name: "answerSpecial",
        title: "答题",
        component: () => import("@/views/answer/special.vue")
    },
    {
        path: "/answer/month",
        name: "answerMonth",
        title: "每月答题",
        component: () => import("@/views/answer/month.vue")
    },
    {
        path: "/answer/specialMain",
        name: "answerSpecialMain",
        title: "答题",
        component: () => import("@/views/answer/specialMain.vue")
    },
    {
        path: "/answer/pk/pkEntry",
        name: "answerPkEntry",
        title: "答题",
        component: () => import("@/views/answer/pk/pkEntry.vue")
    },
    {
        path: "/answer/pk/threePk",
        name: "answerPkThreePK",
        title: "答题-三人竞赛",
        component: () => import("@/views/answer/pk/threePkEntry.vue")
    },
    {
        path: "/answer/pk/pkmatch",
        name: "answerPkmatch",
        title: "答题",
        component: () => import("@/views/answer/pk/pkmatch.vue")
    },
    {
        path: "/answer/pk/pksuc",
        name: "answerPksuc",
        title: "答题",
        component: () => import("@/views/answer/pk/pksuc.vue")
    },
    {
        path: "/answer/pk/pkMain",
        name: "answerPkMain",
        title: "答题",
        component: () => import("@/views/answer/pk/pkMain.vue")
    },
    {
        path: "/answer/pk/pkReshow",
        name: "answerPkReshow",
        title: "答题",
        component: () => import("@/views/answer/pk/pkReshow.vue")
    },
    {
        path: "/special",
        name: "special",
        title: "专题",
        component: () => import("@/views/special/index.vue")
    },
    {
        path: "/special/articleList",
        name: "specialArticleList",
        title: "专题-更多",
        component: () => import("@/views/special/articleList.vue")
    },
    {
        path: "/h5wenjuan",
        name: "h5wenjuan",
        title: "问卷",
        component: () => import("@/views/questionnaire.vue")
    },
    {
        path: "*",
        name: "PageNotFound",
        title: "找不到页面了",
        component: () => import("@/views/404.vue")
    },
    {
        path: "/app-agreement",
        name: "AppAgreement",
        title: "隐私政策",
        component: () => import("@/views/document/privacyPolicy.vue")
    },
    {
        path: "/app-agreement-sdk",
        name: "AppAgreementSDK",
        title: "隐私政策SDK",
        component: () => import("@/views/document/privacyPolicySDK.vue")
    },
    {
        path: "/copyright",
        name: "Copyright",
        title: "版权信息",
        component: () => import("@/views/document/copyright.vue")
    },
    {
        path: "/jkwz",
        name: "jkwz",
        title: "健康问诊",
        component: () => import("@/views/healquestion/index.vue")
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeResolve((to, from, next) => {
    if (process.env.NODE_ENV !== "development" && to.path !== "/download" && to.path !== "/app-agreement" && to.path !== "/app-agreement-sdk" && to.path !== "/copyright" ) {
        const isLogin = window.localStorage.getItem("token");
        if (!isLogin && to.path !== "/403") {
            next("/403");
            return;
        } else if (isLogin && to.path === "/403") {
            next(from.path);
            return;
        }
    }
    next();
});

export default router;
