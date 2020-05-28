//@ts-nocheck
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { size, px2dp, colors, onePx } from './../../utils/base';

export default class TabItem extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    // const { cart } = this.state;
    const { name, icon, index, isIphoneX, isFocused } = this.props;
    return (
      <View style={styles.tab}>
        <Image style={[styles.tabIcon,{tintColor: isFocused ? colors.themeColor : '#999'}]} source={icon} />
        <Text style={[styles.label,{color: isFocused ? colors.themeColor : '#999'}]}>{name}</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  tab: {
    position: 'relative',
    width: px2dp(165),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabContent: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },

  tabIcon: {
    width: px2dp(22),
    height: px2dp(22),
  },

  label: {
    fontSize: 12,
    color: '#333',
    marginTop: px2dp(2)
  },

  pointShow: {
    position: 'absolute',
    top: px2dp(-4),
    right: px2dp(-5),
    minWidth: px2dp(18),
    paddingHorizontal: px2dp(4),
    height: px2dp(18),
    borderRadius: px2dp(9),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  }
})