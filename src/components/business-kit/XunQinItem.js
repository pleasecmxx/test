import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, TouchableOpacity, StatusBar, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { navigate } from './../../NavigationService';
import { width, px2dp, webViewUrl } from './../../utils/base'



export default class XunQinItem extends Component {
  constructor(props) {
    super(props);
  }

  jumpDetails (item) {
    // alert()
    let url = `${webViewUrl + '/?luid=' + item.id}`;
    console.log(url)
    navigate("MyWebView", { title: item.title, url: `${webViewUrl + '/?luid=' + item.id}` })
  }

  render () {
    const { item } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.jumpDetails(item)}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Image style={styles.itemLogo} source={{ uri: item.logo }} />
            <View style={styles.itemCenter}>
              <Text numberOfLines={1} style={{ fontSize: 15, color: '#000', fontWeight: '700' }}>{item.title}</Text>
              {
                this.props.all ?
                  <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>发布用户：{item.name}</Text>
                  :
                  null
              }
              <Text numberOfLines={1} style={{ fontSize: 10, color: '#999' }}>创建时间：{item.time}</Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.resultText, item.comment === 0 ? { color: '#999' } : null]}>{item.comment}条热心回复</Text>
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
    height: px2dp(56),
    justifyContent: 'space-around',
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