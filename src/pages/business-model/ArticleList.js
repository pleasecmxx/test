import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import { width, px2dp, colors, toast, onePx } from '../../utils/base';
import { navigate } from '../../NavigationService';
import api from './../../utils/api'
import HttpUtils from '../../utils/http';



export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true
    };
    this.page = 0;
  }

  componentDidMount() {
    let params = {
      class_id: this.props.id,
      page: this.page
    };
    HttpUtils.postRequrst(api.articleList, params)
      .then(res => {
        console.log(res);
        this.setState({ list: res.list, loading: false })
      })
      .catch(err => {
        console.log(err)
      })
  }

  jumpDetails(item) {
    let url = 'https://xqb.yuncshop.com/news.html?news_id=' + item.id;
    navigate('SelectArticle', { url: url, id: item.id, title: item.title, imgUrl: item.portrait })
  }

  render_item({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.jumpDetails(item)} style={styles.item}>
        <Image style={styles.itemImg} source={{ uri: item.portrait }} />
        <View style={styles.itemRight}>
          <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDec}>{item.source}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render_empty() {
    if (this.state.loading) {
      return null
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyIcon} source={require('./../../assets/empty.png')} />
          <Text style={styles.emptyText}>暂无相关文章</Text>
        </View>
      )
    }
  }
  render() {
    return (
      <FlatList
        data={this.state.list}
        renderItem={this.render_item.bind(this)}
        keyExtractor={(item, index) => index + ''}
        contentContainerStyle={styles.contentStyles}
        ListEmptyComponent={this.render_empty()}
      />
    )
  }
}


const styles = StyleSheet.create({
  contentStyles: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f6f6f6'
  },

  item: {
    width: width,
    height: px2dp(96),
    backgroundColor: '#f6f6f6',
    paddingHorizontal: width * 0.035,
    borderBottomWidth: onePx,
    borderBottomColor: '#d9d9d9',
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  itemImg: {
    width: px2dp(60),
    height: px2dp(60),
  },

  itemRight: {
    width: width - px2dp(96),
    height: px2dp(64),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  itemTitle: {
    fontSize: 16,
    color: '#000'
  },


  itemDec: {
    fontSize: 12,
    color: '#000'
  },

  emptyIcon: {
    width: px2dp(100),
    height: px2dp(100),
    tintColor: '#d9d9d9'
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px2dp(80)
  },

  emptyText: {
    fontSize: 12,
    color: '#999'
  }
})