import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate } from '../../NavigationService';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from './../../components/my-tab-bar/ScrollTabBar'
import api from './../../utils/api'
import HttpUtils from '../../utils/http';
import ArticleList from './ArticleList'
import Loading from './../other/Loading'
import { changeJumpType } from '../../navigator';

export default class ArticleTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      loading: true
    }
  }

  componentDidMount () {
    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',
      (obj) => {
        changeJumpType(1)
      }
    );
    HttpUtils.postRequrst(api.articleTabs, {})
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          this.setState({ tabs: res.list })
          this.delayShow = setTimeout(() => {
            this.setState({ loading: false });
          }, 200);
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        console.log(err);
        toast("网络出错了，请稍后重试")
      })
  }

  componentWillUnmount () {
    this.delayShow && clearTimeout(this.delayShow)
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"选择文章"} />
        {
          this.state.loading ?
            <Loading />
            :
            <>
              <ScrollableTabView
                tabBarTextStyle={{ fontSize: 14 }}
                activeTextColor={'#ffffff'}
                inactiveTextColor={'#ffffff'}
                tabBarUnderlineStyle={{ height: 0, backgroundColor: '#fff' }}
                initialPage={0}
                renderTabBar={() =>
                  <ScrollableTabBar
                    activeTextColor={"#fff"}
                    inactiveTextColor={"#fff"}
                    activeFontSize={16} />}
              >
               {this.state.tabs.map((item,index) => {
                 return <ArticleList id={item.id} tabLabel={item.class_name} key={index + ''} />
               })}
              </ScrollableTabView>
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
    backgroundColor: '#f6f6f6',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative'
  },
})