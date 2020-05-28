import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard, TextInput, StatusBar, ScrollView, DeviceEventEmitter } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from './../../utils/base';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import { navigate, back, reset } from './../../NavigationService';
import { changeJumpType } from './../../navigator'
import { Switch } from 'react-native-switch';
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import Store from '../../utils/store';
import redux from './../../redux/store'
// import {  } from 'react-native-gesture-handler';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useCode: true,
      placeholder: '验证码',
      inputWidth: width * 0.88 - px2dp(108),
      phone: '',
      bottomValue: '',   //用户输入密码或者验证码
      codeLoading: false, //验证码请求时
      codeTime: 59,
      showTimer: false,   //展示时间
      isBack: this.props.route.params.isBack //登录完成之后是返回上一页面还是擦除整个导航
    }
  }

  componentDidMount () {

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.myTimer && clearTimeout(this.myTimer);
  }

  _keyboardDidHide () {
    this.bottomLine.setNativeProps({
      style: { bottom: 44 }
    })
  }

  _keyboardDidShow () {
    this.bottomLine.setNativeProps({
      style: { bottom: -44 }
    })
  }

  selectLoginMethod () {
    if (this.state.useCode) {
      this.loginWithCode();
    } else {
      this.login()
    }
  }

  login () {
    if (this.state.phone.length > 0 && this.state.bottomValue.length > 0) {
      let params = {
        mobile: this.state.phone,
      };
      params.type = 1;   //账号密码登录
      params.password = this.state.bottomValue
      Keyboard.dismiss();
      this.setState({ loading: true })
      HttpUtils.postRequrst(api.login, params)
        .then(res => {
          if (res.code === 1) {
            console.log(res);
            redux.dispatch({ type: 'SET_TOKEN', token: res.list.token });   //更新lever
            Store.saveJsonObject('userPass', params)
              .then(result => {
                Store.saveJsonObject('loginByPass', { value: true })  //用账号密码登录时标记为用账号登录
                  .then(result1 => {
                    this.getUserMsg(res.list.token, 1);
                  })
                  .catch(err => {
                    toast("未知错误，请稍后重试");
                    return false;
                  })
              })
              .catch(err => {
                toast("存储空间不足，请您清理手机内存")
              })
          } else {
            toast(res.msg);
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          console.log(err)
          toast("网络出错了，请稍后重试");
          this.setState({ loading: false });
        })
    } else {
      toast("请将信息填写完整");
    }
  }

  loginWithCode () {   //使用验证码登录
    if (this.state.phone === '') {
      toast("请先输入您的手机号");
      return false
    };
    if (this.state.yzm === '') {
      toast("请填写短信验证码");
      return false;
    };
    let params = {
      type: 2,
      mobile: this.state.phone,
      yzm: this.state.bottomValue,
    };
    Keyboard.dismiss();
    this.setState({ loading: true });
    HttpUtils.postRequrst(api.login, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          toast("登录成功");
          redux.dispatch({ type: 'SET_TOKEN', token: res.list.token });   //更新lever
          let tokenParams = {
            mobile: params.mobile,
            token: res.list.token
          }
          Store.saveJsonObject('userPass', tokenParams)
            .then(result => {
              Store.saveJsonObject('loginByPass', { value: false })  //标记为非账号密码登录
                .then(result1 => {
                  this.getUserMsg(res.list.token, 2);
                })
                .catch(err => {
                  toast("未知错误，请稍后重试");
                  return false;
                })
            })
            .catch(err => {
              toast("存储空间不足，请您清理手机内存");
            })
        } else {
          toast(res.msg);
          this.setState({ loading: false });
        };
      })
      .catch(err => {
        console.log("网络出错了， 请稍后重试");
      })
  }

  /**
   * 
   * @param {*} token 
   * @param {*} type  1: 账号密码登录 2：手机验证码登录
   */
  getUserMsg (token, type) {   //存储用户信息
    HttpUtils.postRequrst(api.userInfo, { token: token })
      .then(res => {
        this.setState({ loading: false });
        console.log(res)
        if (res.code === 1) {
          redux.dispatch({ type: 'SET_USERMSG', msg: res.list })   //更redux新用户信息
          redux.dispatch({ type: 'SET_LEVER', lever: 1 });   //更新lever
          Store.saveJsonObject('userMsg', res.list)          //本地存储更新用户信息
            .then(result => {
              if (this.state.isBack) {
                DeviceEventEmitter.emit('upDateMsg')
                back(2)
              } else {
                reset('TabScreens', { noLogin: true })
              }
            })
            .catch(err => toast("存储空间不足，请您清理手机内存"))
        } else {
          toast(res.msg);
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        console.log(err)
        toast("网络出错了，请稍后重试");
        this.setState({ loading: false });
      })
  }

  changeLoginMethod (value) {
    if (value) {
      this.setState({
        useCode: true,
        placeholder: '验证码',
        inputWidth: width * 0.88 - px2dp(108),
        bottomValue: ''
      });
    } else {
      this.setState({
        useCode: false,
        placeholder: '密码',
        inputWidth: width * 0.88,
        bottomValue: ''
      });
    };
    this.bottomInput.clear();
  }

  getCode () {
    if (this.state.showTimer) {
      toast("请等待" + this.state.codeTime + '秒后可重新获取')
      return false;
    }
    if (this.state.phone == '') {
      toast("请先输入手机号");
      return false;
    }
    this.setState({ codeLoading: true });
    let params = {
      mobile: this.state.phone
    };
    HttpUtils.postRequrst(api.sendCodeWhenLogin, params)
      .then(res => {
        if (res.code === 1) {
          toast("验证码已发送，请注意查收");
          this.setState({ codeLoading: false, showTimer: true });
          this.couttingTimer();
        } else {
          toast(res.msg);
          this.setState({ codeLoading: false })
        };

      })
      .catch(err => {
        this.setState({ codeLoading: false })
        toast("网络出错了，请稍后重试")
      })
  }

  couttingTimer () {
    if (this.state.codeTime === 0) {
      this.setState({ showTimer: false })
      return false;
    };
    let codeTime = this.state.codeTime;
    this.myTimer = setTimeout(() => {
      codeTime = codeTime - 1;
      this.setState({ codeTime });
      this.couttingTimer();
    }, 1000);
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.pageContent}>
          <Image resizeMode={'cover'} style={styles.bg} source={require('./../../assets/login-bg.png')} />
        </View>
        <View style={styles.pageContainer}>
          <View style={styles.headLine}>
            {
              this.state.isBack ?
                <TouchableOpacity onPress={() => back(2)} style={styles.backContainer}>
                  <Text style={styles.title}>取消</Text>
                </TouchableOpacity>
                :
                null
            }
          </View>
          <Image style={styles.logo} source={require('./../../assets/login-logo.png')} />
          <View style={styles.loginRow}>
            <Text style={styles.title}>验证码登录</Text>
            <Switch
              onTintColor={'#000'}
              tintColor={'#aaaa11'}
              value={this.state.useCode}
              onValueChange={(value) => {
                this.setState({ useCode: value });
                this.changeLoginMethod(value);
              }}
              circleSize={px2dp(24)}    //圆圈尺寸
              backgroundActive={colors.themeColor}   //激活时整体背景
              circleActiveColor={'#fff'}    //
              circleInActiveColor={'#fff'}
              circleBorderWidth={3}  //圆圈外径
              outsideCircleStyle={{ backgroundColor: 'red', borderColor: 'red' }}  //
              innerCircleStyle={{ borderColor: '#fff' }}  //
              backgroundInactive={"#ccc"}
            />
          </View>
          <View style={[styles.inputContainer, { marginTop: px2dp(12) }]}>
            <Image style={styles.loginIcon} source={require('./../../assets/acount-icon.png')} />
            <TextInput
              placeholderTextColor={'#a1a1a1'}
              placeholder={"手机号"}
              style={styles.input}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              maxLength={11}
              onChangeText={(text) => this.setState({ phone: text })}
            />
          </View>
          <View style={styles.bottomInputContainer}>
            <View style={[styles.inputContainer, { width: this.state.inputWidth }]}>
              <Image style={styles.loginIcon} source={require('./../../assets/password-icon.png')} />
              <TextInput
                placeholderTextColor={'#a1a1a1'}
                placeholder={this.state.placeholder}
                style={styles.input}
                secureTextEntry={!this.state.useCode}
                onChangeText={(text) => this.setState({ bottomValue: text })}
                keyboardType={this.state.useCode ? 'numeric' : 'name-phone-pad'}
                maxLength={18}
                ref={(c) => this.bottomInput = c}
              />
            </View>
            {
              this.state.useCode ?
                <TouchableOpacity onPress={() => this.getCode()} style={styles.codeBtn}>
                  {
                    this.state.codeLoading ?
                      <LoadingKit />
                      :
                      <Text style={{ color: '#fff' }}>{this.state.showTimer ? '等待' + this.state.codeTime + '秒' : '获取验证码'}</Text>
                  }
                </TouchableOpacity>
                :
                null
            }
          </View>
          {
            this.state.loading ?
              <View style={styles.btnContent}>
                <LoadingKit />
              </View>
              :
              <TouchableOpacity onPress={() => this.selectLoginMethod()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>登录</Text>
              </TouchableOpacity>
          }
          <View style={[styles.loginRow, { paddingHorizontal: 2, paddingVertical: 6 }]}>
            <TouchableOpacity onPress={() => navigate('ForgetPass')}>
              <Text style={styles.smalltitle}>忘记密码？</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('UseInvateCode')}>
              <Text style={styles.smalltitle}>新用户注册</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View ref={c => this.bottomLine = c} style={styles.bottomLine}>
          <Text style={{ color: '#fff', fontSize: 12 }}>阅读并同意寻亲宝&nbsp;<Text style={{ textDecorationLine: 'underline' }}>用户协议与隐私条款</Text></Text>
        </View>
      </ScrollView>
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

  pageContent: {
    position: 'absolute',
    width: width,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgb(17,21,39)',
    zIndex: 1,
  },

  pageContainer: {
    position: 'absolute',
    width: width,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0)',
    zIndex: 99,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: statusBarHeight
  },

  bg: {
    width: width,
    flex: 1,
  },

  codeBtn: {
    height: px2dp(32),
    width: px2dp(96),
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: px2dp(16),
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: colors.themeColor,
  },

  btnText: {
    fontSize: 13,
    color: colors.themeColor,
    fontWeight: '400',
  },

  inputContainer: {
    width: width * 0.88,
    height: px2dp(52),
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: px2dp(6),
    paddingHorizontal: px2dp(12),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  bottomInputContainer: {
    width: width * 0.88,
    height: px2dp(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: px2dp(24),
  },

  loginIcon: {
    width: px2dp(24),
    height: px2dp(24),
    marginRight: px2dp(4)
  },

  input: {
    fontSize: 16,
    color: '#fff',
    // backgroundColor: 'red',
    width: width * 0.88 - px2dp(50)
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(96)
  },

  headLine: {
    width: width,
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  logo: {
    width: px2dp(60),
    height: px2dp(60) * 406 / 262,
    marginVertical: px2dp(42),
  },

  loginRow: {
    width: width * 0.88,
    // height: px2dp(42),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 2,
  },

  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    opacity: 0.9
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(48)
  },

  smalltitle: {
    fontSize: 12,
    color: '#a1a1a1',
    paddingVertical: px2dp(12)
  },

  backContainer: {
    paddingHorizontal: width * 0.06,
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bottomLine: {
    width: '100%',
    position: 'absolute',
    bottom: 44,
    left: 0,
    // backgroundColor: 'red',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  }
})