import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
import redux from './../../redux/store';
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import Footer from '../../components/tool-kit/Footer';
/**
 * 团队列表
 */


export default class GroupList extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      token: state.token,
      list: [],
      loading: true,    //是否在加载中
      refreshing: false,    //是否刷新
      isEnd: false,     //是否加载完毕
    }
  }

  componentDidMount () {
    this.getData();
  }

  getData () {
    let params = {
      token: this.state.token,
      type: this.props.type,   //一级会员还是二级会员
      page: this.page,
    };
    HttpUtils.postRequrst(api.myTeam, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          if (res.list.length < 10) {
            this.setState({ list: res.list, loading: false, isEnd: true });
          } else {
            this.setState({ list: res.list, loading: false, isEnd: false });
          }
          this.page++;
        } else {
          toast(res.msg);
          this.setState({ loading: false, refreshing: false });
        }
      })
  }

  render_item ({ item, index }) {
    return (
      <View style={styles.row}>
        <Image style={styles.img} source={{ uri: item.portrait ? item.portrait : 'http://' }} />
        <View style={styles.rowCenter}>
          <Text style={{ fontSize: 16, color: '#000' }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: px2dp(6) }}>{item.creation_time}</Text>
        </View>
      </View>
    )
  }

  render_foot() {
    if(this.state.list.length > 5){
      return <Footer />
    }else {
      return null
    }
  }
  render () {
    return (
      <FlatList
        data={this.state.list}
        renderItem={this.render_item.bind(this)}
        keyExtractor={(item, index) => index + ''}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={this.render_foot.bind(this)}
      />
    )
  }
}


const styles = StyleSheet.create({
  listContainer: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: px2dp(12)
  },

  row: {
    width: width * 0.93,
    height: px2dp(72),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginBottom: px2dp(12),
    paddingHorizontal: px2dp(12)
  },

  img: {
    width: px2dp(46),
    height: px2dp(46),
    borderRadius: px2dp(23),
    backgroundColor: '#eee'
  },

  rowCenter: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: px2dp(12)
  }
})