import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LoadingKit from './LoadingKit'
export default class More extends PureComponent {

  static defaultProps = {
    title: '正在加载更多',
  }

  render () {
    return (
      <View>
        <View style={styles.content}>
          <LoadingKit tintColor={'#999'}/>
          <Text style={{ fontSize: 12, color: '#999' }}>&nbsp;&nbsp;{this.props.title}</Text>
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