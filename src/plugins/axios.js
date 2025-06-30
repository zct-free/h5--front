/*
 * @FORM: KALT
 * @Description: 无
 */
/*
 * @FORM: KALT
 * @Description: 无
 */
import axios from "axios";
import { Toast } from "vant";

const isMock = true;

const axiosConfig = {
    timeout: 60 * 1000, // 超时时间五秒
    withCredentials: false, // Check cross-site Access-Control
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: "/"
};

const instance = axios.create(axiosConfig);

// 注入请求拦截
instance.interceptors.request.use(
    config => {
        // console.log("request", config);
        config.headers.token = window.localStorage.getItem("token") || ""
        return config;
    },
    error => {
        Toast.fail("发起请求失败");
        Promise.error(error);
    }
);

// 注入响应拦截
instance.interceptors.response.use(
    res => {
        if (res && res.data && res.data.code === 1000) {
            console.log("response success", res.data);
            //return Promise.resolve(res);
        }
        //Toast.fail( res.data.msg );
        //return Promise.reject(res);
        return Promise.resolve(res);
    },
    error => {
        const { response } = error;
        if (response) {
            Toast.fail("接口报错");
            return Promise.reject(response);
        } else {
            Toast.fail("网络连接超时");
        }
    }
);

export default instance;
