import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate } from '../../NavigationService';
import redux from './../../redux/store'

export default class XunQinPage extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      name: '',
      title: ''
    }
  }

  componentDidMount () {
    // this.selectArcticle = DeviceEventEmitter.addListener('sendArticle', (a) => this.getArticle(a));
    // this.getIsAgree = DeviceEventEmitter.addListener('I_agree', (a) => this.setState({ isAgree: true }));
  }

  componentWillUnmount () {
    // this.selectArcticle && this.selectArcticle.remove();
    // this.getIsAgree && this.getIsAgree.remove();
  }

  goToWrite () {
    if (this.state.title === '') {
      return toast("请输入走失人名称");
    };
    if (this.state.name === '') {
      return toast("请输入寻亲信息标题");
    };
    navigate('WriteMsg',{ name: this.state.name, title: this.state.title });
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"发布走失亲人信息"} backType={1} />
        <KeyboardAvoidingView behavior={"height"}>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View style={[styles.row, { marginTop: px2dp(12) }]}>
              <Text style={styles.title}>走失人名称</Text>
              <TextInput
                placeholder={"请尽量输入走失人真实姓名"}
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
              />
            </View>
            <View style={styles.bgRow}>
              <Text style={styles.smallTitle}>寻亲内容标题</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                placeholder={'请输入标题'}
                style={styles.rowInput}
                onChangeText={(text) => this.setState({ title: text })}
              />
            </View>
            <View style={styles.bgRow}>
              <Text style={styles.smallTitle}>寻亲内容描述</Text>
            </View>
            <TouchableOpacity onPress={() => this.goToWrite()} style={styles.row}>
              <Text numberOfLines={1} style={styles.title}>录入寻亲信息</Text>
              <Image style={{ width: px2dp(18), height: px2dp(18) }} source={require('./../../assets/enter.png')} />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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

  row: {
    width: width,
    height: px2dp(60),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    paddingHorizontal: width * 0.035,
    overflow: 'hidden'
  },

  title: {
    fontSize: 16,
    color: '#000',
    maxWidth: width * 0.8
  },

  bottomArea: {
    position: 'absolute',
    width: width,
    height: px2dp(86),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
    zIndex: 999
  },

  btnContainer: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginVertical: px2dp(36)
  },


  bgRow: {
    width: width,
    height: px2dp(42),
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.035,
    paddingBottom: px2dp(6),
  },

  bigRow: {
    width: width,
    height: px2dp(72),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.035
  },

  input: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 0,
    paddingRight: width * 0.035,
    maxWidth: width * 0.93 - 68,
    textAlign: 'right'
  },

  smallTitle: {
    fontSize: 14,
    color: '#999'
  },

  selectImg: {
    width: px2dp(42),
    height: px2dp(42),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: px2dp(4)
  },

  selectIcon: {
    width: px2dp(24),
    height: px2dp(24),
    // tintColor: ''
  },

  rowInput: {
    width: width * 0.93,
    height: px2dp(42),
    color: '#000',
    fontSize: 16,
    alignItems: 'center',
    paddingVertical: 0
  },

  inputRow: {
    width: width,
    height: px2dp(60),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
    paddingVertical: px2dp(6)
  }
})