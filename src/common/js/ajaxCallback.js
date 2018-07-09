import $ from "jquery";

let ajaxCallbackSingleton = (() => {
  let _wran = msg => console.warn(msg);
  let _error = msg => console.error(msg);
  class Singleton {
    constructor() {
      this.dataCollection = {
        errorCollection: {},
        successCollection: {}
      };
    }
    bindErrorHanding(errorHandingObjcet) {
      var data = this.dataCollection.errorCollection;
      data = $.extend(true, data, errorHandingObjcet);
    }
    bindSuccessHanding(successHandingObjcet) {
      var data = this.dataCollection.successCollection;
      data = $.extend(true, data, successHandingObjcet);
    }
    errorHanding(url, errorCode, ret,callbackData) {
      let data = this.dataCollection.errorCollection[url];
      if (!data) {
        _wran(`Dont\'t errorHanding this interface [${url}]`);
      }
      if (data && typeof data[errorCode] === 'function') {
        data[errorCode](ret,callbackData);
      } else if (data && data['golbal']) {

        data['golbal'](ret,callbackData);
      }
    }
    successHanding(url, ret,callbackData) {
      let callback = this.dataCollection.successCollection[url];
      if (callback && typeof callback === "function") {
        callback(ret,callbackData);
      }
    }
    send(url, type, data,callbackData) {
      let _this = this;
      $.ajax({
        url: url,
        type: type,
        data: data,
        success(ret) {
          ret = $.parseJSON(ret);
          console.log(url, ret)
          if (ret.code === '0') {
            _this.successHanding(url, ret,callbackData);
          } else {
            _this.errorHanding(url, ret.msg, ret,callbackData);
          }
        }
      })
    }
  }
  let instance = null;
  let staticExport = {
    init() {
      if (instance === null || instance.constructor !== Singleton) {
        instance = new Singleton();
      }
      return instance;
    }
  }
  return staticExport;
})();

export default ajaxCallbackSingleton;