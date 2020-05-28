import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import { navigate, back } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import api from './../../utils/api'
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import * as WeChat from 'react-native-wechat-lib';
// import Alipay from '@0x5e/react-native-alipay';
import Loading from './../other/Loading'

export default class BuyPackage extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      isAlipay: false,
      list: [],
      token: state.token,
      loading: true,
      continue: this.props.route.params.isService,  //支付完成下一步逻辑
    }
  }

  componentDidMount() {
    let params = {
      token: this.state.token
    };
    HttpUtils.postRequrst(api.packagesList, params)
      .then(res => {
        console.log(res)
        if (res.code === 1) {
          res.list.forEach(item => {
            item.isChecked = false;
          })
          res.list[0].isChecked = true;
          this.setState({ list: res.list, loading: false })
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  changeSelect(item, index) {
    let list = this.state.list;
    list.forEach(item => {
      item.isChecked = false;
    });
    list[index].isChecked = true;
    this.setState({ list })
  }

  render_item({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.changeSelect(item, index)} style={styles.row}>
        <View style={styles.rowUnSelect}>
          {
            item.isChecked ?
              <View style={styles.rowSelect}></View>
              :
              null
          }
        </View>
        <Text style={styles.rowTitle}>{item.title}￥{item.money}</Text>
      </TouchableOpacity>
    )
  }

  buyPackage() {
    let sid;
    for (let i = 0; i < this.state.list.length; i++) {
      if (this.state.list[i].isChecked) {
        sid = this.state.list[i].id;
        break;
      }
    };
    let params = {
      sid: sid,
      type: this.state.isAlipay ? 1 : 2,
      mode: isIos() ? 1 : 2,
      token: this.state.token
    };
    HttpUtils.postRequrst(api.buyPackage, params)
      .then(res => {
        console.log(res)
        if (this.state.isAlipay) {
          Alipay.pay(res.list.response)
            .then((res) => {
              console.log(res)
              const { resultStatus } = res;
              if (`${resultStatus}` === '9000') {
                this.paySuss();
              } else {
                this.payFail();
              }
            })
            .catch(err => {
              console.log(err)
              this.payFail()
            })
        } else {
          WeChat.pay({                                  //微信支付首次支付
            partnerId: res.list.partnerid,
            prepayId: res.list.prepayid,
            nonceStr: res.list.noncestr,
            timeStamp: res.list.timestamp,
            package: res.list.package,   //
            sign: res.list.sign,  //
          }).then(res => {
            this.paySuss();
          }).catch((err) => {
            console.log('支付错误', err)
            this.payFail();
          });
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  paySuss() {
    console.log("支付成功");
    toast("支付成功");
    if (this.state.continue) {  //如果需要继续下一步逻辑 。。。
      let params = {
        id: this.props.route.params.id,
        title: this.props.route.params.title
      };
      // alert(this.props.route.params.id)
      navigate('CheckStatus', {
        id: this.props.route.params.id,
        title: this.props.route.params.title
      })
    }
  }

  payFail() {
    console.log("支付失败");
    toast("支付失败");
  }

  render() {
    return (
      <View style={styles.page}>
        <NormalHead title={"购买套餐"} />
        {
          this.state.loading ?
            <Loading /> :
            <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>选择套餐</Text>
              </View>
              <FlatList
                data={this.state.list}
                renderItem={this.render_item.bind(this)}
                keyExtractor={(item, index) => index + ''}
              />
              <View style={styles.titleBox}>
                <Text style={styles.title}>选择支付方式</Text>
              </View>
              {/* onPress={() => this.setState({ isAlipay: true })} */}
              <View style={[styles.payRow, { opacity: 0.5 }]}>
                <Text style={styles.rowTitle}>支付宝支付(修复中)</Text>
                {
                  this.state.isAlipay ?
                    <Image resizeMode={'contain'} style={styles.payCheck} source={require('./../../assets/pay-check.png')} />
                    :
                    null
                }
              </View>
              <TouchableOpacity onPress={() => this.setState({ isAlipay: false })} style={styles.payRow}>
                <Text style={styles.rowTitle}>微信支付</Text>
                {
                  !this.state.isAlipay ?
                    <Image resizeMode={'contain'} style={styles.payCheck} source={require('./../../assets/pay-check.png')} />
                    :
                    null
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.buyPackage()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>确认开通</Text>
              </TouchableOpacity>
            </ScrollView>
        }
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
    width: width * 0.93,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(72)
  },

  titleBox: {
    width: width,
    height: px2dp(52),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.035,
    paddingTop: px2dp(10)
  },

  title: {
    fontSize: 14,
    color: '#333'
  },

  row: {
    width: width,
    height: px2dp(48),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
    backgroundColor: '#fff'
  },

  payRow: {
    width: width,
    height: px2dp(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
    backgroundColor: '#fff',
    marginBottom: 1
  },

  rowUnSelect: {
    width: px2dp(18),
    height: px2dp(18),
    borderRadius: px2dp(9),
    borderWidth: 1,
    borderColor: '#999',
    marginRight: px2dp(6),
    justifyContent: 'center',
    alignItems: 'center'
  },

  rowSelect: {
    width: px2dp(14),
    height: px2dp(14),
    borderRadius: px2dp(7),
    backgroundColor: colors.themeColor
  },

  payCheck: {
    width: px2dp(16),
    height: px2dp(16),
    borderRadius: px2dp(8),
    marginRight: px2dp(6),
    marginTop: 1,
    tintColor: colors.themeColor
  },

  rowTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700'
  }
})