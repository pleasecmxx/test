import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, Keyboard, NativeModules, LayoutAnimation } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from './../../utils/base';
import { navigate } from './../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import LodingKit from './../../components/tool-kit/LoadingKit'
import httpUtils from './../../utils/http'
import api from '../../utils/api';
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class UseInvateCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invateCode: '',
      reInavteCode: '',    //获取结果后的确认验证码，避免被用户改动
      height: 0,
      invateMan: {
        id: 7,
        mobile: "",
        name: "木有昵称",
        portrait: "https://xqb.yuncshop.com/img/portrait.jpg",
      },
      loading: false,  //控制按钮加载状态
      active: false,   //控制按钮激活
    }
  }

  componentDidMount () {
    StatusBar.setBarStyle('dark-content');
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow (e) {
    this._inputContainer.setNativeProps({
      style: {
        borderBottomColor: colors.themeColor,
        borderBottomWidth: 1,
      }
    })
  }

  _keyboardDidHide (e) {
    this._inputContainer.setNativeProps({
      style: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
      }
    })
  }

  rightPressMethod = () => navigate('Register',{ invateCode: null })

  show () {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      height: px2dp(72)
    })
  }

  hide () {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      height: 0
    })
  }

  changeText (text) {   //输入逻辑处理
    this.setState({ invateCode: text });
    if (this.state.loading) {
      return false;
    }
    if (text.length === 6 || text.length === 11) {
      Keyboard.dismiss();
      this.setState({ loading: true })
      httpUtils.postRequrst(api.checkInvateCode, { search: text })
        .then(res => {
          console.log(res)
          if (res.code === 1) {   //如果邀请码或手机号有效
            this.setState({ loading: false, active: true, reInavteCode: this.state.invateCode, invateMan: res.list })   //按钮激活， loading结束
            this.show();   //用户信息下拉，
          } else {
            this.setState({ loading: false, active: false })
            toast("请使用有效邀请码")
          }
        })
        .catch(err => {
          this.setState({ loading: false, active: false })
          console.log(err)
        })
    } else {
      this.setState({ active: false });
      this.hide();
    }
  }

  goRegisterWidthInvateCode () {
    navigate("Register", { invateCode: this.state.reInavteCode })
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead
          title={"邀请码"}
          rightText={"跳过"}
          rightPressMethod={this.rightPressMethod}
        />
        <ScrollView contentContainerStyle={{ width: width, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View ref={(c) => this._inputContainer = c} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={"请输入邀请码或邀请人手机号"}
              onChangeText={(text) => this.changeText(text)}
              maxLength={11}
            />
          </View>
          <View style={[styles.invateMan, { height: this.state.height }]}>
            <Image style={styles.invateManHead} source={{ uri: this.state.invateMan.portrait }} />
            <View style={styles.invateManRight}>
              <Text style={{ fontSize: 16, color: '#000' }}>{this.state.invateMan.name}</Text>
              <Text style={{ fontSize: 13, color: '#999' }}>邀请您加入寻亲宝</Text>
            </View>
          </View>
          {
            this.state.active ?
              <TouchableOpacity onPress={() => this.goRegisterWidthInvateCode()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>使用邀请码</Text>
              </TouchableOpacity>
              :
              <View style={[styles.btnContent, { opacity: 0.72 }]}>
                {
                  this.state.loading ?
                    <LodingKit tintColor={"#fff"} />
                    :
                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>使用邀请码</Text>
                }
              </View>
          }
        </ScrollView>
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

  inputContainer: {
    width: width * 0.93,
    height: px2dp(42),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginTop: px2dp(12),
    marginBottom: px2dp(36)
  },

  input: {
    width: width * 0.93,
    height: px2dp(42),
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 0,
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(96)
  },

  invateMan: {
    width: width * 0.93,
    height: px2dp(72),
    backgroundColor: '#fff',
    borderRadius: px2dp(6),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: px2dp(12),
    overflow: 'hidden'
  },

  invateManHead: {
    width: px2dp(42),
    height: px2dp(42),
    borderRadius: px2dp(21)
  },

  invateManRight: {
    height: px2dp(42),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: px2dp(12)
  }
})