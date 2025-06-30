// js与客户端交互的中间层
class DataScienceJsObj {
    //id和回调的对应关系
    callbacks = new Map();

    //客户端回调js方法
    sendNativeResult(id, func, args) {
        console.log('js 执行sendNativeResult')
        if (this.callbacks != null) {
            console.log('js  callbacks ！= null')
            let obj = this.callbacks.get(id)
            if (obj) {
                if (obj[func]) {
                    obj[func](args)
                }
                this.callbacks.delete(id)
            }
        }
    }

    //调用客户端方法
     callNativeMethod(params) {
        console.log('js 执行callNativeMethod')
        params.id = new Date().toDateString()
        this.callbacks.set(params.id, params)
        if (window.boncJs) {
            let json = JSON.stringify(params)
            window.boncJs.execute(params.method, json)
        }
     }

    //客户端支持的api列表
    ready(params){
        console.log('js-- ready')
        params.method = "ready"
        let orgSuccess = params.success
        params.success = function(list) {
            for (const index in list) {
                let method = list[index]
                bonc[method] = function(params) {
                    params.method = method
                    this.callNativeMethod(params)
                  }
            }
          orgSuccess.call(orgSuccess,list)
        }
        this.callNativeMethod(params)
    }

}

const bonc = new DataScienceJsObj()
bonc.ready({}) // 加载注入app提供的方法

//客户端回调js
window.handNative = function (params) {
    console.log('js handNative called params =', params)
    let obj = JSON.parse(params)
    let id = obj.id;
    let func = obj.func;
    let args = obj.args;
    if (bonc != null) {
        bonc.sendNativeResult(id, func, args);
    }
}
export default bonc;