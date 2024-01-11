const env = process.env.NODE_ENV;

console.log(" env ===> ", env);

let serverDomain = "http://118.64.0.1";
let answerSever = '';
let taikeServer = '';
let appServer = '';
let publicPath = "/";
switch (env) {
    // 国信私有云内网
    case "relasebcos":
        serverDomain = "https://1hao.bonc.local";
        answerSever = "https://1hao.bonc.local/",
        taikeServer = "http://apitikr.bonc.local/";
        appServer = "https://1hao.bonc.local/";
        publicPath = "/html5";
        break;
    // 长城网预测试
    case "k8stest":
        serverDomain = "https://backend.soap.com";
        answerSever = "https://backend.soap.com/",
        taikeServer = "https://cms-api.soap.com/";
        appServer = "https://backend.soap.com/";
        publicPath = "/html5";
        break;
    // 长城网预生产
    case "k8spre":
        serverDomain = "https://appusercent.81.mil.cn";
        answerSever = "https://appusercent.81.mil.cn/";
        taikeServer = "";
        appServer = "https://appusercent.81.mil.cn";
        publicPath = "/";
        break;
    // 长城网生产
    case "k8sproduction":
        serverDomain = "https://apparmy.81.mil.cn";
        answerSever = "https://apptracker.81.mil.cn/"
        taikeServer = "https://cms-api.81.mil.cn";
        appServer = "https://apparmy.81.mil.cn";
        publicPath = "/";
        break;
    default:
        serverDomain = "https://backend.soap.com";
        answerSever = "https://backend.soap.com/",
        taikeServer = "https://cms-api.soap.com/";
        appServer = "https://backend.soap.com/";
        publicPath = "/";
        break;
}

const baseConfig = {
    PUBLIC_PATH: publicPath,
    SERVER_DOMIN: serverDomain,
    ANSWER_SEVER:answerSever,
    TAIKR_SERVER: taikeServer,
    APP_SERVER: appServer,
    SERVER_NAME: {
        vote:'vote',
        system: "user-sys",
        sys: "sys", // 部门管理
        cms: "cms", //cms
        strongArmy: "strongArmy",
        credits: serverDomain + "/cms-app/credits",
        special: serverDomain + "/cms-app/special",
        course: "course-app", //课程号
        cmsApp: "cms-app",
        answer:'bonc-answer-app',
        im:'im'
    }
};

module.exports = {
    baseConfig
};
