import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { px2dp, width, colors } from '../../utils/base';
import { navigate } from '../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'


export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      show: state.show
    }
  }

  jumpUser () {

  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"帮助教程"} />
        <View style={[styles.container, { marginTop: px2dp(24) }]}>
          <View style={styles.content}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>用户手册</Text>
              <Text style={{ fontSize: 12, color: '#fff', marginTop: px2dp(6) }}>USER'S MANUAL</Text>
            </View>
            <TouchableOpacity onPress={() => this.jumpUser()} style={styles.btn}>
              <Text style={{ fontSize: 14, color: colors.themeColor }}>查看详情</Text>
            </TouchableOpacity>
          </View>
          <Image style={styles.bannerCard} source={require('./../../assets/user-use-banner.png')} />
        </View>
        {
          this.state.show ?
            <View style={styles.container}>
              <View style={styles.content}>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>代理手册</Text>
                  <Text style={{ fontSize: 12, color: '#fff', marginTop: px2dp(6) }}>Brochure for Agents</Text>
                </View>
                <View style={styles.btn}>
                  <Text style={{ fontSize: 14, color: colors.themeColor }}>查看详情</Text>
                </View>
              </View>
              <Image style={styles.bannerCard} source={require('./../../assets/user-agent-banner.png')} />
            </View>
            :
            null
        }
      </View>
    )
  }
}



const styles = StyleSheet.create({
  page: {
    width: width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f6f6f6'
  },

  container: {
    marginTop: px2dp(16),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },

  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.93,
    height: width * 0.93 * 452 / 1035,
    paddingLeft: px2dp(24),
    justifyContent: 'space-between',
    paddingVertical: px2dp(24),
    zIndex: 999
  },

  bannerCard: {
    width: width * 0.93,
    height: width * 0.93 * 452 / 1035
  },

  btn: {
    height: px2dp(28),
    width: px2dp(82),
    borderRadius: px2dp(14),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})