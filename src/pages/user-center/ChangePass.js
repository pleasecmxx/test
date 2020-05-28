import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from './../../utils/base';
import { navigate } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';

export default class ChangePass extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      token: state.token,
      number: '',   //手机号
      password: '', //新的密码
      yzm: '',      //验证码
    }
  }

  confimPass() {
    if(this.state.number === ''){
      toast("请输入手机号");
      return false;
    };
    if(this.state.yzm === ''){
      toast("请先获取验证码");
      return false;
    };
    if(this.state.password === ''){
      toast("请输入新的密码")
      return false;
    };
    let params = {
      token: state.token
    };
    // HttpUtils.postRequrst()
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"修改密码"} />
        <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={[styles.row, { marginTop: px2dp(12) }]}>
            <Text style={styles.rowTitle}>手机号</Text>
            <View style={styles.rowRight}>
              <TextInput
                style={[styles.input, { width: width * 0.93 - px2dp(60) }]}
                placeholder={"请输入手机号"}
                maxLength={11}
                onChangeText={(text) => this.setState({ number: text })}
              />
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>验证码</Text>
            <View style={styles.rowRight}>
              <TextInput
                style={styles.input}
                placeholder={"请输入验证码"}
                onChangeText={(text) => this.setState({ yzm: text })}
              />
              <TouchableOpacity style={styles.codeBtn}>
                <Text style={styles.btnText}>获取验证码</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>新密码</Text>
            <View style={styles.rowRight}>
              <TextInput
                style={[styles.input, { width: width * 0.93 - px2dp(60) }]}
                placeholder={"请输入新密码"}
                onChangeText={(text) => this.setState({ password: text })}
              />
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => this.confimPass()} style={styles.btnContent}>
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>确认修改</Text>
            </TouchableOpacity>
          </View>
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

  row: {
    width: width,
    height: px2dp(60),
    backgroundColor: '#fff',
    marginBottom: 1,
    borderRadius: 6,
    paddingHorizontal: width * 0.035,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  rowTitle: {
    width: px2dp(60),
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    textAlign: 'left'
  },

  rowRight: {
    width: width * 0.93 - px2dp(60),
    // backgroundColor: 'tomato',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  input: {
    fontSize: 16,
    color: '#000',
    // fontWeight: '500'
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