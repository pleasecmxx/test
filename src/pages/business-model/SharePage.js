import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, DeviceEventEmitter } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import { navigate, back } from './../../NavigationService';
import * as WeChat from 'react-native-wechat-lib';
// import LoadingKit from './../../components/tool-kit/LoadingKit'
// import HttpUtils from '../../utils/http';
// import api from './../../utils/api'
// import { StackActions } from 'react-navigation';


export default class SharePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.lid,  //location ID
      title: this.props.route.params.title,
      imgUrl: this.props.route.params.imgUrl,
      isSelf: this.props.route.params.isSelf,
      aid: this.props.route.params.aid,
    }
  }

  agree () {
    back();
  }

  shareToChat () {
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        if (isInstalled) {
          let jumpUrl = 'https://xqb.yuncshop.com/day.html?'
          if (this.state.isSelf) {
            jumpUrl = jumpUrl + 'aclid=' + this.state.id + '&link=' + this.props.route.params.link
          } else {
            jumpUrl = jumpUrl + 'aaaa=' + this.state.aid + '&aclid=' + this.state.id
          }
          try {
            WeChat.shareWebpage({
              title: this.state.title,
              description: this.state.title,
              thumbImageUrl: this.state.imgUrl,
              scene: 0,
              webpageUrl: jumpUrl
            })
          } catch (e) {
            alert(e)
            toast("分享失败")
          }
        } else {
          toast("请安装微信客户端")
        }
      }).catch(err => {
        toast("分享失败")
      })
  }

  shareWxMoment = async () => {
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        if (isInstalled) {
          let jumpUrl = 'https://hm.hongmenpd.com/PC/dailynews.html?'
          if (this.state.isSelf) {
            jumpUrl = jumpUrl + 'aclid=' + this.state.id + '&link=' + this.props.route.params.link
          } else {
            jumpUrl = jumpUrl + 'aaaa=' + this.state.aid + '&aclid=' + this.state.id
          }
          try {
            WeChat.shareWebpage({
              title: this.state.title,
              description: this.state.title,
              thumbImageUrl: this.state.imgUrl,
              scene: 1,
              webpageUrl: jumpUrl
            })
          } catch (e) {
            toast("分享失败")
            alert(e)
          }
        } else {
          toast("请安装微信客户端")
        }
      }).catch(err => {
        toast("分享失败")
      })
  }

  message() {
    toast("开发中，敬请期待")
  }

  render () {
    return (
      <View style={styles.page}>
        <Text style={styles.shareText}>创建成功，现在将链接/文章分享给你想定位的人吧</Text>
        <View style={styles.bottomBox}>
          <View style={styles.topBox}>
            <TouchableOpacity onPress={() => this.shareToChat()} style={styles.box}>
              <Image style={styles.icon} resizeMode={'contain'} source={require('./../../assets/by-wechat.png')} />
              <Text style={{ color: '#444', marginTop: 8, fontSize: 14 }}>微信好友</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.shareWxMoment()} style={styles.box}>
              <Image style={styles.icon} resizeMode={'contain'} source={require('./../../assets/by-timeline.png')} />
              <Text style={{ color: '#444', marginTop: 8, fontSize: 14 }}>朋友圈</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.message()} style={styles.box}>
              <Image style={styles.icon} resizeMode={'contain'} source={require('./../../assets/by-message.png')} />
              <Text style={{ color: '#444', marginTop: 8, fontSize: 14 }}>短信</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => back()} style={styles.bottomLine}>
            <Text style={styles.text}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgb(128,128,128)',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: px2dp(200),
    position: 'relative'
  },

  shareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    maxWidth: width * 0.7,
    marginLeft: width * 0.035
  },

  bottomBox: {
    width: width,
    height: px2dp(240),
    backgroundColor: '#fff',
    borderTopLeftRadius: px2dp(24),
    borderTopRightRadius: px2dp(24)
  },

  bottomLine: {
    width: width,
    height: px2dp(60),
    borderTopColor: '#eee',
    borderWidth: onePx,
    justifyContent: 'center',
    alignItems: 'center'
  },

  topBox: {
    width: width,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  text: {
    fontSize: 16,
    color: '#333'
  },

  box: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  icon: {
    width: px2dp(42),
    height: px2dp(42)
  }
})