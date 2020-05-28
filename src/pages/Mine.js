import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Clipboard, DeviceEventEmitter, Alert } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, webViewUrl } from '../utils/base';
import { navigate, reset } from '../NavigationService';
import Store from '../utils/store';
import redux from './../redux/store'
import HttpUtils from '../utils/http';
import api from '../utils/api';

export default class Mine extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      info: {
        balance: '',
        code: '******',
        creation_time: '',
        extension_money: '',
        fens_number: 0,
        fens_number1: 0,
        fens_number2: 0,
        id: null,
        mobile: '',
        name: '',
        portrait: 'http://',
        sign_time: '',
        type: 0,
        withdrawal_success: '',
      },
      token: state.token,
      lever: state.lever,
      show: state.show,
      show: true
    };
    const changeListener = () => {
      const state = store.getState();
      this.setState({ token: state.token, lever: state.lever, show: state.show });
    };
    redux.subscribe(changeListener);
    this.loadFirst = true;   //第一次加载
  }

  componentDidMount () {
    // this.viewDidAppear = this.props.navigation.addListener(
    //   'didFocus',
    //   (obj) => {
    //     StatusBar.setBarStyle('dark-content')
    //     if (!this.loadFirst) {
    //       this.updateUserInfo();
    //     }
    //   }
    // );
    this.getLocalUserMsg();
    this.getUpdateSigle = DeviceEventEmitter.addListener('upDateMsg', (a) => { this.getLocalUserMsg() })
  }

  componentWillUnmount () {
    StatusBar.setBarStyle('dark-content')
    // this.viewDidAppear.remove();
    this.getUpdateSigle.remove();
  }

  updateUserInfo () {
    this.loadFirst = false;
    if (this.state.lever === 0) {
      return false;
    }
    let params = {
      token: this.state.token,
    };
    HttpUtils.postRequrst(api.userInfo, params)
      .then(res => {
        console.log(res);
        if (res.code === 1 && res.list) {
          this.setState({ info: res.list });
          redux.dispatch({ type: 'SET_USERMSG', msg: res.list })   //更新用户信息
          Store.saveJsonObject('userMsg', res.list)
        } else {
          toast(res.msg);
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试！")
      })
  }

  getLocalUserMsg () {
    Store.getJsonObject('userMsg')
      .then(result => {
        this.loadFirst = false;
        console.log(result)
        this.setState({ info: result })
        redux.dispatch({ type: 'SET_USERMSG', msg: result })   //更新用户信息
        this.updateUserInfo()
      })
      .catch(err => {
        toast("未登录")
        redux.dispatch({ type: 'SET_LEVER', lever: 0 })   //更新用户信息
        this.setState({ unLogin: true })
        console.log(err)
      })
  }

  copyCode () {
    if (this.state.lever === 0) {
      toast("请先登录");
      return false
    }
    Clipboard.setString(this.state.info.code);
    toast("恭喜您，邀请码已复制到粘贴板");
  }

  goSetting () {
    if (this.state.lever === 0) {
      toast("请先登录")
      reset('Login', { isBack: true })
    }
    navigate('Setting', {
      msg: { portrait: this.state.info.portrait, name: this.state.info.name }
    })
  }

  goAgentCenter () {
    if (this.state.lever === 0) {
      toast("请先登录")
      return false;
    };
    navigate("AgentCenter", { type: this.state.info.type })
  }

  goAllList () {
    navigate('AllList', { isSelf: true })
  }

  goFeedBack () {
    if (this.state.lever === 0) {
      toast("请先登录")
      return false;
    };
    navigate('FeedBack')
  }

  goHelp () {
    navigate('HelpPage')
  }

  goAboutUs () {
    navigate('AboutUs')
  }

  goUserNotice () {
    navigate('MyWebView', { url: `${webViewUrl + 'private'}`, title: "寻亲宝用户隐私协议" })
  }

  goLogin () {
    navigate('Login', { isBack: true });   //需要返回
  }

  loginOut () {
    Alert.alert('温馨提醒', '确定退出登录吗?', [
      { text: '取消', onPress: () => { } },
      { text: '确定', onPress: () => this.confimOut() }
    ])
  }

  confimOut () {
    Store.remove('userPass')    //清除用户账号密码记录
    Store.remove('userMsg')     //清除用户详细信息
    redux.dispatch({ type: 'CLEAR_LEVER' });  //清除lever
    redux.dispatch({ type: 'CLEAR_TOKEN' });  //清除token
    redux.dispatch({ type: 'CLEAR_USERMSG' });  //清除msg
    reset('Login', 2, { isBack: false })
  }

  render () {
    const { info, lever } = this.state;
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => this.goSetting()}>
            <Image style={{ width: px2dp(24), height: px2dp(24) }} source={require('./../assets/setting-icon.png')} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ width: width, justifyContent: "flex-start", alignItems: 'center' }}
        >
          <View style={styles.userHeadShow}>
            {
              lever === 1 ?
                <TouchableOpacity onPress={() => this.goSetting()}>
                  <Image style={styles.userImg} source={{ uri: info ? info.portrait : 'https://' }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.goSetting()}>
                  <Image style={styles.userImg} source={require('./../assets/logo_head.png')} />
                </TouchableOpacity>
            }
            <View style={styles.userShowRight}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text onPress={() => this.goSetting()} numberOfLines={1} style={styles.userName}>{lever === 1 ? info.name : '未登录'}</Text>
                {
                  this.state.info.type == 1 && !this.state.show ?
                    <Image resizeMode={'contain'} style={styles.icon} source={require('./../assets/vip_icon.png')} />
                    :
                    null
                }
              </View>
              {
                !this.state.show ?
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text >邀请码：{info.code}</Text>
                    <TouchableOpacity onPress={() => this.copyCode()} style={styles.copyBtn}>
                      <Text style={styles.btnText}>复制</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#333' }}>&nbsp;{info.creation_time.substring(0, 10)} 加入寻亲宝大家庭</Text>
                  </View>
              }
            </View>
          </View>
          {
            !this.state.show ?
              <View style={styles.bgContainer}>
                <Image resizeMode={'contain'} style={styles.agentBg} source={require('./../assets/agent-bg.png')} />
                <View style={styles.bgContent}>
                  <TouchableOpacity onPress={() => this.goAgentCenter()} style={styles.bgPressContent}>
                    <Text style={{ color: colors.themeColor, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>代理中心</Text>
                    <Text style={{ fontSize: 10, color: '#999', fontWeight: '400' }}>AGENCY CENTER</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              <View style={styles.bgContainer}>
                <Image resizeMode={'contain'} style={styles.agentBg} source={require('./../assets/agent-bg.png')} />
                <View style={styles.bgContent}>
                  <TouchableOpacity onPress={() => this.goAllList()} style={styles.bgPressContent}>
                    <Text style={{ color: colors.themeColor, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>我的寻亲历史</Text>
                    <Text style={{ fontSize: 10, color: '#999', fontWeight: '400' }}>My history of finding relatives</Text>
                  </TouchableOpacity>
                </View>
              </View>
          }
          <TouchableOpacity onPress={() => this.goFeedBack()} style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.rowIcon} source={require('./../assets/mine-icon.png')} />
              <Text style={styles.rowTitle}>投诉建议</Text>
            </View>
            <Image style={styles.rightIcon} source={require('./../assets/enter.png')} />
          </TouchableOpacity>
          {
            !this.state.show ?
              <TouchableOpacity onPress={() => this.goHelp()} style={styles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image resizeMode={'contain'} style={styles.rowIcon} source={require('./../assets/mine-icon2.png')} />
                  <Text style={styles.rowTitle}>帮助教程</Text>
                </View>
                <Image style={styles.rightIcon} source={require('./../assets/enter.png')} />
              </TouchableOpacity>
              :
              null
          }
          <TouchableOpacity onPress={() => this.goAboutUs()} style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image resizeMode={'contain'} style={[styles.rowIcon, { width: px2dp(14), height: px2dp(14), marginTop: 1 }]} source={require('./../assets/mine-icon3.png')} />
              <Text style={styles.rowTitle}>关于我们</Text>
            </View>
            <Image style={styles.rightIcon} source={require('./../assets/enter.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.goUserNotice()} style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image resizeMode={'contain'} style={[styles.rowIcon, { marginTop: 1, height: px2dp(15), width: px2dp(16) }]} source={require('./../assets/mine-icon4.png')} />
              <Text style={styles.rowTitle}>用户隐私协议</Text>
            </View>
            <Image style={styles.rightIcon} source={require('./../assets/enter.png')} />
          </TouchableOpacity>
          {
            this.state.lever === 1 ?
              <TouchableOpacity onPress={() => this.loginOut()} style={styles.btnContainer}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>退出登录</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => this.goLogin()} style={styles.btnContainer}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>去登陆</Text>
              </TouchableOpacity>
          }
        </ScrollView>
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
    alignItems: 'center'
  },

  header: {
    width: "100%",
    height: size.headHeight + statusBarHeight,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: statusBarHeight,
  },

  iconContainer: {
    paddingHorizontal: width * 0.035,
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },

  userHeadShow: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: px2dp(28)
  },

  userImg: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(30)
  },

  userShowRight: {
    height: px2dp(52),
    paddingLeft: px2dp(12),
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  userName: {
    maxWidth: px2dp(160),
    fontSize: 20,
    color: '#000',
    fontWeight: '700'
  },

  invateText: {
    fontSize: 12,
    color: '#333',
  },

  copyBtn: {
    height: px2dp(16),
    borderWidth: onePx,
    borderColor: colors.themeColor,
    borderRadius: px2dp(8),
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },

  btnText: {
    fontSize: 10,
    color: colors.themeColor,
  },

  icon: {
    width: px2dp(16),
    height: px2dp(16),
    marginLeft: 4,
    marginTop: 2
  },

  bgContainer: {
    position: 'relative',
    width: width * 0.94,
    height: (width * 476 / 1536 * 0.94) - 30,
    marginVertical: px2dp(18),
    borderRadius: px2dp(6),
    overflow: 'hidden',
  },

  bgContent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.94,
    height: (width * 476 / 1536 * 0.94) - 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: px2dp(20)
  },

  bgPressContent: {
    width: width * 0.94,
    height: (width * 476 / 1536 * 0.94) - 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: px2dp(20)
  },

  agentBg: {
    width: width,
    height: width * 476 / 1536,
    marginTop: -15,
    marginLeft: -width * 0.03
    // backgroundColor: 'red'
  },

  row: {
    width: width,
    height: px2dp(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
  },

  rowIcon: {
    width: px2dp(16),
    height: px2dp(16),
    tintColor: '#000',
    marginTop: px2dp(2),
    marginRight: 4
  },

  rowTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  rightIcon: {
    width: px2dp(18),
    height: px2dp(18),
    tintColor: '#999'
  },

  btnContainer: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginVertical: px2dp(36)
  }
})


