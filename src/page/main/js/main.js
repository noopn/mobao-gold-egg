// import $ from "jquery";
// import {
//   url,
//   localUrl
// } from "cfg/cfg.json";
// import "css/reset.scss";
// import "css/common.scss";
// import "font/iconfont.css";
// import "../css/index.scss";
// import ajaxCallbackSingleton from 'js/ajaxCallback';
// let ajaxCS = ajaxCallbackSingleton.init();
// // if (!(navigator.userAgent.indexOf('Android') > -1) && !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
// //   location.href = url + "geggs";
// // }
// if ((navigator.userAgent.indexOf('Opera Mini') > -1) || Object.prototype.toString.call(window.operamini) ===
//   "[object OperaMini]" || !"onresize" in window) {
//   location.href = url + "geggs";
// }
// const randomKsh = (Math.random() * 3 + 5).toFixed(2);
// $("#random-ksh").html(randomKsh);
// ajaxCS.bindErrorHanding({
//   [`${url}pay/m-pesa`]: {
//     golbal() {
//       console.log(1111)
//       $('.mask_pay .tips').html('Recharge failed! Please top up to 290008 by Lipa na M-PESA').fadeIn();
//     }
//   },
// })
// ajaxCS.bindSuccessHanding({
//   [`${url}pay/m-pesa`](ret) {
//     $('.mask_pay .tips').html('Recharge succeed! Please input your Pin through mpesa menu.thanks').fadeIn();
//   }
// })
// $('.topup-item').click(function () {
//   ajaxCS.send(
//     `${url}pay/m-pesa`,
//     "POST",
//     {
//       token: localStorage.getItem('tokenCode'),
//       amount: $(this).data('topup')
//     }
//   )
//   $('.mask_pay .tips').html('Waiting...').fadeIn();
// })
// $('.more-gold_pay').click(() => {
//   $('.mask_pay .tips').html('').hide();
//   $('.mask_pay').fadeIn();
// })
// $('.relode-topup').click(function () {
//   location.reload();
// })
// let isNewUser = ret => {
//   if (!ret.free) {
//     $(".free-icon").hide();

//   } else {
//     $(".free-icon").show();
//   }
// }
// /*首页相关 --- wyj 2018 05 03 */
// var accountLength = 9; //登陆账号长度
// var reg_step = 1; //记录用户注册当前到第几部
// var reg_account = "";
// var fromeGame = false;
// var verCode = '';
// var newUserName = '';
// var newPassword = '';
// var getUserName = '';
// var getPassword = '';
// var userName = '';
// $(function () {
//   //判断用户token是否存在
//   userInfo();
//   //点击登陆按钮
//   $("#login").on("click", function () {
//     hideTips(".mask_index .tips");
//     $("#index-log2").fadeIn();

//   });
//   $('#register').click(function () {
//     hideTips(".mask_index .tips");

//     $(".mask_index").hide();
//     $("#index-log2").show();
//     newUserName = userName;
//     $('.newUserName').val(userName);
//   })
//   $(".tologin").click(function () {
//     hideTips(".mask_index .tips");

//     $(".mask_index").hide();
//     $("#index-log1").show();

//   })
//   $("#goGetPassWord").click(function () {
//     hideTips(".mask_index .tips");

//     $(".mask_index").hide();
//     $("#index-log3").show();
//     getUserName = userName;
//     $('.getUserName').val(userName);
//   })
//   //关闭弹出层--充值
//   $(".mask_pay .close_wrapper,.mask_pay .cancelBtn").on("click", function () {
//     $(".mask_pay").fadeOut();
//   });
//   //关闭弹出层--登陆
//   $(".mask_index .close_wrapper").on("click", function () {
//     $(".mask_index").fadeOut();
//   });
//   //充值成功，刷新余额
//   $(".mask_pay .loginBtn").on("click", function () {
//     getUserCoin(getUserCoinSuccess);
//     $(".mask_pay").fadeOut();
//   });
//   function bindLoginBtn() {
//     var username = '';
//     var pwd = '';
//     $('.userName').on('input change', function () {
//       username = $(this).val();
//     })
//     $('.password').on('input change', function () {
//       pwd = $(this).val();
//     })

