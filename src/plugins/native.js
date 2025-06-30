
const native = {
    handler() {
        let hand = {
            execute: function() {},
            ami: 'h5',
        };

        if (window.nativeHandler) {
            hand = window.nativeHandler;
            hand.ami = 'native';
        }

        return hand;
    },
     // 添加埋点
    addStatistic(type, params = `{}`) {
        this.handler().execute(type, params, null);
    },

    // 关闭当前
    closeWebview() {
        console.log('closeWebview');
        this.handler().execute('closeThisWebView', '', '');
    },

    // newWebview(options) {
    //     this.handler().execute('popupWebView', JSON.stringify({
    //         url: options.url,
    //         title: options.title
    //     }), '');
    // },

    /**
     * 获取用户信息
     * @returns 用户信息
     * name: ''
     * guid: '',
     * avatar: '',
     * token: '',
     * 
     */
    getUserInfo() {
        return this.handler().execute('queryNativeUserInfo', null, null);
    },

    /**
     * 获取机器信息
     * @returns 
     */
    getDeviceInfo() {
        return this.handler().execute('getDeviceInfo', null, null);
    },

    /**
     * 
     * @param {*} path 
     */
    appJump(path) {
        this.handler().execute('appJump', path, null);
    },

    /**
     * 展示webview标题
     * @param {*} title 
     */
    showTitle(title) {
        this.handler().execute('showTitle', title, null);
    },
    // 展示或隐藏原生头
    showOrHideNaviBar(type) {
        this.handler().execute('showOrHideNaviBar', type, null);
    }
}

export default native;
