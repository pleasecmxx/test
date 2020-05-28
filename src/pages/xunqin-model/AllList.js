import React, { Component } from 'react';
import { View, Text, StyleSheet, RefreshControl, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate } from '../../NavigationService';
import redux from './../../redux/store'
import { FlatList } from 'react-native-gesture-handler';
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import XunQinItem from '../../components/business-kit/XunQinItem';


export default class AllList extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      data: [],
      loading: false,
      refreshing: true,
      token: state.token,
      isEnd: false,
      isSelf: this.props.route.params.isSelf,
    };
    this.page = 0;
  }

  componentDidMount () {
    this.refresh();
  }

  refresh() {
    let params = {
      type: this.state.isSelf ? 1 : 0,
      page: this.page,
      token: this.state.token,
    };
    HttpUtils.postRequrst(api.xunqinList, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          this.page++;
          if (res.list.length < 10) {
            this.setState({ data: res.list, isEnd: true, refreshing: false });
          } else {
            this.setState({ data: res.list, isEnd: false, refreshing: false });
          }
        } else {
          toast(res.msg)
          this.setState({ loading: false, refreshing: false, isEnd: false, })
        }
      })
  }

  render_item ({ item, index }) {
    return (
      <XunQinItem item={item} all/>
    )
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={this.state.isSelf ? "我的寻亲历史" : "寻亲互帮"} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={[colors.themeColor]}
              progressBackgroundColor={"#ffffff"}
              onRefresh={() => {
                this.page = 0;
                this.setState({ refreshing: true })
                this.refresh();
              }}
            />
          }
          data={this.state.data}
          renderItem={this.render_item.bind(this)}
          keyExtractor={(item, index) => index + ''}
          contentContainerStyle={{ width: '100%', paddingTop: px2dp(12) }}
        />
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
    backgroundColor: 'rgb(240,240,237)'
  },
})