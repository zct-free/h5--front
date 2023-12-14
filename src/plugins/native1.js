import Vue from 'vue';
import qs from 'qs';
import {
    Toast
} from "vant";

(function ($, _) {
    // type:
    // 1. news
    // 2. tabs
    // 3. lessons
    // 4. tiktok
    // 5. web

    $.native = {
        selftOptions: {
            type: '',
            id: '',
            channel: '',
            url: '',
            stats: null
        },
        link: (options) => {
            if (options instanceof MouseEvent) options = _.location.href
            const type = typeof options
            if (type === 'object') {
                options = {
                    ...$.native.selftOptions,
                    ...options
                }
            } else if (type === 'string') {
                const urlArr = options.split('?')
                if (urlArr.length > 1) {
                    options = {
                        ...$.native.selftOptions,
                        ...qs.parse(urlArr[1])
                    }
                } else {
                    options = {
                        ...$.native.selftOptions
                    }
                }
            } else {
                options = {
                    ...$.selftOptions,
                    ...qs.parse(_.location.href)
                }
            }
            // alert(`参数：${JSON.stringify(options)}`)
            if (_.nativeHandler) {
                _.nativeHandler.execute("jump", JSON.stringify(options), null)
                // _.nativeHandler.jump(options)
            } else {
                Toast.fail(`jsBridge注入失败,打印nativeHandler：${_.nativeHandler}`)
            }
        },
        getAppInfo: function () {
            let url = window.location.href
            if (url.indexOf('?') > -1) {
                url = url.split('?')
                url = qs.parse(url[1])
                window.localStorage.setItem('token', url.token)
                window.localStorage.setItem('uuid', url.uuid)
            }
        }
    }
})(Vue.prototype, window)