'use strict';

import { Dimensions, Platform, PixelRatio, StatusBar, ToastAndroid, DeviceEventEmitter } from 'react-native'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


// iPhoneX  & XS
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhoneXR & XsMax
const XR_WIDTH = 414;
const XR_HEIGHT = 896;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');


function isIphoneX () {
  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  );
}

//判断是否为iphoneXR或XsMAX
function isIphoneXR () {
  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === XR_HEIGHT && D_WIDTH === XR_WIDTH) ||
      (D_HEIGHT === XR_WIDTH && D_WIDTH === XR_HEIGHT))
  )
}

var iosHeight = isIphoneX() || isIphoneXR() ? 44 : 20;

const statusBarHeight = (Platform.OS === 'ios' ? iosHeight : StatusBar.currentHeight)

const onePx = 1 / PixelRatio.get();

//px转dp自适应
function px2dp (px) {
  let w = px * width / 375
  w = w.toFixed(2) - 0
  return w
}

function cleanWords (origin) {  //脏话过滤
  var DirtyWord = "脏话|脏话1|脏话2|脏话2";  //配置脏话
  var Dirty_Array = DirtyWord.split("|");
  for (var i = 0; i < Dirty_Array.length; i++) {
    origin = origin.replace(Dirty_Array[i], "**");
  }
  return origin
}

function isIos () {
  if (Platform.OS === 'ios') {
    return true
  }
  return false;
}

function getTime () {
  let date = new Date();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();
  // let sec = date.getSeconds().toString();
  return month + '月' + day + '日' + ' ' + hour + ':' + minute
}

function getLocalTime (nS) {
  var now = new Date();                   //获得当前时间
  var time = new Date(nS);                //解析时间戳
  let dateStart = now.getDate();           //当前日
  let monthEnd = time.getMonth() + 1;      //结束月
  let dateEnd = time.getDate();            //时间戳日
  let hoursEnd = time.getHours();          //时间戳时
  let minutesEnd = time.getMinutes();      //时间戳分
  if (dateStart === dateEnd) {    //说明是同一天
    let period;
    if (hoursEnd < 9 && hoursEnd >= 6) {
      period = '早上';
    } else if (hoursEnd >= 9 && hoursEnd < 12) {
      period = '上午';
    } else if (hoursEnd >= 12 && hoursEnd < 18) {
      period = '下午';
      hoursEnd -= 12;
    } else if (hoursEnd >= 18 && hoursEnd < 24) {
      period = '晚上';
      hoursEnd -= 12;
    } else if (hoursEnd >= 0 && hoursEnd < 6) {
      period = '凌晨'
    }
    if (minutesEnd.toString().length === 1) {
      minutesEnd = '0' + minutesEnd;
    }
    return period + hoursEnd + ':' + minutesEnd
  } else if (dateStart - dateEnd === 1) {   //说明是昨天的消息
    return '昨天'
  } else {
    return monthEnd + '月' + dateEnd + '日'
  }
}

function getRandom () {
  var rnd = "";
  for (var i = 0; i < 5; i++)
    rnd += Math.floor(Math.random() * 10);
  return 'hmpd' + rnd;
}

function deleteSpace (str) { //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// const BaseUrl = 'https://hm.hongmenpd.com' //测试
const BaseUrl = 'https://xqb.yuncshop.com'  //正式

const webViewUrl = 'https://xqb.yuncshop.com/h5/dist/index.html#'
// const webViewUrl = 'http://192.168.0.195:8080/#'

function changeTel (tel) {   //手机号隐藏中间四位数
  tel = "" + tel;
  var reg = /(\d{3})\d{4}(\d{4})/;
  var tel1 = tel.replace(reg, "$1****$2");
  return tel1;
}

const size = {
  base_width: 375,
  head_height: px2dp(46),
  tab_height: px2dp(56),
  headHeight: px2dp(42),
  innerWidth: '94%',
}

const colors = {
  themeColor: '#015ADF'
}

const toast = (msg) => {
  if (isIos()) {
    DeviceEventEmitter.emit('toast-ios', { msg: msg })
  } else {
    ToastAndroid.showWithGravityAndOffset(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 225)
  }
}

const channel = 'xiaomi'
/**
 * huawei
 * oppo
 * vivo
 * other
 * apple
 */


export {
  px2dp,
  height,
  width,
  statusBarHeight,
  cleanWords,
  isIos,
  getTime,
  getRandom,
  isIphoneX,
  onePx,
  BaseUrl,
  getLocalTime,
  deleteSpace,
  changeTel,
  size,
  colors,
  toast,
  channel,
  webViewUrl
}