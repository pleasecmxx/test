import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import NormalHead from '../../components/tool-kit/NormalHead';
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate } from '../../NavigationService';




export default class SelectMethod extends Component {

  jumpGame() {
    toast("暂未开放，敬请期待！")
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"我要寻亲"} />
        <TouchableOpacity onPress={() => navigate("FindBySelf")} style={[styles.item, { marginTop: px2dp(24) }]}>
          <Image style={styles.itemLeft} source={require('./../../assets/edit-icon.png')} />
          <View style={styles.itemRight}>
            <View style={styles.itemCenter}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: colors.themeColor, fontWeight: '700' }}>自定义链接寻亲</Text>
              <Text numberOfLines={2} style={{ fontSize: 10, color: '#999' }}>分享一条自定义链接给亲人朋友</Text>
            </View>
            <Image source={require('./../../assets/enter.png')} style={styles.rightAngel} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.jumpGame()} style={styles.item}>
          <Image style={styles.itemLeft} source={require('./../../assets/hb-icon.png')} />
          <View style={styles.itemRight}>
            <View style={styles.itemCenter}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: colors.themeColor, fontWeight: '700' }}>红包寻亲</Text>
              <Text numberOfLines={2} style={{ fontSize: 10, color: '#999' }}>分享一个红包给亲人朋友</Text>
            </View>
            <Image source={require('./../../assets/enter.png')} style={styles.rightAngel} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.jumpGame()} style={styles.item}>
          <Image style={styles.itemLeft} source={require('./../../assets/game-icon.png')} />
          <View style={styles.itemRight}>
            <View style={styles.itemCenter}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: colors.themeColor, fontWeight: '700' }}>游戏寻亲</Text>
              <Text numberOfLines={2} style={{ fontSize: 10, color: '#999' }}>分享一个游戏给亲人朋友</Text>
            </View>
            <Image source={require('./../../assets/enter.png')} style={styles.rightAngel} />
          </View>
        </TouchableOpacity>
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
    width: width * 0.93,
    height: px2dp(84),
    backgroundColor: '#fff',
    marginTop: px2dp(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: px2dp(6),
    paddingHorizontal: px2dp(12)
  },

  leftBox: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(4),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },

  typeImg: {
    width: px2dp(24),
    height: px2dp(24),
    opacity: 0.96
  },

  item: {
    width: width * 0.94,
    height: px2dp(96),
    backgroundColor: '#fff',
    borderRadius: px2dp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(10),
    marginBottom: px2dp(24)
  },

  itemLeft: {
    width: px2dp(24),
    height: px2dp(24),
    tintColor: colors.themeColor
  },

  itemLogo: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(4)
  },

  itemCenter: {
    height: px2dp(46),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: width * 0.40,
  },

  itemRight: {
    width: width * 0.93 - px2dp(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },

  rightAngel: {
    width: px2dp(18),
    height: px2dp(18),
    tintColor: '#999'
  },
})