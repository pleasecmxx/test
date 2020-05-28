import React, { Component } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import NormalHead from './../../components/tool-kit/NormalHead';
import { width, px2dp, colors } from '../../utils/base';
import Footer from '../../components/tool-kit/Footer';
import More from './../../components/tool-kit/More'
import MapItem from './../../components/business-kit/MapItem'
import redux from './../../redux/store'
import HttpUtils from './../../utils/http'
import api from './../../utils/api'

export default class ResultList extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      token: state.token,
      list: [],
      isEnd: false,
      refreshing: false,
      loading: false,
    };
    this.page = 0;
  }

  componentDidMount () {
    this.getData();
  }

  componentWillUnmount(){
    this.timer && clearTimeout(this.timer)
  }
  getData () {
    if (this.state.loading || this.state.isEnd) {
      this.setState({ refreshing: false })
      return false;   //防抖
    };
    this.setState({ loading: true })
    let params = {
      token: this.state.token,
      type: 2,
      page: this.page,
    }
    HttpUtils.postRequrst(api.resultList, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          let list = this.state.list;
          list = list.concat(res.list);
          if (res.list.length < 10) {
            this.setState({ list, loading: false, refreshing: false, isEnd: true })
          } else {
            this.setState({ list, loading: false, refreshing: false, isEnd: false })
          }
          this.page++;
        } else {
          toast(res.msg)
        }
      })
      .catch(e => {
        toast("网络出错了，请稍后重试")
      })
  }

  render_foot () {
    if (this.state.list.length > 0) {
      if (this.state.isEnd) {
        return <Footer />
      } else {
        return <More />
      }
    } else {
      return null
    }
  }

  render_item ({ item, index }) {
    return (
      <MapItem item={item} />
    )
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"寻亲结果"} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={[colors.themeColor]}
              progressBackgroundColor={"#ffffff"}
              onRefresh={() => {
                this.page = 0;
                this.setState({ refreshing: true, isEnd: false, list: []});
                this.timer = setTimeout(() => {
                  this.getData();
                }, 500);
              }}
            />
          }
          data={this.state.list}
          renderItem={this.render_item.bind(this)}
          keyExtractor={(item, index) => index + ''}
          ListFooterComponent={this.render_foot()}
          contentContainerStyle={styles.listCotent}
          onEndReached={this.getData.bind(this)}
          onEndReachedThreshold={0.2}
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

  listCotent: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: px2dp(12)
  }
})