//     $('#userlogin').click(function () {
//       loginOld(username, pwd);
//     })
//   }
//   bindLoginBtn();
//   $(".userName").on('input', function () {
//     userName = $(this).val();
//   })
//   $(".newUserName").on('input', function () {
//     newUserName = $(this).val();
//   })
//   $('.newPassword').on('input', function () {
//     newPassword = $(this).val();
//   })
//   $(".verCode").on('input', function () {
//     verCode = $(this).val();
//   })
//   $('.getUserName').on('input', function () {
//     getUserName = $(this).val();
//   })
//   $(".getPassword").on('input', function () {
//     getPassword = $(this).val();
//   })
//   $(".mask_index .verCodeSendBtn").on("click", function () {
//     if ($(this).data('forgot') == true) {
//       if (getPassword.length <= 3) {
//         showTips(".mask_index .tips", 'Password is too short');
//       } else {
//         if (!$(this).hasClass("dis")) {
//           sendVerCode(getUserName, sendVerCodeSuccess);
//         }
//       }
//     } else {
//       if (newPassword.length <= 3) {
//         showTips(".mask_index .tips", 'Password is too short');
//       } else {
//         if (!$(this).hasClass("dis")) {
//           console.log(newUserName)
//           sendVerCode(newUserName, sendVerCodeSuccess);
//         }
//       }
//     }
//   });
//   //登陆按钮事件
//   function loginOld(newUserName, newPassword) {
//     $.ajax({
//       url: url + 'acc/phoneLogin',
//       data: {
//         phone: newUserName,
//         pwd: newPassword
//       },
//       success: function (ret) {
//         ret = $.parseJSON(ret);
//         if (ret.code === "0") {
//           $(".mask_index").fadeOut();
//           localStorage.setItem("tokenCode", ret.data.token);
//           localStorage.setItem("nickName", ret.data.phone);
//           $(".logout-btn").show();
//           userInfo();
//         } else {
//           showTips(".mask_index .tips", "Login Error:Invalid account or password.");
//           // if (ret.code === "password.error") {
//           //   showTips(".mask_index .tips", "Error passowrd");
//           // } else if (ret.code === "login.overLimit") {
//           //   showTips(".mask_index .tips", "Wrong password input reaches the upper limit<br/>please try again later");
//           // } else if (ret.code === "para.error") {
//           //   showTips(".mask_index .tips", "Invalid password or phone number");
//           // } else if (ret.code === "user.notExist") {
//           //   showTips(".mask_index .tips", "Your count is not exist");
//           // }
//         }
//       }
//     })
//   }
//   $("#toregister").on("click", function () {
//     $.ajax({
//       url: url + "acc/phoneReg",
//       data: {
//         phone: newUserName,
//         // verifyCode: verCode,
//         verifyCode: 1234,
//         pwd: newPassword,
//         from: 'EGGES_H5',
//         reward:randomKsh
//       },
//       success: function (ret) {
//         ret = $.parseJSON(ret);
//         console.log(url + "acc/phoneReg", ret, '==============获取注册返回值')
//         if (ret.code === "0") {
//           loginOld(newUserName, newPassword);
//         } else {
//           if (ret.code === 'user.exist') {
//             showTips(".mask_index .tips", "user.exist");
//           }
//         }
//       }
//     })
//   })
//   $("#J_rank").on("click", function () {
//     location.href = localUrl + "rank.html";
//   })
//   $("#J_mode").on("click", function () {
//     location.href = url + "geggs";
//   })


//   $("#getNewPassword").click(function () {
//     $.ajax({
//       url: url + "acc/findPwd",
//       data: {
//         phone: getUserName,
//         verifyCode: verCode,
//         pwd: getPassword
//       },
//       success: function (ret) {
//         ret = $.parseJSON(ret);
//         console.log(url + "acc/findPwd", ret, '==============获取注册返回值')
//         if (ret.code === "0") {
//           loginOld(getUserName, getPassword);
//         } else {
//           showTips(".mask_index .tips", "para error");
//         }
//       }
//     })
//   })

//   $(".logout-btn").on("click", function () {
//     $(this).hide();
//     localStorage.clear();
//     location.reload();
//   });


//   //发送验证码倒计时
//   var countdown = 30;

//   function settime(obj) {
//     if (countdown == 0) {
//       obj.removeClass("active");
//       obj.removeClass("dis");
//       obj.text("Send");
//       countdown = 30;
//       return;
//     } else {
//       obj.addClass("dis");
//       obj.text("resend(" + countdown + ")");
//       countdown--;
//     }
//     setTimeout(function () {
//       settime(obj);
//     }, 1000);
//   }

//   //显示tips
//   function showTips(el, content) {
//     $(el)
//       .text(content)
//       .css("display", "inline-block");
//     setTimeout(function () {
//       hideTips(el);
//     }, 3000);
//   }

//   //隐藏tips
//   function hideTips(el) {
//     $(el).fadeOut();
//   }


//   /**
//    * 用户登陆
//    * @param {*} account
//    * @param {*} pwd
//    */
//   function userLogin(account, pwd, callback) {
//     var data = {
//       unameOrEmail: account,
//       password: pwd
//     };
//     doAjaxCall(url + "acc/unameOrEmailLogin", data, callback);
//   }

//   /**
//    * 发送验证码事件
//    * @param {*} account
//    * @param {*} callback
//    */
//   function sendVerCode(account, callback) {
//     var data = {
//       phone: account,
//       subCode: "regist",
//       sName: "gold egg"
//     };
//     doAjaxCall(url + "vc/sendSmsVerifyCode", data, callback);
//   }



//   function sendVerCodeSuccess(data) {
//     settime($(".verCodeSendBtn"));
//     $(".verCodeSendBtn").addClass("active");
//     $(".login-btn.register").addClass("active");
//     //alert(data.data);
//   }

//   /**
//    * 校验验证码接口
//    * @param {*} verCode
//    * @param {*} callback
//    */
//   function checkVerCode(verCode, account, callback) {
//     var data = {
//       verifyCode: verCode,
//       phone: account
//     };
//     doAjaxCall(url + "acc/phoneVerifyCodeLogin", data, callback);
//   }


