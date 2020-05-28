import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, TouchableOpacity, StatusBar, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { navigate } from './../../NavigationService';
import { width, px2dp, toast } from './../../utils/base'



export default class MapItem extends Component {
  constructor(props) {
    super(props);
  }

  jumpDetails (item) {
    if (item.result_number === 0) {
      return false;
    }
    navigate("CheckStatus",{ id: item.id, title: item.name })
  }

  render () {
    const { item } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.jumpDetails(item)}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Image style={styles.itemLogo} source={{ uri: item.portrait }} />
            <View style={styles.itemCenter}>
              <Text numberOfLines={1} style={{ fontSize: 15, color: '#000', fontWeight: '700' }}>{item.name}</Text>
              <Text numberOfLines={2} style={{ fontSize: 10, color: '#999' }}>创建时间：{item.time}</Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.resultText,item.result_number === 0 ? {color: '#999'}: null]}>获得{item.result_number}个结果</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    width: width * 0.94,
    height: px2dp(88),
    backgroundColor: '#fff',
    borderRadius: px2dp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(10),
    marginBottom: px2dp(12)
  },

  itemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  itemLogo: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(4)
  },

  itemCenter: {
    height: px2dp(40),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: width * 0.40,
    paddingLeft: px2dp(10),
    // backgroundColor: '#f2f2f2'
  },

  itemRight: {
    maxWidth: width * 0.3,
    // backgroundColor: 'tomato',
    justifyContent: 'flex-end'
  },

  resultText: {
    fontSize: 16,
    color: '#ff0000'
  },
})