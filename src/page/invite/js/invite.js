import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "../css/invite.scss";
import "font/iconfont.css";
import 'babel-polyfill';
import ajaxCallbackSingleton from 'js/ajaxCallback';
let ajaxCS = ajaxCallbackSingleton.init();
$(document).ready(() => {
  ajaxCS.bindErrorHanding({
    [`${url}kenegg/myInviteAward`]: {
      golbal() {
        return false;
        localStorage.clear();
        location.reload();
      }
    },
    [`${url}kenegg/myInviteCode`]: {
      ['invitecode.non.condition']() {
        $('.invite-notice').html('Not Enough Bet');
      },
      golbal() {
        return false;
        localStorage.clear();
      }
    }
  })

  ajaxCS.bindSuccessHanding({
    [`${url}kenegg/myInviteAward`](ret) {
      if (ret.code === '0') {
        if (!ret.data.invitecode) {
          $('.invite-code').show().html('Get Invite Code');
          $('.invite-code').one('click', function () {
            ajaxCS.send(
              `${url}kenegg/myInviteCode`, "POST", { token: localStorage.getItem("tokenCode") }
            )
          })
          return false;
        }
        $('.invite-code').show().html(ret.data.invitecode);
        let html = ''
        if (ret.data.arr.length) $('.invite-list').fadeIn();
        ret.data.arr.forEach((item, index) => {
          html += `<tr>
          <th width='40%'>${item.phone}</th>
          <th width='40%'>${item.time}</th>
          <th width='20%'>${item.amount}</th>
        </tr>`
        })
        $('.invite-table').html(html);
      }
    }
  })
  ajaxCS.bindSuccessHanding({
    [`${url}kenegg/myInviteCode`](ret) {
      $('.invite-code').show().html(ret.data);
    }
  })
  ajaxCS.send(
    `${url}kenegg/myInviteAward`,
    "POST", {
      token: localStorage.getItem("tokenCode"),
      type: 1
    }
  )
  $('.invite-header-item').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    ajaxCS.send(
      `${url}kenegg/myInviteAward`,
      "POST", {
        token: localStorage.getItem("tokenCode"),
        type: $(this).index()+1
      }
    )
  })
})
