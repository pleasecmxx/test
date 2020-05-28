import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import { navigate, backUtils } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import HttpUtils from '../../utils/http';
import api from './../../utils/api'
// import { StackActions } from 'react-navigation';


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNum: '',   //手机号
      code: '',       //邀请码
      yzm: '',        //验证码
      password: '',   //密码
      timer: 59,      //倒计时
      showTimer: false,  //控制当前是倒计时还是可获取验证码
      codeLoading: false,    //控制验证码等待
      loading: false,  //控制注册功能等待
      invateCode: this.props.route.params.invateCode,  //携带邀请码
    }
  }
  componentDidMount () {
    StatusBar.setBarStyle('dark-content')
  }

  componentWillUnmount () {
    this.countTimer && clearTimeout(this.countTimer);
  }

  register () {
    if (this.state.phoneNum.length < 11) {
      toast("请输入完整手机号");
      return false;
    };
    if (this.state.yzm.length < 6) {
      toast("请将验证码填写完整");
      return false;
    };
    if (this.state.password.length < 6) {
      toast("请使用合法的密码");
      return false;
    }
    //执行注册逻辑
    this.setState({ loading: true })
    let params = {
      register_source: isIos() ? 1 : 2,
      mobile: this.state.phoneNum,
      password: this.state.password,
      yzm: this.state.yzm
    };
    if (this.props.route.params.invateCode) {   //是否使用邀请码
      params.code = this.state.invateCode;
    };
    HttpUtils.postRequrst(api.register, params)
      .then(res => {
        this.setState({ loading: false })
        if (res.code === 1) {
          toast("注册成功，快去登录吧~")
          // const popAction = StackActions.pop({ n: 2 });
          // this.props.navigation.dispatch(popAction);
          backUtils(2)
        } else {
          toast(res.msg);
        }
      })
      .catch(err => {
        toast("网络出错啦，请稍后重试")
      })
  }

  getCode () {
    if (this.state.phoneNum.length < 11) {
      toast("请输入完整手机号");
      return false;
    };
    this.setState({ codeLoading: true })
    let params = {
      mobile: this.state.phoneNum
    };
    HttpUtils.postRequrst(api.getCodeWidthRegister, params)
      .then(res => {
        console.log(res);
        this.setState({ codeLoading: false })
        if (res.code === 1) {
          this.setState({ showTimer: true })
          toast("验证码发送成功")
          this.startTimer();
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  startTimer () {
    let timer = this.state.timer;
    timer--;
    this.setState({ timer })
    if (timer === 0) {  //中断执行
      this.setState({ showTimer: false })
      return false
    }
    this.countTimer = setTimeout(() => {
      this.startTimer();
    }, 1000);
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"注册"} />
        <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={[styles.inputRow, { marginTop: px2dp(12) }]}>
            <Image style={styles.inputIcon} source={require('./../../assets/phone-icon.png')} />
            <TextInput
              style={styles.input}
              placeholder={"请输入手机号码"}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({ phoneNum: text })}
            />
          </View>
          <View style={styles.inputRow}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
              <Image style={[styles.inputIcon, { marginLeft: 1.5 }]} source={require('./../../assets/code-icon.png')} />
              <TextInput
                style={styles.codeInput}
                placeholder={"请输入验证码"}
                returnKeyType={'next'}
                keyboardType={'numeric'}
                maxLength={6}
                onChangeText={(text) => this.setState({ yzm: text })}
              />
            </View>
            {
              this.state.showTimer ?
                <View style={styles.codeBtn}>
                  <Text style={styles.btnText}>{this.state.timer}秒</Text>
                </View>
                :
                <>
                  {
                    this.state.codeLoading ?
                      <View style={styles.codeBtn}>
                        <LoadingKit tintColor={colors.themeColor} />
                      </View> :
                      <TouchableOpacity onPress={() => this.getCode()} style={styles.codeBtn}>
                        <Text style={styles.btnText}>获取验证码</Text>
                      </TouchableOpacity>
                  }
                </>
            }
          </View>
          <View style={styles.inputRow}>
            <Image style={styles.inputIcon} source={require('./../../assets/pass-icon.png')} />
            <TextInput
              style={styles.input}
              placeholder={"请使用6~18位字母数字组合密码"}
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          {
            this.state.loading ?
              <View style={styles.btnContent}>
                <LoadingKit />
              </View>
              :
              <TouchableOpacity onPress={() => this.register()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>立即注册</Text>
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

  inputRow: {
    width: width,
    height: px2dp(60),
    backgroundColor: '#fff',
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
  },

  inputIcon: {
    width: px2dp(20),
    height: px2dp(20),
  },

  input: {
    width: width * 0.93 - px2dp(20),
    height: px2dp(52),
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeInput: {
    width: px2dp(120),
    height: px2dp(52),
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeBtn: {
    height: px2dp(24),
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: px2dp(12),
    justifyContent: 'center',
    alignItems: "center",
    paddingHorizontal: 8
  },

  btnText: {
    fontSize: 13,
    color: colors.themeColor,
    fontWeight: '400',
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(96)
  }
})