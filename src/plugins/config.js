import { baseConfig } from "../config/common.js";

const { SERVER_NAME, SERVER_DOMIN ,ANSWER_SEVER, TAIKR_SERVER, APP_SERVER } = baseConfig;

// 常规接口
const apiUrl = {
    system: `${SERVER_DOMIN}/${SERVER_NAME.system}`,
    sys: `${SERVER_DOMIN}/${SERVER_NAME.sys}`,
    cms: `${SERVER_DOMIN}/${SERVER_NAME.cms}`,
    strongArmy: `${SERVER_DOMIN}/${SERVER_NAME.strongArmy}`,
    course:`${SERVER_DOMIN}/${SERVER_NAME.course}`,
    cmsApp:`${SERVER_DOMIN}/${SERVER_NAME.cmsApp}`,
    answer:`${SERVER_DOMIN}/${SERVER_NAME.answer}`,
    integrate:`${ANSWER_SEVER}`,
    im:`${SERVER_DOMIN}/${SERVER_NAME.im}`,
    taike:`${TAIKR_SERVER}`,
    app:`${APP_SERVER}`,
    vote:`${APP_SERVER}`
};

// mock接口地址
const mockApiUrl = {
    cms: `http://10.130.7.185:3000/mock/414/${SERVER_NAME.cms}`,
    user: "http://10.130.7.185:3000/mock/414/users"
};

// 获取当前请求接口地址
export const getCurrentUrl = (path, isMock = false) => {
    let urlPath = apiUrl[path];
    if (isMock) {
        urlPath = mockApiUrl[path];
    }
    return urlPath;
};
