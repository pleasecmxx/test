import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, DeviceEventEmitter } from 'react-native'
import { px2dp, width, colors, toast, isIos } from './../../utils/base';
import { back } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import LinearGradient from 'react-native-linear-gradient'

export default class Accept extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNum: '',
      code: '',
      password: '',
      timer: 59,
      showTimer: false,  //控制当前是倒计时还是可获取验证码
      codeLoading: false,    //控制验证码等待
      loading: false,  //控制注册功能等待
    }
  }

  agree () {
    DeviceEventEmitter.emit('I_agree', {})
    back();
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"保密协议"} />
        <ScrollView
          // style={{marginVertical: 20}}
          contentContainerStyle={styles.content}>
          <Text style={styles.text}>
            按照苹果的惯例，明年秋季发布的iPhone 12系列将配备全新的A14处理器，目前产业链已经给出了A14处理器的部分信息。
          产业链透露，苹果A14处理器将采用台积电的5nm工艺制造，明年初开始小范围试产，第二季度将正式量产。
          目前台积电5nm工艺的客户基本上只有苹果和海思，对应的产品分别是A14处理器以及麒麟1000系列SoC。
          产能方面，据称目前台积电5nm工艺的良率可达50%以上，预计最快明年第一季度量产，初期月产能5万片，随后将逐步增加到7~8万片。
          全新的5nm工艺相比7nm来说有何提升呢？按照台积电官方数据，相较于7nm（第一代DUV），基于Cortex A72核心的全新5nm芯片能够提供1.8倍的逻辑密度、速度增快15%，或者功耗降低30%，同样制程的SRAM也十分优异且面积缩减。
          当然，性能方面A14可能并不算苹果最强悍的产品。毕竟按照目前的传闻来看，苹果明年会更新iPad Pro产品线，苹果识别会打造出A13X或者A14X来满足性能怪兽的需求。
          按照苹果的惯例，明年秋季发布的iPhone 12系列将配备全新的A14处理器，目前产业链已经给出了A14处理器的部分信息。
          产业链透露，苹果A14处理器将采用台积电的5nm工艺制造，明年初开始小范围试产，第二季度将正式量产。
          目前台积电5nm工艺的客户基本上只有苹果和海思，对应的产品分别是A14处理器以及麒麟1000系列SoC。
          产能方面，据称目前台积电5nm工艺的良率可达50%以上，预计最快明年第一季度量产，初期月产能5万片，随后将逐步增加到7~8万片。
          全新的5nm工艺相比7nm来说有何提升呢？按照台积电官方数据，相较于7nm（第一代DUV），基于Cortex A72核心的全新5nm芯片能够提供1.8倍的逻辑密度、速度增快15%，或者功耗降低30%，同样制程的SRAM也十分优异且面积缩减。
          当然，性能方面A14可能并不算苹果最强悍的产品。毕竟按照目前的传闻来看，苹果明年会更新iPad Pro产品线，苹果识别会打造出A13X或者A14X来满足性能怪兽的需求。
          </Text>
        </ScrollView>
        <LinearGradient
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.88)', 'rgba(255,255,255,1)']}
          style={styles.btnContainer}
        >
          <TouchableOpacity onPress={() => this.agree()} style={styles.btnContent}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>同意</Text>
          </TouchableOpacity>
        </LinearGradient>
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

  inputRow: {
    width: width,
    height: px2dp(60),
    backgroundColor: '#fff',
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
  },

  inputIcon: {
    width: px2dp(20),
    height: px2dp(20),
  },

  input: {
    width: width * 0.93 - px2dp(20),
    height: px2dp(52),
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeInput: {
    // width: width * 0.93 - px2dp(120),
    height: px2dp(52),
    fontSize: 16,
    paddingHorizontal: 0,
    paddingLeft: px2dp(10)
  },

  codeBtn: {
    height: px2dp(24),
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: px2dp(12),
    justifyContent: 'center',
    alignItems: "center",
    paddingHorizontal: 8
  },

  btnText: {
    fontSize: 13,
    color: colors.themeColor,
    fontWeight: '400',
  },

  btnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginVertical: px2dp(24),
  },

  content: {
    // flex: 1,
    width: width,
    paddingVertical: px2dp(20),
    paddingHorizontal: width * 0.03,
    paddingBottom: px2dp(72)
  },

  text: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333'
  }
})