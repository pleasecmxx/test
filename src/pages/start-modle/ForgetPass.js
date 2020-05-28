import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from './../../utils/base';
import { navigate } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import HttpUtils from '../../utils/http';
import api from '../../utils/api';

export default class ForgetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 59,
      codeLoading: false,
      loading: false,
      phone: '',  //用户手机号
      yzm: '',   //验证码
    }
  }

  componentDidMount () {
    StatusBar.setBarStyle('dark-content')
  }

  componentWillUnmount () {
    this.delay && clearTimeout(this.delay);
  }

  checkStatus () {
    if (this.state.phone === '') {
      return toast("请输入手机号");
    };
    if (this.state.phone.length !== 11) {
      return toast("请填写正确的手机号");
    }
    if (this.state.yzm === '') {
      return toast("请输入验证码");
    };
    if (this.state.yzm.length !== 6) {
      return toast("请填写6位数正确验证码");
    }
    navigate('SetPassWord', { mobile: this.state.phone, yzm: this.state.yzm })
  }

  getCode () {
    if (this.state.phone === '' || this.state.phone.length !== 11) {
      return toast("请先输入手机号");
    }
    this.setState({ loading: true });
    let params = {
      mobile: this.state.phone,
    };
    HttpUtils.postRequrst(api.sendCodeWhenForgetPass, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          toast("验证码已发送，请注意查收");
          this.setState({ codeLoading: true });
          this.coutting();
        } else {
          this.setState({ loading: false });
          toast(res.msg);
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        toast("网络出错了，请稍后重试");
        console.log(err);
      })
  }

  coutting () {
    let time = this.state.time;
    if (time === 0) {
      this.setState({ loading: false, codeLoading: false });
      return false;
    }
    time = time - 1;
    this.setState({ time });
    this.delay = setTimeout(() => {
      this.coutting();
    }, 1000);
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"忘记密码"} />
        <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={[styles.inputRow, { marginTop: px2dp(12) }]}>
            <Image style={styles.inputIcon} source={require('./../../assets/phone-icon.png')} />
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ phone: text })}
              keyboardType={'numeric'}
              placeholder={"请输入手机号码"} />
          </View>
          <View style={styles.inputRow}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
              <Image style={[styles.inputIcon, { marginLeft: 1.5 }]} source={require('./../../assets/code-icon.png')} />
              <TextInput
                style={styles.codeInput}
                onChangeText={(text) => this.setState({ yzm: text })}
                keyboardType={'numeric'}
                placeholder={"请输入验证码"} />
            </View>
            {
              this.state.loading ?
                <View style={styles.codeBtn}>
                  {
                    this.state.codeLoading ?
                      <Text style={styles.btnText}>还有{this.state.time}秒</Text>
                      :
                      <LoadingKit tintColor={colors.themeColor} />
                  }
                </View>
                :
                <TouchableOpacity onPress={() => this.getCode()} style={styles.codeBtn}>
                  <Text style={styles.btnText}>获取验证码</Text>
                </TouchableOpacity>
            }
          </View>
          <TouchableOpacity onPress={() => this.checkStatus()} style={styles.btnContent}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>下一步</Text>
          </TouchableOpacity>
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
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeInput: {
    // width: width * 0.93 - px2dp(120),
    height: px2dp(52),
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeBtn: {
    height: px2dp(24),
    width: px2dp(86),
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: px2dp(12),
    justifyContent: 'center',
    alignItems: "center",
    // paddingHorizontal: 8
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