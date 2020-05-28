import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, width, px2dp } from '../../utils/base';
import LoadingKit from './../../components/tool-kit/LoadingKit'

export default class OptionLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title || "加载中..."
    }
  }

  render () {
    return (
      <View style={styles.page}>
        <View style={styles.loadingContainer}>
          <LoadingKit tintColor={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 10 }}>{this.state.title}</Text>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
    zIndex: 9999
  },

  loadingContainer: {
    height: px2dp(100),
    width: px2dp(120),
    backgroundColor: 'rgba(0,0,0,0.66)',
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: px2dp(8)
  }
})