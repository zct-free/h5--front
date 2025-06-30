/*
 * @FORM: KALT
 * @Description: 无
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import Vant from "vant";
import "vant/lib/index.css";
import axios from "./plugins/axios.js";
import store from './store'
import bonc from './plugins/clientFunc.js';
import native from './plugins/native.js';
import "./plugins/table.js";
import VueClipboard from "vue-clipboard2";
import './plugins/native1';
import "../public/font/font.css"

import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'

//import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'

const env = process.env.NODE_ENV;
 //测试环境
let connection = 'http://172.16.18.131:8186' // todo-长城网测试环境
let options = {
    autoConnect:false,
    // http://172.16.18.131:8186
    transports: ['websocket'],
}

if(env ==='k8spre'  || env === 'relasebcos' ) {
  //予发布
  connection = 'https://appusercent.81.mil.cn'
  options = {
    autoConnect:false,
    // http://172.16.18.131:8186
    transports: ['websocket'],
    path: "/answer-app-sock/socket.io/"
  }
}
if(env === 'k8sproduction') {
    //生产
  connection = 'https://apparmy.81.mil.cn'
  options = {
    autoConnect:false,
    transports: ['websocket'],
    path: "/answer-app-sock/socket.io/"
  }
}


/* Vue.use(new VueSocketIO({
  debug: true,
  connection, 
  options,
 })) */

Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})

Vue.prototype.$axios = axios;
Vue.use(VueClipboard);

Vue.use(Vant);
Vue.config.productionTip = false;
Vue.prototype.clientAsync = bonc; // 客户端方法调用对象-异步
Vue.prototype.clientSync = native; // 客户端方法调用对象-同步
new Vue({
  router,
  store,
  bonc,
 
  //   connecting() {
  //     console.log('正在连接')
  //   },
  //   ConnectReceive(data) {
  //     console.log("数据",data);
  //   },
  //   connect_failed() {
  //     cosnole.log('连接失败')
  //   },
  //   connect() {
  //     console.log('链接成功')
  //   },
  //   ConnectReceive(msg) {
  //     console.log('msg', msg);
  //   },
  //   reconnect(data) {
  //     console.log('重连',data);
  //   },
  //   login: function (value) {
  //     //监听login(后端向前端emit  login的回调)
  //     console.log(value)
  //   }
  // },

  render: h => h(App)
}).$mount("#app");