import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "../css/goldegg.scss";
import "font/iconfont.css";
import 'babel-polyfill';
import ajaxCallbackSingleton from 'js/ajaxCallback';
let ajaxCS = ajaxCallbackSingleton.init();
$(() => {
  let tempData = {
    chipIn:'KSH20',
    storage: localStorage,
    accountLength: 9,//电话号码位数
    fromeGame: false,//判断点击的是什么游戏
    fromeGame2: false,
    // 为什么要这么sb的写法，我也很无奈啊
    userName: '',//登录时的用户名
    password: '',//登录时密码
    registerUserName: '',//注册时的用户名
    registerPassword: '',//注册时的密码
    registerCode: '',//注册时的验证码
    forgotUsername: '',//找回的用户名
    forgotPassword: '',//找回的用户名
    forgotCode: '',
    inviteCode:'',
  }
  const randomKsh = (Math.random() * 3 + 5).toFixed(2);
  $("#random-ksh").html(randomKsh);
  ajaxCS.bindErrorHanding({
    [`${url}pay/m-pesa`]: {
      golbal() {
        console.log(1111)
        $('.mask_pay .tips').html('Recharge failed! Please top up to 290008 by Lipa na M-PESA').fadeIn();
      }
    },
  })
  // 显示提示消息
  let showTips = (msg, ele) => {
    ele = ele ? $(ele) : $('.mask_index .tips')
    ele.html(msg).show();
    setTimeout(() => {
      ele.fadeOut();
    }, 3000);
  }
  // 倒计时函数 
  let countDown = (time, callback, successCallback) => {
    if (time--) {
      callback(time);
      setTimeout(countDown, 1000, time, callback, successCallback)
    } else {
      successCallback();
    }
  }
  ajaxCS.bindErrorHanding({
    [`${url}coin/getUserCoin`]: {
      golbal() {
        tempData.storage.clear();
        location.reload();
        console.warn('Can\'t get coin info');
      }
    },
    [`${url}acc/phoneLogin`]: {
      golbal() {
        showTips('Login Error:Invalid account or password.');
      }
    },
    [`${url}vc/sendSmsVerifyCode`]: {
      ['para.error']() {
        showTips('Phone number Error');
      },
    },
    [`${url}acc/phoneReg`]: {
      ['user.exist']() {
        showTips('The account has already existed');
      },
      ['verifyCode.error']() {
        showTips("Verification code error");
      },
      ['para.error']() {
        showTips("Check your phone number");
      },
      ['invitecode.error'](){
        showTips("Invite Code Error");
      }
    }, [`${url}pay/m-pesa`]: {
      golbal() {
        console.log(1111)
        $('.mask_pay .tips').html('Recharge failed! Please top up to 290008 by Lipa na M-PESA').fadeIn();
      }
    },
    [`${url}pay/m-pesa`]: {
      golbal() {
        console.log(1111)
        $('.mask_pay .tips').html('Recharge failed! Please top up to 290008 by Lipa na M-PESA').fadeIn();
      }
    },
  })
  let isNewUser = ret => {
    if (!ret.free) {
      $(".cost-money").show();
      $(".free-icon").hide();

    } else {
      $(".free-icon").show();
      $(".cost-money").hide();
    }
  }
  // 绑定获取金币成功回调
  ajaxCS.bindSuccessHanding({
    [`${url}coin/getUserCoin`](ret) {
      $(".my-gold").text(ret.data);
      isNewUser(ret);
    }
  })
  // 获取金币请求
  let getUserIcon = () => {
    ajaxCS.send(
      `${url}coin/getUserCoin`,
      "POST",
      {
        token: tempData.storage.getItem("tokenCode"),
        coinType: "coinKen",
        service: "GOLDEGGS",
      }
    )
  }
  // 绑定登录成功
  ajaxCS.bindSuccessHanding({
    [`${url}acc/phoneLogin`](ret) {
      $(".mask_index").fadeOut();
      tempData.storage.setItem("tokenCode", ret.data.token);
      tempData.storage.setItem("nickName", ret.data.phone);
      $(".logout-btn").show();
      canAutoLogin();
    }
  })
  let toLogin = (userName, password, awardcode) => {
    let data = awardcode ? { phone: userName, pwd: password, awardcode } : { phone: userName, pwd: password };
    ajaxCS.send(`${url}acc/phoneLogin`, 'POST', data);
  }
  // 获取验证码
  let sendCode = function () {
    let username, password;
    if ($(this).data('getcode') === 'register') {
      username = tempData.registerUserName;
      password = tempData.registerPassword;
    } else if ($(this).data('getcode') === 'forgot') {
      username = tempData.forgotUsername;
      password = tempData.forgotPassword;
    }
    ajaxCS.send(`${url}vc/sendSmsVerifyCode`,
      'POST',
      {
        phone: username,
        subCode: "regist"
      }
    )
  }
  // 获取验证码成功回调
  ajaxCS.bindSuccessHanding({
    [`${url}vc/sendSmsVerifyCode`](ret) {
      $(".verCodeSendBtn").addClass("active");
      $('.verCodeSendBtn').off('click');
      countDown(30, (time) => {
        $(".verCodeSendBtn").html(time);
      }, () => {
        $(".verCodeSendBtn").removeClass("active").html('Get');
        $('.verCodeSendBtn').click(sendCode)
      })
    }
  })

  // 能否自动登录
  let canAutoLogin = () => {
    if (tempData.storage.getItem('tokenCode') != null) {
      $('.logout-btn').show();
      $(".user-name").text(tempData.storage.getItem("nickName"));
      getUserIcon();
      $(".user-center").show();
      $(".user-login").hide();
      $('.paybill').show();
    }
    // else {
    //     let nickName, token;
    //     document.cookie.split(';').forEach((item, index) => {
    //         console.log(item, index)
    //         if (/token/g.test(item)) {
    //             token = item.split("=")[1].trim();
    //             tempData.storage.setItem('tokenCode', token);
    //         }
    //         if (/phone/g.test(item)) {
    //             phone = item.split("=")[1].trim();
    //             tempData.storage.setItem('nickName', phone);
    //         }
    //     });
    //     if (nickName && token) {
    //         $('.logout-btn').show();
    //         $(".user-name").text(nickName);
    //         getUserIcon();
    //         $(".user-center").show();
    //         $(".user-login").hide();
    //     }
    // }
  }
  // 注册成功回调
  ajaxCS.bindSuccessHanding({
    [`${url}acc/phoneReg`](ret) {
      toLogin(tempData.registerUserName, tempData.registerPassword);
    }
  })
  ajaxCS.bindSuccessHanding({
    [`${url}acc/findPwd`](ret) {
      toLogin(tempData.forgotUsername, tempData.forgotPassword);
    }
  })

  ajaxCS.bindSuccessHanding({
    [`${url}challenge/winnerMarquee`](ret) {
    }
  })
  //********************************************************************************************************************************************** */

  canAutoLogin();
  // race-lamp
  ajaxCS.bindSuccessHanding({
    [`${url}challenge/winnerMarquee`]({ data }) {
      $('.jackpot').html(`${data[0].phone} : ${data[0].amount}`);
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
  ajaxCS.send(`${url}challenge/winnerMarquee`, 'POST', {
    page: 1,
    limit: 20
  })
  //关闭弹出层--登陆
  $(".close_wrapper").on("click touchend", function () {
    $(".mask_index").fadeOut();
  });
  //点击登陆按钮
  $("#login").on("click", function () {
    $(".mask_index .tips").hide();
    $(".mask_index").hide();
    $("#index-log1").fadeIn();
  });
  $('#signup').on('click', function () {
    $(".mask_index .tips").hide();
    $(".mask_index").hide();
    $("#index-log2").fadeIn();

  })
  // 点击注册按钮
  $('#register').click(function () {
    $(".mask_index .tips").hide();
    $(".mask_index").hide();
    $("#index-log2").show();
    $('.newUserName').val(tempData.userName);
    tempData.registerUserName = tempData.userName;
  })
  $("#goGetPassWord").click(function () {
    $(".mask_index .tips").hide();
    $(".mask_index").hide();
    $("#index-log3").show();
    tempData.forgotUsername = tempData.userName;
    $('.getUserName').val(tempData.userName);
  })
  // 跳回到登录框
  $(".tologin").click(function () {
    $(".mask_index .tips").hide();
    $(".mask_index").hide();
    $("#index-log1").show();
  })
  // 监听输入框变化
  $(".userName").on('input change', function () {
    tempData.userName = $(this).val();
  })
  $('.password').on('input change', function () {
    tempData.password = $(this).val();
  })

  $(".newUserName").on('input change', function () {
    tempData.registerUserName = $(this).val();
  })
  $(".newPassword").on('input change', function () {
    tempData.registerPassword = $(this).val();
  })
  $('.registerverCode').on('input change', function () {
    tempData.registerCode = $(this).val();
  })

  $(".getUserName").on('input change', function () {
    tempData.forgotUsername = $(this).val();
  })
  $(".getPassword").on('input change', function () {
    tempData.forgotPassword = $(this).val();
  })
  $('.findpwdCode').on('input change', function () {
    tempData.forgotCode = $(this).val();
  })
  $('.invitationCode').on('input change',function(){
    tempData.inviteCode = $(this).val();
  })
  // 注销按钮
  $("body").on('click', '.logout-btn', function () {
    localStorage.clear();
    location.reload();
  })

  // 登录游戏发起请求
  $('#userlogin').click(function () {
    toLogin(tempData.userName, tempData.password);
  })
  // 点击发送验证码
  $('.verCodeSendBtn').click(sendCode);
  $('#toregister').click(() => {
    ajaxCS.send(`${url}acc/phoneReg`,
      'POST',
      {
        phone: tempData.registerUserName,
        // verifyCode: tempData.registerCode,
        verifyCode: 1234,
        pwd: tempData.registerPassword,
        from: 'EGGES_H5',
        reward: randomKsh,
        inviteCode:tempData.inviteCode
      }
    )
  })

  $('#getNewPassword').click(() => {
    ajaxCS.send(`${url}acc/findPwd`,
      'POST',
      {
        phone: tempData.forgotUsername,
        verifyCode: tempData.forgotCode,
        pwd: tempData.forgotPassword
      }
    )
  })
  $('#J_mode').click(function () {
    location.href = simpleUrl;
  })
  $(".get-cash").click(function () {
    location.href = `${localUrl}cash.html`;
  })
  $('.topup-item').click(function () {
    ajaxCS.send(
      `${url}pay/m-pesa`,
      "POST",
      {
        token: tempData.storage.getItem('tokenCode'),
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
  $("#J_rank").on("click", function () {
    if (tempData.storage.getItem("tokenCode") == undefined) {
      $("#login").click();
    } else {
      location.href = `${localUrl}rank.html`
    }
  })
  $('.chipIn-item').on('click',function(){
      tempData.chipIn =$(this).data('chipinnum');
      $(this).addClass('active').siblings().removeClass('active');
  })
  $('#J_rules').on('click', function () {
    location.href = `${localUrl}rule.html`;
  })
  $('#J_invite').on('click', function () {
    if(!tempData.storage.getItem('tokenCode')) return false;
    location.href = `${localUrl}invite.html`;
  })
  if (tempData.storage.getItem('reguser') && tempData.storage.getItem('regpwd')) {
    toLogin(tempData.storage.getItem('reguser'), tempData.storage.getItem('regpwd'), tempData.storage.getItem('awardcode'));
  }
  if (tempData.storage.getItem('regToLogin')) {
    tempData.storage.removeItem('regToLogin');
    $("#login").click();
  }
  // ************************************************************************************************************************************
  let eventUtil, bindClick, noticeText, maskRender, domUtil, poxy;
  let nogiftPic = ['Goose', 'African-Elephant', 'Black-Headed-Heron', 'Grant-Gazelle', 'Grey-Crowned-Crane', 'Hippopotamu', 'Leopard', 'Lion', 'Marabou-Stork', 'Masai-Giraffe', 'Nile-Crocodile', 'Olive-Baboon', 'Pied-Kingfisher', 'Plain-Zebra', 'Red-Billed-Hornbill', 'Red-Billed-Oxpecker', 'Superb-Starling', 'White-Rhinoceros', 'Yellow-Billed-Stork'];
  let chooseNoGift = '';
  poxy = {
    ajax(_url, data) {
      $.ajax({
        type: "POST",
        url: url + _url,
        data: data,
        success: ret => {
          ret = $.parseJSON(ret);
          this.successCallback(ret);
        }
      })
    },
    successCallback(ret) {
      if (ret.code === "0") {
        console.log(ret)
        let {
          awardIndex,
          awardMoney,
          egg,
          isAward,
          coin,
          jackpot
        } = ret.data;
        eventUtil.openResult = ret.data;
        domUtil.openEgg(awardIndex, awardMoney, isAward, coin,jackpot);
        domUtil.showOtherResult(egg, awardIndex);
      } else {
        if (ret.code === "coin.insufficient") {
          $('.mask_pay').fadeIn();
          $("#J_mask").fadeIn();
        } else {
          location.replace(localUrl + "index.html");
        }
      }
    }
  }
  domUtil = {
    randomNoGiftPic() {
      return nogiftPic[~~(nogiftPic.length * Math.random())];
    },
    setEggs() {
      $('.eggs-container').html('');
      $.each([1,2,3,4,5],function(index,item){
        $('.eggs-container').append('<div class="egg-wrap-'+item+' egg-wrap"><img src="/" alt="" class="egg-pic" /><!-- <i class="egg-num">1</i> --></div>')
      })
      setTimeout(function(){
        $(".egg-wrap").each((index, item) => {
          $(item).find('img').attr('src', require(`../img/eggpic/eggs${Math.floor(Math.random() * 20) + 1}.png`));
          $(item).css({
            transform: "rotate(" + 360 / 5 * index + "deg) translateY(3rem) rotate(" + -360 / 5 * index + "deg)",
            webkitTransform: "rotate(" + 360 / 5 * index + "deg) translateY(3rem) rotate(" + -360 / 5 * index + "deg)",
            oTransform: "rotate(" + 360 / 5 * index + "deg) translateY(3rem) rotate(" + -360 / 5 * index + "deg)",
          })
        })
      },50)
     
    },
    reset:function(){
      $('#J_result').hide();
      this.setEggs();
      bindClick.eggs();
    },
    // show Other Result
    // showOtherResult() {
    //   const data = eventUtil.openResult;
    //   let {
    //     egg,
    //     awardIndex
    //   } = data;
    //   $(".egg-wrap").each((index, item) => {
    //     ((index, item) => {
    //       setTimeout(() => {
    //         if (index + 1 == awardIndex) {
    //           $(item).html("<img src='"+require('../img/Goose.png')+"' alt='' class='egg-pic'><p class='result-egg-p pink'>" + egg[index].showMoney + "</p>");
    //         } else {
    //           $(item).html("<img src='"+require('../img/Goose.png')+"' alt='' class='egg-pic'><p class='result-egg-p'>" + egg[index].showMoney + "</p>");
    //         }
    //       }, 300 * index)
    //     })(index, item)
    //   })
    //   setTimeout(() => {
    //     $("#J_game-box").append("<div class='ready-go' id='J_ready-go'>3</div>");
    //     eventUtil.countDown(3, $("#J_ready-go"), () => {
    //       location.reload();
    //     })
    //   }, 2000)
    // },
    // openEgg(awardIndex, awardMoney, isAward, coin) {
    //   $("#J_result-wrap").remove();
    //   const giftHtml = "";
    //   const giftImg = isAward ? "<img src=" + require("../img/gift.gif") + "?" + new Date().getTime() + "  class='result-pic'/>" : "<img src=" + require('../img/nogift.gif') + "?" + new Date().getTime() + "  class='result-pic'/>";
    //   const resultHtml = "<div class='result-wrap' id='J_result-wrap'>\
    //     <div class='result-mask'></div>" + giftImg + "<i class='result-num'>" + awardIndex + "</i>\
    //     </div>";
    //   $("document,body").append(resultHtml);
    //   setTimeout(function () {
    //     if (isAward) {
    //       $("#J_result-wrap").append("<div class='result-gift'><h2>Congratulations</h2><p class='result-gift-p'>You won Ksh <b class='result-gift-b'>" + awardMoney + " </b>Ksh</p></div>");
    //     } else {
    //       $("#J_result-wrap").append("<div class='result-gift'><img src='" + require('../img/' + chooseNoGift + '.png') + "'/><p class='result-gift-p'>You got a "+chooseNoGift+"!</br> Try again. </p></div>");
    //     }
    //     $("#J_result-wrap").append("<div class='cur-bal'>Current Bal: Ksh <b class='cur-bal-b'>" + coin + "</b></div>");
    //     $("#J_result-wrap").append("<div class='result-text'>Time out: <b id='J_sr-time'>3</b></div>");
    //     eventUtil.countDown(3, $("#J_sr-time"), () => {
    //       $("#J_result-wrap").remove();
    //       domUtil.showOtherResult();
    //     })
    //   }, 3000)
    // }，
    openEgg(awardIndex, awardMoney, isAward, coin,jackpot) {
        $('.jackpot').html(`Jackpot : ${jackpot}`); 
      $('.my-gold').html(coin);
      if (isAward) {
        $('.result-box').html(`LUCKY!!!</br>You won ${awardMoney} Ksh!`);
      } else {
        chooseNoGift = domUtil.randomNoGiftPic();
        $('.result-box').html(`GENIUS!!!</br>You got a ${chooseNoGift.replace(/-/g, ' ')}`);
      }
      $('#J_result').fadeIn();
    },
    showOtherResult(egg, awardIndex) {
      $(".egg-wrap").each((index, item) => {
        ((index, item) => {
          setTimeout(() => {
            let html = '';
            if (egg[index].rank >= 1 && egg[index].rank <= 3) {
              html += "<img src='" + require('../img/winGift-' + egg[index].rank + '.png') + "' alt='' class='egg-pic'>"
            } else {
              if (chooseNoGift && index + 1 == awardIndex) {
                html += "<img src='" + require('../img/animal/' + chooseNoGift.replace(/-/g, '') + '.png') + "' alt='' class='egg-pic'>"
              } else {
                html += "<img src='" + require('../img/animal/' + domUtil.randomNoGiftPic().replace(/-/g, '') + '.png') + "' alt='' class='egg-pic'>"
              }
            }
            if (index + 1 == awardIndex) {
              html += "<p class='result-egg-p red'>" + egg[index].showMoney + "</p>";
            } else {
              html += "<p class='result-egg-p'>" + egg[index].showMoney + "</p>";
            }
            $(item).html(html);
          }, 300 * index)
        })(index, item)
      })
    },
  }
  eventUtil = {
    eggIndex: 0,
    inGameBox: false,
    // result countDown
    countDown(time, dom, callback) {
      if (time--) {
        setTimeout(() => {
          dom.html(time);
          this.countDown(time, dom, callback);
        }, 1000)
      } else {
        callback();
      }
    },
    // gamebox position
    getGameBoxPos (){
      const gameBox = $("#J_game-box");
      return {
        x: gameBox.get(0).getBoundingClientRect().left,
        y: gameBox.get(0).getBoundingClientRect().top,
        width: gameBox.width(),
        height: gameBox.height(),
      }
    },
    // hammer size
    hammerSize: (() => ({
      width: $("#J_hammer").width(),
      height: $("#J_hammer").height(),
    }))(),
    // touchpos
    touchPos(_e) {
      const e = _e || window.event;
      const x = e.originalEvent.touches[0].pageX & e.originalEvent.changedTouches[0].pageX & e.originalEvent.targetTouches[0].pageX;
      const y = e.originalEvent.touches[0].pageY & e.originalEvent.changedTouches[0].pageY & e.originalEvent.targetTouches[0].pageY;
      return {
        x: x,
        y: y,
      }
    },
    // set hammer position
    setHammerPos(e) {
      const touchPos = this.touchPos(e);
      const gameBoxPos=  this.getGameBoxPos()
      const {
        hammerSize
      } = this;
      console.log(touchPos)
      let x = touchPos.x - gameBoxPos.x - hammerSize.width / 2,
        y = touchPos.y - gameBoxPos.y - hammerSize.height / 2-$(document).scrollTop();
      // x = x < 0 ? 10 : x;
      // x = x > gameBoxPos.width - hammerSize.width / 2 ? gameBoxPos.width - hammerSize.width / 2 - 10 : x;
      // y = y < 0 ? 10 : y;
      // y = y > gameBoxPos.height - hammerSize.height / 2 ? gameBoxPos.height - hammerSize.height / 2 - $(document).scrollTop() : y - $(document).scrollTop();;
      $("#J_hammer").css({
        left: x + "px",
        top: y + "px",
      })
    }
  }
  bindClick = {
    notOpen() {
      $("#J_notopen").click(() => {
        $("#J_mask").fadeOut();
      })
    },
    confrim() {
      $("#J_confrim").click(() => {
        $("#J_mask").hide();
        $(".egg-wrap").off("click");
        poxy.ajax("kenegg/go", {
          index: eventUtil.eggIndex,
          token: localStorage.getItem("tokenCode"),
          price:tempData.chipIn,
        })
      });
    },
    eggs() {
      // egg click
      $(".egg-wrap").on('touchstart',function (e) {
        if (tempData.storage.getItem("tokenCode") == undefined) {
          setTimeout(()=>{
            $("#login").click();
          },100)
          return;
        }
        $(".egg-wrap").off("click");
        eventUtil.eggIndex = $(this).index() + 1;
        eventUtil.setHammerPos(e);

        // $(this)  
        // .find(".egg-pic")
        // .remove()
        // .end()
        // .append("<img src=" + require("../img/egg-full-act.png") + " alt='' class='egg-pic'>")
        // .siblings(".egg-wrap")
        // .find(".egg-pic")
        // .remove()
        // .end()
        // .append("<img src=" + require("../img/egg-full.png") + " alt='' class='egg-pic'>")
        // setTimeout(function () {
        // maskRender.render("confrim");
        // $("#J_mask").fadeIn();
        poxy.ajax("kenegg/go", {
          index: eventUtil.eggIndex,
          token: localStorage.getItem("tokenCode"),
          price:tempData.chipIn,
        })
        // }, 300)
      })
    },
  }
  // errortext
  // noticeText = {
  //   insufficient: {
  //     title: "Balance is insufficient",
  //     textp: "Balance is insufficient，please top up to continue.",
  //   },
  //   confrim: {
  //     title: "Confirmed",
  //     textp: "Are you sure?</br> open this Egg!"
  //   },

  // }
  // maskRender = {
  //   clearCustom() {
  //     $("#J_custom").remove();
  //   },
  //   confrim() {
  //     this.clearCustom();
  //     $(".pop-tit").html(noticeText.confrim.title);
  //     $(".pop-notice-text").html(noticeText.confrim.textp);
  //     $("#J_mask-pop").append(
  //       "<div id='J_custom'>\
  //       <div class='btn-group'>\
  //         <div class='btn-item btn-blue' id='J_notopen'>NO</div>\
  //         <div class='btn-item btn-pink' id='J_confrim'>YES SURE</div>\
  //       </div>\
  //     </div>")
  //     bindClick.notOpen();
  //     bindClick.confrim();
  //   },
  //   insufficient() {
  //     this.clearCustom();
  //     $(".pop-tit").html("<p style='font-size:.7rem'>" + noticeText.insufficient.title + "</p>");
  //     $(".pop-notice-text").html(noticeText.insufficient.textp);
  //     $("#J_mask-pop").append(
  //       "<div id='J_custom'>\
  //       <h3 class='pop-h3'>Pay bill <b>290008</b></h3>\
  //       <div class='btn-group'>\
  //         <a href='" + localUrl + "index.html'><div class='btn-item btn-pink' id='J_notopen'>HOME</div></a>\
  //       </div>\
  //     </div>")
  //     bindClick.notOpen();
  //   },
  //   render(name) {
  //     this[name]();
  //   }
  // }
  domUtil.setEggs();
  bindClick.eggs();
  // Again
  // $("#J_new-game").click(() => {
  //   location.reload();
  // });
  // $("#J_go-home").click(() => {
  //   location.replace(localUrl + 'main.html');
  // });
  $("#J_game-box").on("touchstart", (e) => {
    eventUtil.inGameBox = true;
  });
  $("#J_game-box").on("touchend", (e) => {
    eventUtil.inGameBox = false;
  });
  // $("#J_game-box").on("touchstart", (e) => {
  //   eventUtil.setHammerPos(e);
  // });
  // $("#J_game-box").on("touchmove", (e) => {
  //   eventUtil.setHammerPos(e);
  // });
  $('#J_again').click(function () {
   domUtil.reset();
  })
})