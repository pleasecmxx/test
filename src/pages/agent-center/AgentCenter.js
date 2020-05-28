import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, Keyboard } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors } from './../../utils/base';
import { navigate } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import Loading from './../other/Loading'

export default class AgentCenter extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      userMsg: state.msg,
      token: state.token,
      loading: false,
      type: this.props.route.params.type
    }
    const changeListener = () => {
      const state = store.getState();
      this.setState({ userMsg: state.msg });
    };
    redux.subscribe(changeListener);
  }

  componentDidMount () {
    if (this.state.type == 1) {
      return false;   //如果是代理就不重复请求
    }
    this.setState({ loading: true })
    let params = {
      token: this.state.token
    };
    HttpUtils.postRequrst(api.becomeAgent, params)
      .then(res => {
        console.log(res);
        this.setState({ loading: false })
      })
      .catch("网络出错了，请稍后重试")
  }

  jumpToGroup () {
    navigate('MyGroup')
  }

  jumToCashList () {
    navigate('CashHistory')
  }

  jumpToGetList () {
    navigate('GetList')
  }

  jumpToMyBanner () {
    navigate('MyBanner')
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead />
        {
          this.state.loading ?
            <Loading />
            :
            <>
              <View style={styles.userShow}>
                <Image style={styles.userImg} source={{ uri: this.state.userMsg.portrait }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.userName}>{this.state.userMsg.name}</Text>
                  <Image resizeMode={'contain'} style={styles.icon} source={require('./../../assets/vip_icon.png')} />
                </View>
              </View>
              <View style={styles.bgContainer}>
                <View style={styles.bgContent}>
                  <View style={styles.contentLeft}>
                    <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>{this.state.userMsg.balance}</Text>
                    <Text style={{ fontSize: 12, color: '#fff', opacity: 0.88, fontWeight: '400' }}>可提现金额（元）</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigate('TakeCash')} style={styles.tackCashBtn}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>我要提现</Text>
                  </TouchableOpacity>
                </View>
                <Image style={styles.agentBg} source={require('./../../assets/agent.png')} />
              </View>
              <View style={styles.itemRow}>
                <TouchableOpacity onPress={() => this.jumpToGroup()} style={styles.item}>
                  <Image style={styles.itemIcon} source={require('./../../assets/set-mygroup.png')} />
                  <View style={styles.itemRight}>
                    <Text style={{ fontSize: 15, color: '#000' }}>我的团队</Text>
                    <Text style={styles.smallText}>{this.state.userMsg.fens_number}人</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.jumToCashList()} style={styles.item}>
                  <Image style={styles.itemIcon} source={require('./../../assets/set-myget.png')} />
                  <View style={styles.itemRight}>
                    <Text style={{ fontSize: 15, color: '#000' }}>提现明细</Text>
                    <Text numberOfLines={1} style={styles.smallText}>累计{this.state.userMsg.withdrawal_success}元</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.itemRow}>
                <TouchableOpacity onPress={() => this.jumpToGetList()} style={styles.item}>
                  <Image style={styles.itemIcon} source={require('./../../assets/set-myreword.png')} />
                  <View style={styles.itemRight}>
                    <Text style={{ fontSize: 15, color: '#000' }}>推广奖励</Text>
                    <Text style={styles.smallText}>{this.state.userMsg.extension_money}元</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.jumpToMyBanner()} style={styles.item}>
                  <Image style={styles.itemIcon} source={require('./../../assets/set-promotion.png')} />
                  <View style={styles.itemRight}>
                    <Text style={{ fontSize: 15, color: '#000' }}>我的推广</Text>
                    <Text style={styles.smallText}>0次</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
        }
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

  userShow: {
    width: width * 0.94,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: px2dp(12),
    backgroundColor: '#fff',
    borderRadius: px2dp(4)
  },

  userName: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700'
  },

  userImg: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(30),
    marginRight: px2dp(20)
  },

  icon: {
    width: px2dp(16),
    height: px2dp(16),
    marginLeft: 4,
    marginTop: 2
  },

  bgContainer: {
    position: 'relative',
    marginVertical: px2dp(24)
  },

  bgContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.93,
    height: width * 0.93 * 0.261,
    zIndex: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(20)
  },

  contentLeft: {
    height: px2dp(52),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: px2dp(-6)
  },

  agentBg: {
    width: width * 0.93,
    height: width * 0.93 * 0.261,
    borderRadius: px2dp(6)
  },

  tackCashBtn: {
    paddingHorizontal: 15,
    height: px2dp(30),
    borderRadius: px2dp(15),
    backgroundColor: '#183883',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemRow: {
    width: width * 0.93,
    height: px2dp(72),
    marginBottom: px2dp(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  item: {
    width: width * 0.41,
    height: px2dp(40),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 4
  },

  itemIcon: {
    width: px2dp(22),
    height: px2dp(22)
  },

  itemRight: {
    height: px2dp(36),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: px2dp(8)
  },

  smallText: {
    fontSize: 12,
    color: '#999',
    maxWidth: px2dp(100),
    textAlign: 'left'
  }
})