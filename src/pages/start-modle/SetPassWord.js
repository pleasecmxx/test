import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native'
import { px2dp, width, onePx, colors, toast } from './../../utils/base';
// import { StackActions } from 'react-navigation';
import NormalHead from '../../components/tool-kit/NormalHead';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import { backUtils } from '../../NavigationService';


export default class SetPassWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yzm: this.props.route.params.yzm,
      mobile: this.props.route.params.mobile,
      passWord: '',   //密码
      rePassWord: '', //再次确认验证码
      loading: false
    }
  }

  componentDidMount () {
    StatusBar.setBarStyle('dark-content');
  }

  done () {
    if (this.state.passWord === '') {
      return toast("请输入新密码")
    };
    if (this.state.rePassWord === '') {
      return toast("请再次确认密码")
    };
    if(this.state.passWord.length < 6){
      return toast("请使用六位数以上的密码")
    }
    if (this.state.passWord !== this.state.rePassWord) {
      return toast("很抱歉，前后两次密码不一致")
    };
    this.setState({ loading: true })
    let params = {
      yzm: this.state.yzm,
      mobile: this.state.mobile,
      password: this.state.passWord,
    };
    HttpUtils.postRequrst(api.forgetPass, params)
      .then(res => {
        this.setState({ loading: false })
        if (res.code === 1) {
          toast("恭喜您，密码已重置！");
          // const popAction = StackActions.pop({ n: 2 });
          // this.props.navigation.dispatch(popAction);
          backUtils(2)
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast(err);
        this.setState({ loading: false })
      })
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"设置密码"} />
        <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={[styles.inputRow, { marginTop: px2dp(12) }]}>
            <Image style={styles.inputIcon} source={require('./../../assets/pass-icon.png')} />
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ passWord: text })}
              secureTextEntry
              placeholder={"请使用6~18位字母数字组合的新密码"} />
          </View>
          <View style={styles.inputRow}>
            <Image style={styles.inputIcon} source={require('./../../assets/pass-icon.png')} />
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ rePassWord: text })}
              secureTextEntry
              placeholder={"请再输入一遍新密码"} />
          </View>
          {
            this.state.loading ?
              <View style={styles.btnContent}>
                <LoadingKit />
              </View>
              :
              <TouchableOpacity onPress={() => this.done()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>完成</Text>
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
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeInput: {
    // width: width * 0.93 - px2dp(120),
    height: px2dp(52),
    color: '#333',
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