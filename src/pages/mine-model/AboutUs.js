import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'
import { px2dp, width, onePx, colors } from '../../utils/base';
import { navigate } from '../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import redux from './../../redux/store'

export default class AboutUs extends Component {
  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"关于我们"} />
        <View style={styles.box}>
          <Image source={require('./../../assets/app-logo.png')} style={styles.logo} />
        </View>
        <View style={styles.row}>
          <Text style={{ fontSize: 14, color: '#000' }}>当前版本</Text>
          <Text style={{ fontSize: 14, color: '#999' }}>V4.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ fontSize: 13, color: '#000' }}>新版更新</Text>
          <Text style={{ fontSize: 13, color: colors.themeColor }}>已是最新版本</Text>
        </View>
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

  box: {
    width: width,
    height: px2dp(196),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  logo: {
    width: px2dp(72),
    height: px2dp(72) * 484 / 426
  },

  row: {
    width: width,
    height: px2dp(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
    backgroundColor: '#fff',
    borderBottomWidth: onePx,
    borderBottomColor: '#d9d9d9'
  }
})