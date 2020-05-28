/**
 * 我的二维码
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import { navigate } from './../../NavigationService';
import LinearGradient from 'react-native-linear-gradient'
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from './../../utils/api'

export default class GetList extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      list: [],
      token: state.token,
    }
  }

  componentDidMount () {
    let params = {
      token: this.state.token
    };
    HttpUtils.postRequrst(api.cashList, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          this.setState({ list: res.list })
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  render_item ({ item, index }) {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={{ fontSize: 15, color: '#000' }}>购买者名称</Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: px2dp(6) }}>11.24 12:29</Text>
        </View>
        <Text style={{ fontSize: 17, color: '#000', fontWeight: '700' }}>+2.99</Text>
      </View>
    )
  }

  render_head () {
    return (
      <>
        <LinearGradient
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          colors={['#408CFF', '#015ADF']}
          style={styles.box}
        >
          <Text style={{ fontSize: 36, color: '#fff', fontWeight: '700' }}>1530.00</Text>
          <Text style={{ color: '#fff', fontSize: 14, marginTop: px2dp(8) }}>累计收入（元）</Text>
        </LinearGradient>
        <Text style={{ fontSize: 18, color: '#000', fontWeight: '700', marginLeft: width * 0.035, marginVertical: px2dp(10) }}>明细</Text>
      </>
    )
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"推广奖励"} />
        <FlatList
          data={this.state.list}
          renderItem={this.render_item.bind(this)}
          keyExtractor={(item, index) => index = ""}
          ListHeaderComponent={this.render_head.bind(this)}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  box: {
    width: width,
    height: px2dp(196),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: px2dp(20)
  },

  row: {
    width: width * 0.93,
    // height: px2dp(60),
    backgroundColor: '#fff',
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: onePx,
    marginBottom: onePx,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: px2dp(12)
  }
})