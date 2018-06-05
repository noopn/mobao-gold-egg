import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "font/iconfont.css";
import "../css/index.scss";
if ((navigator.userAgent.indexOf('Opera Mini') > -1) || Object.prototype.toString.call(window.operamini) ===
  "[object OperaMini]" || !"onresize" in window) {
  location.href = url+"geggs";
}
/*首页相关 --- wyj 2018 05 03 */
var accountLength = 9; //登陆账号长度
var reg_step = 1; //记录用户注册当前到第几部
var reg_account = "";
var fromeGame = false;
$(function () {
  //判断用户token是否存在
  userInfo();
  stepShow();
  //点击登陆按钮
  $("#login").on("click", function () {
    $(".mask_index").fadeIn();
  });

  //用户注册
  $(".mask_index .reg").on("click", function () {
    $(".mask_index").fadeOut();
    $(".mask_reg").fadeIn();
  });

  //返回用户登陆
  $(".mask_reg .reg").on("click", function () {
    $(".mask_reg").fadeOut();
    $(".mask_index").fadeIn();
  });

  //关闭弹出层--登陆
  $(".mask_index .close_wrapper").on("click", function () {
    $(".mask_index").fadeOut();
  });

  //关闭弹出层--注册
  $(".mask_reg .close_wrapper").on("click", function () {
    $(".mask_reg").fadeOut();
    //对注册提示进行初始化
    $(".mask_reg .tips").text(
      "Phone number must be" + accountLength + " digit"
    );
    stepShow();
  });

  //充值成功，刷新余额
  $(".mask_pay .loginBtn").on("click", function () {
    getUserCoin(getUserCoinSuccess);
    $(".mask_pay").fadeOut();
  });

  //关闭弹出层--充值
  $(".mask_pay .close_wrapper,.mask_pay .cancelBtn").on("click", function () {
    $(".mask_pay").fadeOut();
  });

  //发送验证码按钮 -- 用户注册
  $(".mask_reg .verCodeSendBtn").on("click", function () {
    if (!$(this).hasClass("dis")) {
      sendVerCode(reg_account, sendVerCodeSuccess);
    }
  });
  $(".userName").on("input", function () {
    var val = $(this).val();
    if (!/^\d+$/g.test(val)) {
      $(this).val(val.match(/\d+/g) ? val.match(/\d+/g)[0] : "");
    }
  });
  $("#J_rank").on("click", function () {
    location.href = localUrl + "rank.html";
  })
  $("#J_mode").on("click", function () {
    location.href = url + "geggs";
  })
  //发送验证码按钮 -- 用户登陆
  $(".mask_index .verCodeSendBtn").on("click", function () {
    var account = parseInt($.trim($(".mask_index .userName").val())).toString();
    if (account.length == 0 || account === "") {
      showTips(".mask_index .tips", "Input you number");
      $(".mask_index .userName").focus();
      return;
    }
    if (account.length != accountLength) {
      showTips(
        ".mask_index .tips",
        "Phone number must be " + accountLength + " digit"
      );
      $(".mask_index .userName").focus();
      return;
    }
    hideTips(".mask_index .tips");
    reg_account = account;

    if (!$(this).hasClass("dis")) {
      sendVerCode(reg_account, sendVerCodeSuccess);
    }
  });

  //充值按钮
  $(".more-gold_pay").on("click", function () {
    if ($(this).hasClass("reCoin")) {
      //获取余额失败，手动刷新事件
      getUserCoin(getUserCoinSuccess);
    } else {
      //跳到充值
      $(".mask_pay").fadeIn();
      console.log("跳到充值地址");
    }
  });
  $(".logout-btn").on("click", function () {
    $(this).hide();
    localStorage.clear();
    userInfo();
    stepShow();
  });
  //进入PK场
  $("#J_gold-egg").on("click", function () {
    localStorage.setItem("startGoldEgg", null);
    if (localStorage.getItem("tokenCode") != undefined) {
      location.href = localUrl + "goldegg.html";
    } else {
      fromeGame = true;
      $("#login").click();
    }
  });

  //登陆按钮事件
  var bindLoginBtn = function () {
    $(".mask_index .loginBtn").on("click", function () {
      var verCode = $.trim($(".mask_index .verCode").val());
      if (verCode.length !== 4) {

        showTips(
          ".mask_index .tips",
          "code must 4 digit"
        );
        return false;
      }
      if (verCode.length == 0 || verCode === "") {
        showTips(".mask_index .tips", "请输入您收到的验证码");
        $(".mask_index .verCode").focus();
        return;
      }
      hideTips(".mask_index .tips");
      //校验验证码
      checkVerCode(
        verCode,
        parseInt($.trim($(".mask_index .userName").val())).toString(),
        checkVerCodeSuccess
      );
    });
  }


  //用户名验证
  $(".mask_reg .loginBtn").on("click", function () {
    if (reg_step === 1) {
      var account = $.trim($(".mask_reg .userName").val());
      if (account.length == 0 || account === "") {
        showTips(".mask_reg .tips", "Input your number");
        $(".mask_reg .userName").focus();
        return;
      }
      if (account.length != accountLength) {
        showTips(
          ".mask_reg .tips",
          "Phone number must be " + accountLength + " digit"
        );
        $(".mask_reg .userName").focus();
        return;
      }
      hideTips(".mask_reg .tips");
      reg_account = account;
      userVerificationSuccess();
    } else if (reg_step === 2) {
      var pwd = $.trim($(".mask_reg .userPwd").val());
      var rePwd = $.trim($(".mask_reg .reUserPwd").val());

      if (pwd.length == 0 || pwd === "") {
        showTips(".mask_reg .tips", "Input verification code");
        $(".mask_reg .userPwd").focus();
        return;
      }
      if (rePwd.length == 0 || rePwd === "") {
        showTips(".mask_reg .tips", "Confirm your password again");
        $(".mask_reg .reUserPwd").focus();
        return;
      }
      if (rePwd != pwd) {
        showTips(".mask_reg .tips", "The two passwords differ");
        $(".mask_reg .userPwd").focus();
        return;
      }
      hideTips(".mask_reg .tips");

      pwdConsistent();
    } else {
      var verCode = $.trim($(".mask_reg .verCode").val());
      if (verCode.length == 0 || verCode === "") {
        showTips(".mask_reg .tips", "Input verification code");
        $(".mask_reg .verCode").focus();
        return;
      }
      hideTips(".mask_reg .tips");
      //校验验证码
      checkVerCode(verCode, reg_account, checkVerCodeSuccess);
    }
  });


  //发送验证码倒计时
  var countdown = 30;

  function settime(obj) {
    if (countdown == 0) {
      obj.removeClass("active");
      obj.removeClass("dis");
      obj.text("Send");
      countdown = 30;
      return;
    } else {
      obj.addClass("dis");
      obj.text("resend(" + countdown + ")");
      countdown--;
    }
    setTimeout(function () {
      settime(obj);
    }, 1000);
  }

  //显示tips
  function showTips(el, content) {
    $(el)
      .text(content)
      .css("display", "inline-block");
  }

  //隐藏tips
  function hideTips(el) {
    $(el).fadeOut();
  }

  //根据标识显示对应的注册step
  function stepShow() {
    $(".step").hide();
    //显示当前步骤
    $(".step_" + reg_step).show();
    var smallLabel = $(".mask_reg small");
    var btn = $(".mask_reg .loginBtn");
    if (reg_step == 1) {
      smallLabel.html("<b>1/2</b>&nbsp;Input you unmber");
      btn.text("Next");
    } else if (reg_step == 2) {
      smallLabel.html("<b>2/3</b>&nbsp;Set a password for your account ");
      btn.text("Next");
    } else {
      smallLabel.html("<b>2/2</b>&nbsp;Make sure we can reach you");
      btn.text("Success!");
    }
  }

  /**
   * 用户登陆
   * @param {*} account
   * @param {*} pwd
   */
  function userLogin(account, pwd, callback) {
    var data = {
      unameOrEmail: account,
      password: pwd
    };
    doAjaxCall(url + "acc/unameOrEmailLogin", data, callback);
  }

  /**
   * 用户登陆成功操作
   * @param {*} data
   */
  function userLoginSuccess(data) {
    console.log(data)
    localStorage.setItem("tokenCode", data.data.token);
    localStorage.setItem("nickName", data.data.phone);
    userInfo();

    $(".mask_index").fadeOut();
  }

  //用户注册---用户名验证成功操作
  function userVerificationSuccess(data) {
    reg_step = 3;
    stepShow();
  }

  /**
   * 发送验证码事件
   * @param {*} account
   * @param {*} callback
   */
  function sendVerCode(account, callback) {
    var data = {
      phone: account,
      subCode: "regist",
      sName: "gold egg"
    };
    doAjaxCall(url + "vc/sendSmsVerifyCode", data, callback);
  }

  /**
   * 发送验证码成功
   * @param {*} data
   */



  function sendVerCodeSuccess(data) {
    $(".verCodeSendBtn").addClass("active");
    $(".loginBtn").removeClass("active");
    bindLoginBtn();
    settime($(".verCodeSendBtn"));
    //alert(data.data);
  }

  /**
   * 校验验证码接口
   * @param {*} verCode
   * @param {*} callback
   */
  function checkVerCode(verCode, account, callback) {
    var data = {
      verifyCode: verCode,
      phone: account
    };
    doAjaxCall(url + "acc/phoneVerifyCodeLogin", data, callback);
  }

  /**
   * 验证码校验成功
   * @param {*} data
   */
  function checkVerCodeSuccess(data) {
    reg_step = 1;
    if (data.code !== "0") {
      showTips(
        ".mask_index .tips",
        "Verification code error!"
      );
      return false;
    }
    $(".mask_reg,.mask_index").fadeOut();
    localStorage.setItem("tokenCode", data.data.token);
    localStorage.setItem("nickName", data.data.phone);

    userInfo();
    if (fromeGame) {
      fromeGame = false;
      location.href = localUrl + "goldegg.html";
    }
  }

  /**
   * 查询用户余额
   * @param {*} callback
   */
  function getUserCoin(callback) {
    var data = {
      token: localStorage.getItem("tokenCode"),
      coinType: "coinKen"
    };
    doAjaxCall(url + "coin/getUserCoin", data, callback);
  }

  /**
   * 查询余额成功
   * @param {*} data
   */
  function getUserCoinSuccess(data) {
    $(".my-gold").text(data.data);
  }

  //用户注册---两次密码一致验证成功
  function pwdConsistent() {
    reg_step = 3;
    stepShow();
  }

  /**
   * 检查用户是否登陆
   * 登陆，则显示用户对应信息
   * 否则，显示登陆按钮
   */
  function userInfo() {
    if (
      localStorage.getItem("tokenCode") != undefined ||
      localStorage.getItem("tokenCode") != null
    ) {
      $(".user-center").show();
      $(".user-login").hide();
      //-----------------------------------此处还需要对用户数据展示进行处理
      $(".user-name").text(localStorage.getItem("nickName"));
      $(".logout-btn").show();
      //查询用户余额
      getUserCoin(getUserCoinSuccess);
    } else {
      $(".logout-btn").hide();
      $(".user-center").hide();
      $(".user-login").show();
    }
  }
  /**
   * ajax请求方法
   * @param {*} url
   * @param {*} data
   * @param {*} callback
   */
  function doAjaxCall(url, data, callback) {
    logData(url, data);
    $.ajax(url, {
      data: data,
      dataType: "json",
      type: "post",
      timeout: 30000,
      success: function (data) {
        logData(url, data);
        if (data.code == 0) {
          callback && callback.call(this, data);
        } else {
          if (data.code === "password.error") {
            showTips(".mask_index .tips", "Phone number or Password Error");
            return;
          }
          if (data.code === "user.notExist") {
            showTips(
              ".mask_index .tips",
              "The user doesn't exist.make sure your number correctly"
            );
            return;
          }
          if (data.code === "coin.getUserCoinError") {
            $(".my-gold").text("--");
            $(".more-gold_pay")
              .addClass("reCoin")
              .text("Recharge");
            return;
          }
          if (data.code === "verifyCode.error") {
            showTips(
              ".mask_index .tips",
              "Verification code error"
            );
            return;
          }
          localStorage.clear();
          location.reload();
        }
      },
      error: function (xhr, type, errorThrown) { }
    });
  }

  /**
   * 用于日志查看
   * @param {*} url
   * @param {*} data
   */
  function logData(url, data) {
    console.log(url + "," + JSON.stringify(data));
  }
});