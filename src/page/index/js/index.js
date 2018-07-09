import $ from "jquery";
import {
  url,
  localUrl
} from "cfg/cfg.json";
import "css/reset.scss";
import "css/common.scss";
import "../css/index.scss";
// import 'babel-polyfill';
import resLoader from "./resLoader";
function once() {
  bgmusic.play();
  window.removeEventListener('touchstart', once, false);
}
var loader = new resLoader({
  resources: [
    require('../../../common/img/bg.jpg'),
    // require('../../../common/img/challenge.png'),
    // require('../../../common/media/defeat.mp3'),
    // require('../../../common/media/loading.mp3'),
    // require('../../../common/media/right.mp3'),
    // require('../../../common/media/transit.wav'),
    // require('../../../common/media/victory.mp3'),
    // require('../../../common/media/wrong.mp3'),
    // 'js/index.js',
    // 'js/main.js',
    // 'img/error.png',
    // 'img/go-index.png',
    // 'img/icon.png',
    // 'img/leave.png',
    // 'img/Multiplayer.png',
    // 'img/once-again.png',
    // 'img/ready.png',
    // 'img/single.png',
    // 'img/ready.svg',
    // 'img/time.svg'
  ],
  onStart: function (total) {
    //console.log('start:'+total);
  },
  onProgress: function (current, total) {
    console.log(current + '/' + total);
    var percent = parseInt(current / total * 100);
    $('.progressbar').css('width', percent + '%');
    $('.progresstext .current').text(percent + '%');
  },
  onComplete: function (total) {
    $(".progresstextSub").text("Resources loaded success!");
    setTimeout(function () {
      location.href = localUrl + 'main.html';
    }, 1000);
  }
});

loader.start();