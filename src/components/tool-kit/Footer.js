import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { onePx } from './../../utils/base'

export default class Footer extends PureComponent {

  static defaultProps = {
    title: '我是有底线的',
  }

  render () {
    return (
      <View>
        <View style={styles.content}>
          <View style={{ width: 42, height: onePx, backgroundColor: '#999', marginRight: 6, opacity: 0.72 }}></View>
          <Text style={{ fontSize: 12, color: '#999' }}>{this.props.title}</Text>
          <View style={{ width: 42, height: onePx, backgroundColor: '#999', marginLeft: 6, opacity: 0.72 }}></View>
        </View>
      </View>

    )
  }
}


const styles = StyleSheet.create({
  content: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    marginTop: -1,
  }
})