//   /**
//    * 查询用户余额
//    * @param {*} callback
//    */
//   function getUserCoin(callback) {
//     var data = {
//       token: localStorage.getItem("tokenCode"),
//       coinType: "coinKen",
//       service: "GOLDEGGS",
//     };
//     doAjaxCall(url + "coin/getUserCoin", data, callback);
//   }

//   /**
//    * 查询余额成功
//    * @param {*} data
//    */
//   function getUserCoinSuccess(data) {
//     $(".my-gold").text(data.data);
//     isNewUser(data)
//   }


//   /**
//    * 检查用户是否登陆
//    * 登陆，则显示用户对应信息
//    * 否则，显示登陆按钮
//    */
//   function userInfo() {
//     if (localStorage.getItem('tokenCode')) {
//       localStorage.setItem('tokenCode', localStorage.getItem('tokenCode'));
//     }
//     if (
//       localStorage.getItem("tokenCode") != undefined ||
//       localStorage.getItem("tokenCode") != null
//     ) {
//       $(".user-center").show();
//       $(".user-login").hide();
//       //-----------------------------------此处还需要对用户数据展示进行处理
//       $(".user-name").text(localStorage.getItem("nickName"));
//       $(".logout-btn").show();
//       //查询用户余额
//       getUserCoin(getUserCoinSuccess);
//     } else {
//       $(".logout-btn").hide();
//       $(".user-center").hide();
//       $(".user-login").show();
//     }
//   }
//   /**
//    * ajax请求方法
//    * @param {*} url
//    * @param {*} data
//    * @param {*} callback
//    */
//   function doAjaxCall(url, data, callback) {
//     $.ajax(url, {
//       data: data,
//       dataType: "json",
//       type: "post",
//       timeout: 30000,
//       success: function (data) {
//         console.log(data);
//         if (data.code == 0) {
//           callback && callback.call(this, data);
//         } else {
//           if (data.code === "password.error") {
//             showTips(".mask_index .tips", "Phone number or Password Error");
//             return;
//           }
//           if (data.code === "user.notExist") {
//             showTips(
//               ".mask_index .tips",
//               "The user doesn't exist.make sure your number correctly"
//             );
//             return;
//           }
//           if (data.code === "coin.getUserCoinError") {
//             $(".my-gold").text("--");
//             $(".more-gold_pay")
//               .addClass("reCoin")
//               .text("Recharge");
//             return;
//           }
//           if (data.code === "verifyCode.error") {
//             showTips(
//               ".mask_index .tips",
//               "Verification code error"
//             );
//             return;
//           }
//           if (data.code === "para.error") {
//             showTips(
//               ".mask_index .tips",
//               "Phone or verCode error"
//             );
//             return;
//           }
//           localStorage.clear();
//           location.reload();
//         }
//       },
//       error: function (xhr, type, errorThrown) { }
//     });
//   }
// });


// ajaxCS.bindSuccessHanding({
//   [`${url}kenegg/winnerMarquee`]({ data }) {
//     let html = '';
//     data.sort(() => .5 - Math.random()).map((item, i) => {
//       html += `<li>${item.phone} ${item.type} ${item.amount}ksh！</li>`;
//     })

//     $('#J_lamp-scroll').html(`<ul class ='lamp-item' id ='J_lamp'>${html}</ul><ul class ='lamp-item'>${html}</ul>`);
//     setInterval(() => {
//       if ($('#J_lamp-scroll').position().left < -$('#J_lamp').width()) {
//         $('#J_lamp-scroll').css('left', 0);
//       } else {
//         $('#J_lamp-scroll').css('left', `${$('#J_lamp-scroll').position().left - 1}px`);
//       }
//     }, 20)
//   }
// })
// ajaxCS.send(`${url}kenegg/winnerMarquee`, 'POST', {
//   page: 1,
//   limit: 20
// })

import $ from "jquery";
import {
    url,
    localUrl,
    simpleUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "../css/main.scss";
import "font/iconfont.css";
import 'babel-polyfill';
import ajaxCallbackSingleton from 'js/ajaxCallback';
let ajaxCS = ajaxCallbackSingleton.init();
$(() => {
    let tempData = {
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
    }
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
            console.log(data)
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
                from: 'EGGES_H5'
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
    $("#J_gold-egg").on("click", function () {
        localStorage.setItem("startGoldEgg", null);
        if (localStorage.getItem("tokenCode") != undefined) {
            location.href = localUrl + "goldegg.html";
        } else {
            $("#login").click();
        }
    });
    $("#J_rank").on("click", function () {
        location.href = localUrl + "rank.html";
    })
    if (tempData.storage.getItem('reguser') && tempData.storage.getItem('regpwd')) {
        toLogin(tempData.storage.getItem('reguser'), tempData.storage.getItem('regpwd'), tempData.storage.getItem('awardcode'));
    }
    if (tempData.storage.getItem('regToLogin')) {
        tempData.storage.removeItem('regToLogin');
        $("#login").click();
    }
})

