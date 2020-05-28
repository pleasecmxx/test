import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors } from '../../utils/base';
import { navigate } from '../../NavigationService';



export default class FindByHB extends Component {
  render() {
    return (
      <View style={styles.page}>
        <NormalHead title={"分享红包"}/>
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