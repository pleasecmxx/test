/**
 * 我的二维码
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import { navigate, back } from './../../NavigationService';
import LinearGradient from 'react-native-linear-gradient'
import NormalHead from '../../components/tool-kit/NormalHead';
import ViewShot from "react-native-view-shot";
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import Loading from '../other/Loading';
import OptionLoading from '../other/OptionLoading';
import QRCode from 'react-native-qrcode-svg';
import ActionSheet from 'react-native-actionsheet'
var RNFS = require('react-native-fs');
import * as WeChat from 'react-native-wechat-lib';

/**
 * 分享海报
 */

export default class MyBanner extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      shareImg: '',
      msg: state.msg,
      token: state.token,
      data: {},          //分享信息
      newData: {},       //线上更新之后的信息
      hisUpDate: false,  //是否更新成功
      loading: true,
      optionLoading: false,
      QRcodeValue: '',
    }
  }

  componentDidMount() {
    const { msg } = this.state;
    let value = 'http://192.168.0.195:8080/#/login?head_img=' + msg.portrait + '&name=' + msg.name + '&code=' + msg.code;
    this.setState({ QRcodeValue: value });
    let params = {
      token: this.state.token
    };
    HttpUtils.postRequrst(api.shareBanner, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          this.setState({ data: res.list, loading: false })
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试");
        console.log(err);
        back();
      })
  }

  test() {
    // if (this.state.hisUpDate) {  //如果刚刚更新了，走刚更新的配置
    //   this.ActionSheet.show();
    // } else {
    //   if (this.state.data.user_qr_code.qr_code && this.state.data.user_qr_code.qr_code_time === 1) {
    //     // this.share(this.state.data.user_qr_code.qr_code)
    //     this.ActionSheet.show();
    //   } else { //如果没有历史，并且也没有页面缓存，执行上传方法
        this.setState({ optionLoading: true })
        this.viewShot && this.viewShot.capture().then(uri => {    // 这里的refs后面的viewShot为上面标签中自定义的，可以更改
          this.readFile(uri);
        })
          .catch(err => {
            toast("网络出错了，请稍后重试！");
            console.log(err);
            this.setState({ optionLoading: false })
          })
    //   }
    // }
  }

  readFile(uri) {
    RNFS.readFile(uri, 'base64')
      .then((content) => {
        console.log(content);
        this.upLoaderFile(content);
      })
      .catch((err) => {
        toast("图片读取失败");
        console.log(err);
        this.setState({ optionLoading: false })
      });
  }

  upLoaderFile(content) {
    let params = {
      token: this.state.token,
      portrait: 'data:image/jpeg;base64,' + content
    };
    HttpUtils.postRequrst(api.createBanner, params)
      .then(res => {
        console.log(res);
        this.setState({ optionLoading: false });
        if (res.code === 1) {
          this.ActionSheet.show();
          this.setState({ hisUpDate: true, newData: res.list })
        } else {
          toast(res.msg);
        }
      })
      .catch(err => {
        this.setState({ optionLoading: false });
        toast("网络出错了，请稍后重试");
        console.log(err);
      })
  }

  shareToWeChat() {
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        if (isInstalled) {
          let url;
          if (this.state.hisUpDate) {
            url = this.state.newData.qr_code;
          } else {
            url = this.state.data.user_qr_code.qr_code;
          }
          try {
            WeChat.shareImage({
              scene: 0,
              imageUrl: url
            });
          } catch (e) {
            toast("分享失败");
          }
        } else {
          toast("请先安装微信");
        }
      }).catch(err => {
        toast("分享失败");
      })
  }

  shareToTimeLine() {
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        if (isInstalled) {
          let url;
          if (this.state.hisUpDate) {
            url = this.state.newData.qr_code;
          } else {
            url = this.state.data.user_qr_code.qr_code;
          }
          try {
            WeChat.shareImage({
              scene: 1,
              imageUrl: url
            });
          } catch (e) {
            console.log('e', e)
            toast("分享失败")
          }
        } else {
          toast("请先安装微信");
        }
      }).catch(err => {
        console.log('err', err)
        toast("分享失败");
      })
  }

  render() {
    const { QRcodeValue } = this.state;
    return (
      <View style={styles.page}>
        <NormalHead title={"我的二维码"} />
        {
          this.state.loading ?
            <Loading />
            :
            <>
              <ScrollView
                contentContainerStyle={{ alignItems: 'center' }}
                style={{ width: '100%', flex: 1, paddingTop: px2dp(16) }}>
                {/* {
                  this.state.data.user_qr_code.qr_code && this.state.data.user_qr_code.qr_code_time === 1 ?
                    <View style={styles.codeContainer}>
                      <Image style={styles.img} source={{ uri: this.state.data.user_qr_code.qr_code }} />
                    </View>
                    : */}
                    <ViewShot
                      ref={c => this.viewShot = c}
                      options={{ format: "jpg", quality: 1, width: 375 }}
                      snapshotContentContainer
                      style={styles.bgContainer}
                    >
                      <View style={styles.codeContainer}>
                        <View style={styles.codeBox}>
                          <Image style={styles.head} source={{ uri: this.state.msg.portrait }} />
                          <Text numberOfLines={1} style={styles.name}>{this.state.msg.name}</Text>
                          <QRCode
                            // value={this.state.data.share}
                            value={QRcodeValue}
                            size={px2dp(96)}
                            bgColor='purple'
                            fgColor='#000' />
                        </View>
                        <Image style={styles.img} source={{ uri: this.state.data.list[0].img }} />
                      </View>
                    </ViewShot>
                {/* } */}
              </ScrollView>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => this.test()} style={styles.btn}>
                  <Text style={{ fontSize: 19, color: '#fff' }}>分享二维码</Text>
                </TouchableOpacity>
              </View>
            </>
        }
        <ActionSheet
          ref={(c) => this.ActionSheet = c}
          title={'将海报分享到'}
          options={['微信好友', '微信朋友圈', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index == 0) {
              this.shareToWeChat();
            } else if (index == 1) {
              this.shareToTimeLine();
            }
          }}
        />
        {
          this.state.optionLoading ?
            <OptionLoading />
            :
            null
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f6f6f6',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative'
  },

  btnContainer: {
    position: 'absolute',
    left: 0,
    bottom: 44,
    width: '100%',
    height: px2dp(60),
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bgContainer: {
    width: px2dp(320),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(8),
    overflow: 'hidden'
  },

  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: px2dp(320),
    height: px2dp(320 * 600 / 375),
    borderRadius: px2dp(8)
  },

  btn: {
    width: px2dp(200),
    height: px2dp(52),
    backgroundColor: colors.themeColor,
    borderRadius: px2dp(26),
    justifyContent: 'center',
    alignItems: 'center'
  },

  codeContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: px2dp(320),
    height: px2dp(320 * 600 / 375)
  },

  codeBox: {
    position: 'absolute',
    bottom: px2dp(146),
    left: px2dp(112),
    zIndex: 999,
    height: px2dp(160),
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  head: {
    width: px2dp(40),
    height: px2dp(40),
    borderRadius: px2dp(20),
  },

  name: {
    fontSize: 14,
    color: '#333',
    marginTop: px2dp(6),
    marginBottom: px2dp(12),
    maxWidth: px2dp(120),
    fontWeight: '700'
  }
})