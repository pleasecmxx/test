import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'



export default class TestPage extends Component {
  render () {
    return (
      <View style={styles.page}>

      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    height: 12,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative'
  }
})