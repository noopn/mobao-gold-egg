import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "font/iconfont.css";
import "../css/rank.scss";

import "../js/rank-svg";

$(() => {
  function getRank(successCallback, falseCallback) {
    $.ajax({
      type: "post",
      url: url + "challenge/dailyRank",
      data: {
        token: localStorage.getItem("tokenCodeEgg"),
        page: 1,
        limit: 10
      },
      success: function (respose) {
        respose = $.parseJSON(respose);
        if (respose.code === "0") {
          successCallback(respose);
        } else {
          falseCallback(respose);
        }
      }
    })
  }
  getRank(function (respose) {
    var data = respose.data;
    var my = respose.my;
    console.log(respose)
    var html = "";
    $.each(data, function (i, item) {
      if (i < 3) {
        html +=
          '<li class="rank-list-item">\
          <span class="rank-num"><svg><use xlink:href="#icon-f' +
          item.rank + '"></use></svg></span>\
          <span class="rank-tel">' + item.phone +
          '</span>\
          <span class="rank-span rank-money"><img src="'+require("../img/icon.png")+'"> ' + item.amount +
          '</span>\
        </li>'
      } else {
        html +=
          '<li class="rank-list-item">\
          <span class="rank-num">' + item.rank +
          '</span>\
          <span class="rank-tel">' + item.phone +
          '</span>\
          <span class="rank-span rank-money"><img src="'+require("../img/icon.png")+'"> ' + item.amount +
          '</span>\
        </li>'
      }
    })
    $(".rank-list").append(html);

    html = '<span class="rank-num">' + my.rank + '</span>\
      <span class = "rank-tel"> ' + my.phone +
      '</span>\
      <span class="rank-span rank-money"><img src="'+require("../img/icon.png")+'"> ' + my.amount + '</span>';
    $(".my-state").html(html);
  }, function (respose) {
    location.replace(localUrl);
  })
})