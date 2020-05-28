import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, Keyboard } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from '../../utils/base';
// import { StackActions } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker'
import NormalHead from '../../components/tool-kit/NormalHead';
import ActionSheet from 'react-native-actionsheet'
import redux from './../../redux/store'
import api from './../../utils/api'
import LoadingKit from './../../components/tool-kit/LoadingKit'
import HttpUtils from '../../utils/http';
import { back, backUtils } from '../../NavigationService';

export default class TakeCash extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      token: state.token,
      msg: state.msg,
      isAlipay: true,   //默认为支付宝
      number: 0,
      account: '',      //到账支付宝
      realName: '',     //支付宝真实姓名
      wx_pic_base64: null,//收款码64位数据
      wx_pic_url: null,   //微信收款码图片路径
      loading: false,   //操作加载
    }
  }

  _onNumberChange (text) {
    this.setState({ number: text })
  }

  getPost () {
    if (this.state.isAlipay) {
      if (this.state.number === 0) {
        toast("请输入提现金额");
        return false;
      };
      if (this.state.account === '') {
        toast("请输入支付宝账号");
        return false;
      };
      if (this.state.realName === '') {
        toast("请输入支付宝账户真实姓名");
        return false
      };
      this.alipayPost();
    } else {
      if (this.state.number === 0) {
        toast("请输入提现金额");
        return false;
      };
      if (this.state.realName === '') {
        toast("请输入支付宝账户真实姓名");
        return false
      };
      if (this.state.wx_pic_base64 === '') {
        toast("请上传微信收款二维码");
        return false;
      };
      if(this.state.number < 50){
        toast("最低支持提现50元");
        return false;
      }
      this.wxPayPost();
    }
  }

  alipayPost () {
    if (this.state.loading) {
      return false;    //节流
    };
    this.setState({ loading: true })
    let params = {
      type: 1,
      token: this.state.token,
      money: this.state.number,         //提走金额
      true_name: this.state.realName,   //真实姓名、
      account_number: this.state.account,    //支付宝账号
    };
    HttpUtils.postRequrst(api.getCash, params)
      .then(res => {
        this.setState({ loading: false });
        if (res.code === 1) {
          toast("提现申请成功！");
          this.backByPop()
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        toast("网络出错了，请稍后重试！")
      })
  }

  wxPayPost () {
    if (this.state.loading) {
      return false;    //节流
    };
    this.setState({ loading: true })
    let params = {
      type: 2,
      money: this.state.number,
      true_name: this.state.realName,
      account_number: this.state.wx_pic_base64,
      token: this.state.token,
    };
    HttpUtils.postRequrst(api.getCash, params)
      .then(res => {
        this.setState({ loading: false });
        if (res.code === 1) {
          toast("提现申请成功！");
          this.backByPop()
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        toast("网络出错了，请稍后重试！")
      })
  }

  /**
   * data: base64,
   * path: url 图片本机绝对路径
   * cropRect:  //尺寸位置信息
   *  height: 6016  (px)
   *  width: 2775
   *  x: 0
   *  y: 0
   * size: 133244
   * width: 295 (dp)
   * height: 640
   * @param {*} img 
   */
  getImage (img) {
    console.log(img);
    let url = { uri: img.path }
    this.setState({ wx_pic_url: url, wx_pic_base64: 'data:image/jpeg;base64,' + img.data })
  }

  backByPop () {
    // const popAction = StackActions.pop({ n: 2 });
    // this.props.navigation.dispatch(popAction);
    backUtils(2)
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"申请提现"} />
        <ScrollView contentContainerStyle={{ width: width, flex: 1, alignItems: 'center' }}>
          <View style={styles.bannerContainer}>
            <Image resizeMode={'contain'} style={styles.banner} source={require('./../../assets/cash-banner.png')} />
            <View style={styles.bannerContent}>
              <Text style={{ fontSize: 25, color: '#FDDEAE', marginLeft: -6 }}><Text style={{ fontSize: 18 }}>￥</Text>{this.state.msg.balance}</Text>
              <Text style={{ fontSize: 12, color: '#FDDEAE', marginTop: 6 }}>我的余额</Text>
            </View>
          </View>
          <Text style={styles.smallText}>佣金提现</Text>
          <View style={styles.toolContainer}>
            <View style={styles.toolLine}>
              <Text style={styles.toolTitle}>提现金额</Text>
              <TextInput
                style={styles.input}
                placeholder={"最低提现金额为50元"}
                keyboardType={'numeric'}
                onChangeText={(text) => this.setState({ number: text })}
              />
            </View>
            <View style={styles.toolLine}>
              <Text style={styles.toolTitle}>收款方式</Text>
              <TouchableOpacity onPress={() => this.ActionSheet.show()} style={styles.toolLineRight}>
                <Text style={styles.toolTitle}>{this.state.isAlipay ? '支付宝转账' : '微信二维码收款'}</Text>
                <Image source={require('./../../assets/enter.png')} style={{ width: px2dp(12), height: px2dp(12), tintColor: '#000' }} />
              </TouchableOpacity>
            </View>
            {
              this.state.isAlipay ?
                <View style={styles.toolLine}>
                  <Text style={styles.toolTitle}>到账支付宝</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={"请输入到账支付宝账号"}
                    onChangeText={(text) => this.setState({ account: text })}
                  />
                </View>
                :
                <View style={styles.toolLine}>
                  <Text style={styles.toolTitle}>真实姓名</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={"请输入微信收款真实姓名"}
                    keyboardType={'numeric'}
                    onChangeText={(text) => this.setState({ realName: text })}
                  />
                </View>
            }
            {
              this.state.isAlipay ?
                <View style={styles.toolLine}>
                  <Text style={styles.toolTitle}>真实姓名</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={"请输入支付宝账号真实姓名"}
                    onChangeText={(text) => this.setState({ realName: text })}
                  />
                </View>
                :
                <View style={[styles.toolLine, styles.codeLine]}>
                  <Text style={styles.toolTitle}>收款二维码</Text>
                  <View style={styles.toolLineRight}>
                    {
                      this.state.wx_pic_url ?
                        <TouchableOpacity onPress={() => this.ActionSheet1.show()} style={styles.imgBox}>
                          <Image style={[styles.imgBox, { borderWidth: 0 }]} source={this.state.wx_pic_url} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.ActionSheet1.show()} style={styles.imgBox}>
                          <Image style={styles.addIcon} source={require('./../../assets/add-icon.png')} />
                        </TouchableOpacity>
                    }
                  </View>
                </View>
            }
          </View>
          {
            Number(this.state.msg.balance) > 0 && Number(this.state.msg.balance) >= this.state.number ?
              <TouchableOpacity onPress={() => this.getPost()} style={styles.btnContent}>
                {
                  this.state.loading ?
                    <LoadingKit />
                    :
                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>申请提现</Text>
                }
              </TouchableOpacity>
              :
              <View style={[styles.btnContent, { opacity: 0.72 }]}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>余额不足</Text>
              </View>
          }
        </ScrollView>
        <ActionSheet
          ref={(c) => this.ActionSheet = c}
          title={'请选择收款方式'}
          options={['支付宝支付', '微信支付', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index == 0) {
              this.setState({ isAlipay: true })
            }
            if (index == 1) {
              this.setState({ isAlipay: false })
            }
          }}
        />
        <ActionSheet
          ref={(c) => this.ActionSheet1 = c}
          title={'请选择上传方式'}
          options={['打开相机', '从相册选择', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index == 0) {
              ImagePicker.openCamera({
                includeExif: true,
                multiple: false,
                waitAnimationEnd: false,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 640,
                mediaType: 'photo',
                includeBase64: true,
              }).then(images => {
                if (images) {
                  this.getImage(images)
                }
              }).catch(e => {
                console.log('取消', e);
              });
            } else if (index == 1) {
              ImagePicker.openPicker({
                multiple: false,
                waitAnimationEnd: false,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 640,
                includeBase64: true,
              })
                .then(images => {
                  if (images) {
                    this.getImage(images)
                  }
                })
                .catch(e => {
                  console.log("取消选择", e);
                });
            }
          }}
        />
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

  banner: {
    width: width * 0.93,
    height: width * 402 / 1420 * 0.93,
    marginTop: px2dp(16),
    borderRadius: px2dp(6)
  },

  bannerContainer: {
    position: 'relative',
  },

  bannerContent: {
    position: 'absolute',
    top: px2dp(16),
    left: 0,
    width: width * 0.93,
    height: width * 402 / 1420 * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolContainer: {
    width: width * 0.93,
    backgroundColor: '#fff',
    borderRadius: px2dp(4),
    alignItems: 'center'
  },

  toolLine: {
    width: width * 0.93 - px2dp(20),
    height: px2dp(60),
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center'
  },

  toolTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000'
  },

  toolLineRight: {
    width: width * 0.93 - px2dp(120),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  input: {
    fontSize: 15,
    color: '#000',
    width: width * 0.93 - px2dp(120),
    textAlign: 'left',
    paddingHorizontal: 0,
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginTop: px2dp(48)
  },

  codeLine: {
    paddingVertical: px2dp(12),
    alignItems: 'flex-start',
    height: px2dp(96)
  },

  imgBox: {
    width: px2dp(60),
    height: px2dp(60),
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dotted'
  },

  smallText: {
    width: width * 0.93,
    fontSize: 14,
    color: '#999',
    marginTop: px2dp(24),
    marginBottom: px2dp(6),
    textAlign: 'left',
    marginLeft: 2
  },

  addIcon: {
    width: px2dp(32),
    height: px2dp(32),
    // tintColor: '#ccc'
  }
})