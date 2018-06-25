import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "font/iconfont.css";
import "../css/index.scss";
import ajaxCallbackSingleton from 'js/ajaxCallback';
let ajaxCS = ajaxCallbackSingleton.init();
// if (!(navigator.userAgent.indexOf('Android') > -1) && !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
//   location.href = url + "geggs";
// }
if ((navigator.userAgent.indexOf('Opera Mini') > -1) || Object.prototype.toString.call(window.operamini) ===
  "[object OperaMini]" || !"onresize" in window) {
  location.href = url + "geggs";
}
ajaxCS.bindErrorHanding({
  [`${url}pay/m-pesa`]: {
    golbal() {
      console.log(1111)
      $('.mask_pay .tips').html('Recharge failed! Please top up to 290008 by Lipa na M-PESA').fadeIn();
    }
  },
})
ajaxCS.bindSuccessHanding({
  [`${url}pay/m-pesa`](ret) {
    $('.mask_pay .tips').html('Recharge succeed! Please input your Pin through mpesa menu.thanks').fadeIn();
  }
})
$('.topup-item').click(function () {
  ajaxCS.send(
    `${url}pay/m-pesa`,
    "POST",
    {
      token: localStorage.getItem('tokenCodeEgg'),
      amount: $(this).data('topup')
    }
  )
  $('.mask_pay .tips').html('Waiting...').fadeIn();
})
$('.more-gold_pay').click(() => {
  $('.mask_pay .tips').html('').hide();
  $('.mask_pay').fadeIn();
})
$('.relode-topup').click(function () {
  location.reload();
})
let isNewUser = ret => {
  if (!ret.free) {
    $(".free-icon").hide();

  } else {
    $(".free-icon").show();
  }
}
/*首页相关 --- wyj 2018 05 03 */
var accountLength = 9; //登陆账号长度
var reg_step = 1; //记录用户注册当前到第几部
var reg_account = "";
var fromeGame = false;
var verCode = '';
var newUserName = '';
var newPassword = '';
var getUserName = '';
var getPassword = '';
var userName = '';
$(function () {
  //判断用户token是否存在
  userInfo();
  //点击登陆按钮
  $("#login").on("click", function () {
    hideTips(".mask_index .tips");
    $("#index-log1").fadeIn();

  });
  $('#register').click(function () {
    hideTips(".mask_index .tips");

    $(".mask_index").hide();
    $("#index-log2").show();
    newUserName = userName;
    $('.newUserName').val(userName);
  })
  $(".tologin").click(function () {
    hideTips(".mask_index .tips");

    $(".mask_index").hide();
    $("#index-log1").show();

  })
  $("#goGetPassWord").click(function () {
    hideTips(".mask_index .tips");

    $(".mask_index").hide();
    $("#index-log3").show();
    getUserName = userName;
    $('.getUserName').val(userName);
  })
  //关闭弹出层--充值
  $(".mask_pay .close_wrapper,.mask_pay .cancelBtn").on("click", function () {
    $(".mask_pay").fadeOut();
  });
  //关闭弹出层--登陆
  $(".mask_index .close_wrapper").on("click", function () {
    $(".mask_index").fadeOut();
  });
  //充值成功，刷新余额
  $(".mask_pay .loginBtn").on("click", function () {
    getUserCoin(getUserCoinSuccess);
    $(".mask_pay").fadeOut();
  });
  function bindLoginBtn() {
    var username = '';
    var pwd = '';
    $('.userName').on('input change', function () {
      username = $(this).val();
    })
    $('.password').on('input change', function () {
      pwd = $(this).val();
    })

    $('#userlogin').click(function () {
      loginOld(username, pwd);
    })
  }
  bindLoginBtn();
  $(".userName").on('input', function () {
    userName = $(this).val();
  })
  $(".newUserName").on('input', function () {
    newUserName = $(this).val();
  })
  $('.newPassword').on('input', function () {
    newPassword = $(this).val();
  })
  $(".verCode").on('input', function () {
    verCode = $(this).val();
  })
  $('.getUserName').on('input', function () {
    getUserName = $(this).val();
  })
  $(".getPassword").on('input', function () {
    getPassword = $(this).val();
  })
  $(".mask_index .verCodeSendBtn").on("click", function () {
    if ($(this).data('forgot') == true) {
      if (getPassword.length <= 3) {
        showTips(".mask_index .tips", 'Password is too short');
      } else {
        if (!$(this).hasClass("dis")) {
          sendVerCode(getUserName, sendVerCodeSuccess);
        }
      }
    } else {
      if (newPassword.length <= 3) {
        showTips(".mask_index .tips", 'Password is too short');
      } else {
        if (!$(this).hasClass("dis")) {
          console.log(newUserName)
          sendVerCode(newUserName, sendVerCodeSuccess);
        }
      }
    }
  });
  //登陆按钮事件
  function loginOld(newUserName, newPassword) {
    $.ajax({
      url: url + 'acc/phoneLogin',
      data: {
        phone: newUserName,
        pwd: newPassword
      },
      success: function (ret) {
        ret = $.parseJSON(ret);
        if (ret.code === "0") {
          $(".mask_index").fadeOut();
          localStorage.setItem("tokenCodeEgg", ret.data.token);
          localStorage.setItem("nickName", ret.data.phone);
          $(".logout-btn").show();
          userInfo();
        } else {
          showTips(".mask_index .tips", "Login Error:Invalid account or password.");
          // if (ret.code === "password.error") {
          //   showTips(".mask_index .tips", "Error passowrd");
          // } else if (ret.code === "login.overLimit") {
          //   showTips(".mask_index .tips", "Wrong password input reaches the upper limit<br/>please try again later");
          // } else if (ret.code === "para.error") {
          //   showTips(".mask_index .tips", "Invalid password or phone number");
          // } else if (ret.code === "user.notExist") {
          //   showTips(".mask_index .tips", "Your count is not exist");
          // }
        }
      }
    })
  }
  $("#toregister").on("click", function () {
    $.ajax({
      url: url + "acc/phoneReg",
      data: {
        phone: newUserName,
        verifyCode: verCode,
        pwd: newPassword,
        from: 'EGGES_H5'
      },
      success: function (ret) {
        ret = $.parseJSON(ret);
        console.log(url + "acc/phoneReg", ret, '==============获取注册返回值')
        if (ret.code === "0") {
          loginOld(newUserName, newPassword);
        } else {
          if (ret.code === 'user.exist') {
            showTips(".mask_index .tips", "user.exist");
          }
        }
      }
    })
  })
  $("#J_rank").on("click", function () {
    location.href = localUrl + "rank.html";
  })
  $("#J_mode").on("click", function () {
    location.href = url + "geggs";
  })
  $(".get-cash").click(function () {
    console.log(localStorage.getItem('tokenCodeEgg'))
    location.href = localUrl + 'cash.html';
  })
  $("#getNewPassword").click(function () {
    $.ajax({
      url: url + "acc/findPwd",
      data: {
        phone: getUserName,
        verifyCode: verCode,
        pwd: getPassword
      },
      success: function (ret) {
        ret = $.parseJSON(ret);
        console.log(url + "acc/findPwd", ret, '==============获取注册返回值')
        if (ret.code === "0") {
          loginOld(getUserName, getPassword);
        } else {
          showTips(".mask_index .tips", "para error");
        }
      }
    })
  })

  $(".logout-btn").on("click", function () {
    $(this).hide();
    localStorage.clear();
    location.reload();
  });
  //进入PK场
  $("#J_gold-egg").on("click", function () {
    localStorage.setItem("startGoldEgg", null);
    if (localStorage.getItem("tokenCodeEgg") != undefined) {
      location.href = localUrl + "goldegg.html";
    } else {
      fromeGame = true;
      $("#login").click();
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
    setTimeout(function () {
      hideTips(el);
    }, 3000);
  }

  //隐藏tips
  function hideTips(el) {
    $(el).fadeOut();
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



  function sendVerCodeSuccess(data) {
    settime($(".verCodeSendBtn"));
    $(".verCodeSendBtn").addClass("active");
    $(".login-btn.register").addClass("active");
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
   * 查询用户余额
   * @param {*} callback
   */
  function getUserCoin(callback) {
    var data = {
      token: localStorage.getItem("tokenCodeEgg"),
      coinType: "coinKen",
      service: "GOLDEGGS",
    };
    doAjaxCall(url + "coin/getUserCoin", data, callback);
  }

  /**
   * 查询余额成功
   * @param {*} data
   */
  function getUserCoinSuccess(data) {
    $(".my-gold").text(data.data);
    isNewUser(data)
  }


  /**
   * 检查用户是否登陆
   * 登陆，则显示用户对应信息
   * 否则，显示登陆按钮
   */
  function userInfo() {
    if (localStorage.getItem('tokenCodeChallenge')) {
      localStorage.setItem('tokenCodeEgg', localStorage.getItem('tokenCodeChallenge'));
    }
    if (
      localStorage.getItem("tokenCodeEgg") != undefined ||
      localStorage.getItem("tokenCodeEgg") != null
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
    $.ajax(url, {
      data: data,
      dataType: "json",
      type: "post",
      timeout: 30000,
      success: function (data) {
        console.log(data);
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
          if (data.code === "para.error") {
            showTips(
              ".mask_index .tips",
              "Phone or verCode error"
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
});


ajaxCS.bindSuccessHanding({
  [`${url}kenegg/winnerMarquee`]({ data }) {
    let html = '';
    data.sort(() => .5 - Math.random()).map((item, i) => {
      html += `<li>${item.phone} ${item.type} ${item.amount}ksh！</li>`;
    })

    $('#J_lamp-scroll').html(`<ul class ='lamp-item' id ='J_lamp'>${html}</ul><ul class ='lamp-item'>${html}</ul>`);
    setInterval(() => {
      if ($('#J_lamp-scroll').position().left < -$('#J_lamp').width()) {
        $('#J_lamp-scroll').css('left', 0);
      } else {
        $('#J_lamp-scroll').css('left', `${$('#J_lamp-scroll').position().left - 1}px`);
      }
    }, 20)
  }
})
ajaxCS.send(`${url}kenegg/winnerMarquee`, 'POST', {
  page: 1,
  limit: 20
})