import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from './../../utils/base';
import { back } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import redux from './../../redux/store'

export default class SetUserName extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      name: '',
      loading: false,
      token: state.token,
    }
  }

  changeName () {
    if (this.state.name === '') {
      toast("请输入用户名");
      return false;
    };
    let params = {
      token: this.state.token,
      name: this.state.name
    };
    this.setState({ loading: true })
    HttpUtils.postRequrst(api.editMsg, params)
      .then(res => {
        if (res.code === 1) {
          toast("修改成功");
          back();
        }else {
          this.setState({ loading: false });
          toast(res.msg);
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试");
      })
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <NormalHead title={"修改昵称"} />
        <TextInput
          style={styles.input}
          placeholder={"输入新昵称"}
          onChangeText={(text) => this.setState({ name: text })}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={() => this.changeName()} style={styles.btnContent}>
            {
              this.state.loading ?
                <LoadingKit />
                :
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>确认修改</Text>
            }
          </TouchableOpacity>
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
    alignItems: 'center'
  },

  input: {
    width: width,
    height: px2dp(52),
    paddingHorizontal: width * 0.035,
    color: '#000',
    fontSize: 16,
    backgroundColor: '#fff',
    marginTop: px2dp(12)
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(224)
  }
})