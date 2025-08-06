import qs from "qs";
import { Toast } from "vant";
import Vue from "vue";

(function ($, _) {
  // type:
  // 1. news
  // 2. tabs
  // 3. lessons
  // 4. tiktok
  // 5. web

  $.native = {
    selftOptions: {
      type: "",
      id: "",
      channel: "",
      url: "",
      stats: null,
    },
    link: options => {
      if (options instanceof MouseEvent) options = _.location.href;
      const type = typeof options;
      if (type === "object") {
        options = {
          ...$.native.selftOptions,
          ...options,
        };
      } else if (type === "string") {
        const urlArr = options.split("?");
        if (urlArr.length > 1) {
          options = {
            ...$.native.selftOptions,
            ...qs.parse(urlArr[1]),
          };
        } else {
          options = {
            ...$.native.selftOptions,
          };
        }
      } else {
        options = {
          ...$.selftOptions,
          ...qs.parse(_.location.href),
        };
      }
      // alert(`参数：${JSON.stringify(options)}`)
      if (_.nativeHandler) {
        _.nativeHandler.execute("jump", JSON.stringify(options), null);
        // _.nativeHandler.jump(options)
      } else {
        Toast.fail(`jsBridge注入失败,打印nativeHandler：${_.nativeHandler}`);
      }
    },
    getAppInfo: function () {
      localStorage.setItem("uuid", "48b3b7e0258d476598b084d355e4a5aa");
      localStorage.setItem(
        "token",
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE3NTQxMzIxNzc2NDQsInBob25lIjoiY2VhNzY2YmQ5YjZiNmRiZTJhNzVjOTJlZmY4YjE0M2UiLCJvcGVuSWQiOiJhMTkzNWYzNWJjYzU1MWVhOGIwNDdmOWRlOTU4ZWFjNCIsInJlZ2lvbiI6Ijg2IiwidXNlcklkIjoiMTYyNjk4OTkwNzY3NDExMiJ9.AsgUi1q-tLXOBri35MYBceIvzrOV7gtrbgB-X8CHFHY"
      );
      let url = window.location.href;
      if (url.indexOf("?") > -1) {
        url = url.split("?");
        url = qs.parse(url[1]);
        window.localStorage.setItem("token", url.token);
        window.localStorage.setItem("uuid", url.uuid);
      }
    },
  };
})(Vue.prototype, window);
