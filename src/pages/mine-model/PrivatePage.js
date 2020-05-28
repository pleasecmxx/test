import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, Keyboard } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors } from '../../utils/base';
import { navigate } from '../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import ActionSheet from 'react-native-actionsheet'
import redux from './../../redux/store'




export default class PrivatePage extends Component {
  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"用户隐私协议"} />
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
  }
})