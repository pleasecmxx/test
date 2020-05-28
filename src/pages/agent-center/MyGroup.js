/**
 * 我的团队
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
// import { size, statusBarHeight, px2dp, width, onePx, colors, toast, isIos } from './../../utils/base';
// import { navigate } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from './../../components/my-tab-bar/ScrollTabBar'
import GroupList from './GroupList'

export default class MyGroup extends Component {
  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"我的团队"} />
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
          <GroupList tabLabel="一级会员" type={1} />
          <GroupList tabLabel="二级会员" type={2} />
        </ScrollableTabView>
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
})