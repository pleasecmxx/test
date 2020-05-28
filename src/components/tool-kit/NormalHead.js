import React, { PureComponent } from 'react'
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native'
import { back, navigate } from './../../NavigationService'
import { width, statusBarHeight, px2dp, size, isIos } from './../../utils/base'

export default class NormalHead extends PureComponent {
  constructor(porps) {
    super(porps);
  }

  render () {
    return (
      <View style={[styles.normalHead, this.props.style]}>
        {
          this.props.noBack ?
            <View style={styles.backContainer}>
            </View>
            :
            <TouchableHighlight
              underlayColor={'#eee'}
              onPress={() => back(this.props.backType)}>
              <View style={styles.backContainer}>
                {
                  isIos() ?
                    <Image source={require('./../../assets/back-android.png')} style={styles.backImg} />
                    :
                    <Image source={require('./../../assets/back-android.png')} style={styles.backImg} />
                }
              </View>
            </TouchableHighlight>
        }
        <Text style={styles.normalHeadTitle}>{this.props.title || ""}</Text>
        {
          this.props.rightText ?
            <TouchableHighlight
              underlayColor={'#eee'}
              onPress={() => this.props.rightPressMethod()}>
              <View style={styles.backContainer}>
                <Text style={{fontSize: 15, color: '#000'}}>{this.props.rightText}</Text>
              </View>
            </TouchableHighlight>
            :
            <View style={styles.backContainer}></View>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  normalHeadShadow: {
    width: width,
    height: statusBarHeight + size.headHeight,
    paddingTop: statusBarHeight,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { w: 0, h: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  backContainer: {
    width: width * 0.035 * 2 + px2dp(24),
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },

  normalHeadTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700'
  },

  backImg: {
    height: px2dp(20),
    width: px2dp(20),
    tintColor: '#000',
    marginLeft: -4
  },

  normalHead: {
    width: width,
    height: statusBarHeight + size.headHeight,
    paddingTop: statusBarHeight,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
  },
})