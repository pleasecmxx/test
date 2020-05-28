import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, width, px2dp } from '../../utils/base';
import LoadingKit from './../../components/tool-kit/LoadingKit'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title || "正在努力为您加载"
    }
  }

  render () {
    return (
      <View style={styles.page}>
        <LoadingKit tintColor={colors.themeColor}/>
        <Text style={{ color: colors.themeColor, fontSize: 12, marginTop: 6 }}>{this.state.title}</Text>
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
    backgroundColor: '#fff',
    paddingTop: px2dp(200)
  }
})