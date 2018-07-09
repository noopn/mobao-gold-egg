import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "font/iconfont.css";
import "../css/cash.scss";

$(() => {
  let money = "";
  let val = "";
  let ajax = function (_url, data, successCallback) {
    $.ajax({
      url: url + _url,
      data: data,
      type: "post",
      success: function (response) {
        response = $.parseJSON(response);
        successCallback(response);
      }
    })
  }
  ajax("coin/getUserCoin", {
    token: localStorage.getItem("tokenCode"),
    coinType: "coinKen"
  }, function (response) {

    if (response.code === "0") {
      money = response.data;
    } else {
      localStorage.clear();
      location.replace(localUrl + "index.html");
    }
    // $("#cash-count").html(response.data);
  })
  $(".cash-input").on("input", function () {
    val = $(this).val();
    let match = val.match(/^[1-9]\d*$/g);
    if (!match) {
      $(this).val("");
    } else {
      $(this).val(match[0]);
    }
    $(".notice-cash").text("").hide();
    if (+val < 300) {
      $(".notice-cash").text("Please enter the amount Ksh more than 300.00").show();
    }
    if (+val > +money) {
      $(".notice-cash").text("Amount entered exceeds available Balance.").show();
    }
  })
  $(".cash-btn").on("click", function () {
    if (+val <= +money && +val >= 300) {
      ajax("coin/semiAutoWithdraw", {
        token: localStorage.getItem("tokenCode"),
        amount: val,
        service: 'GOLDEGGS'
      }, function (response) {
        if (response.code === "0") {
          $(".success-cash").html("Withdraw successed! Est.arrival time:within 24 hours").show();
          setTimeout(function () {
            location.replace(localUrl + 'index.html');
          }, 1000)
        } else {
          if (response.code === 'coin.insufficient') {
            $(".notice-cash").html('Amount entered exceeds available Balance!').show();
          } else {
            $(".notice-cash").html('Withdraw failed!Please wait a moment and try!').show();
          }
        }
      })
    }
  })
  $('.cash-btn.hist').click(function () {
    location.href = localUrl + "cash_histroy.html";
  })
})