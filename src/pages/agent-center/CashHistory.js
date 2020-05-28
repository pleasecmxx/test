/**
 * 提现列表
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from './../../utils/api'

export default class CashHistory extends Component {
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

  render_status (item) {
    switch (item.status) {
      case 0:
        return (
          <>
            <Text style={styles.smallText}>申请中</Text>
            {/* <Text style={styles.smallText}>提现失败原因：支付宝账户错误</Text> */}
          </>
        )
      case 1:
        return (
          <>
            <Text style={styles.smallText}>确认申请</Text>
            {/* <Text style={styles.smallText}>提现失败原因：支付宝账户错误</Text> */}
          </>
        )
      case 2:
        return (
          <>
            <Text style={styles.smallText}>提现成功</Text>
            {/* <Text style={styles.smallText}>提现失败原因：支付宝账户错误</Text> */}
          </>
        )
      case 3:
        return (
          <>
            <Text style={styles.smallText}>提现失败</Text>
            {/* <Text style={styles.smallText}>提现失败原因：支付宝账户错误</Text> */}
          </>
        )
      default:
        break;
    }
  }

  render_item ({ item, index }) {
    return (
      <View style={styles.itemLine}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowTitle}>提现-{item.true_name}</Text>
          <Text style={styles.smallText}>{item.apply_time}</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.rowTitle}>{item.money}</Text>
          {
            this.render_status(item)
          }
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"提现记录"} />
        <FlatList
          data={this.state.list}
          renderItem={this.render_item.bind(this)}
          contentContainerStyle={{ paddingTop: px2dp(10) }}
        />
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
  },

  itemLine: {
    width: width,
    // height: px2dp(60),
    backgroundColor: '#fff',
    marginBottom: onePx,
    borderRadius: px2dp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
    paddingVertical: px2dp(12)
  },


  rowLeft: {
    width: width * 0.4,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },

  rowRight: {
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  rowTitle: {
    fontSize: 17,
    color: '#000',
    fontWeight: '700',
  },

  smallText: {
    fontSize: 12,
    color: '#999',
    marginTop: px2dp(6)
  }
})