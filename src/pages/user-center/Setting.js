import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate, reset } from '../../NavigationService';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import LoadingKit from './../../components/tool-kit/LoadingKit'
import redux from './../../redux/store'
import HttpUtils from './../../utils/http'
import api from './../../utils/api'
import Store from '../../utils/store';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      msg: this.props.route.params.msg,
      pic_url: '',
      pic_base64: '',
      hisChanged: false,  //头像是否成功更改 ？
      token: state.token
    }
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
    if (img && img.data) {
      console.log(img);
      let url = { uri: img.path };
      this.setState({ pic_url: url, pic_base64: img.data, loading: true });
      let params = {
        token: this.state.token,
        portrait: 'data:image/jpeg;base64,' + img.data,
      };
      HttpUtils.postRequrst(api.editMsg, params)
        .then(res => {
          if (res.code === 1) {
            toast("修改成功");
            this.setState({ loading: false, hisChanged: true })
          } else {
            this.setState({ loading: false });
            toast(res.msg);
          }
        })
        .catch(err => {
          toast("网络出错了，请稍后重试");
        })
    } else {
      toast("选取图片失败，请重试")
    }
  }

  loginOut () {
    Alert.alert('温馨提醒', '确定退出登录吗?', [
      { text: '取消', onPress: () => { } },
      { text: '确定', onPress: () => this.confimOut() }
    ])
  }

  confimOut () {
    Store.remove('userPass')    //清除用户账号密码记录
    Store.remove('userMsg')     //清除用户详细信息
    redux.dispatch({ type: 'CLEAR_LEVER' });  //清除lever
    redux.dispatch({ type: 'CLEAR_TOKEN' });  //清除token
    redux.dispatch({ type: 'CLEAR_USERMSG' });  //清除msg
    reset('Login', { isBack: false })
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"设置"} />
        <ScrollView contentContainerStyle={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={styles.userShow}>
            <TouchableOpacity onPress={() => this.ActionSheet.show()} style={styles.imgContainer}>
              {
                this.state.loading ?
                  <View style={styles.overlay}>
                    <LoadingKit />
                  </View>
                  :
                  null
              }
              {
                this.state.hisChanged ?
                  <Image style={styles.userImg} source={this.state.pic_url} />
                  :
                  <Image style={styles.userImg} source={{ uri: this.state.msg.portrait }} />
              }
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text onPress={() => navigate('SetUserName')}  style={styles.userName}>{this.state.msg.name}</Text>
              {
                this.state.msg.type == 1 ?
                  <Image resizeMode={'contain'} style={styles.icon} source={require('./../../assets/vip_icon.png')} />
                  :
                  null
              }
            </View>
          </View>
          <TouchableOpacity onPress={() => this.ActionSheet.show()} style={styles.row}>
            <Text style={styles.rowTitle}>头像</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowDec}>修改</Text>
              <Image style={styles.rightIcon} source={require('./../../assets/enter.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('SetUserName')} style={styles.row}>
            <Text style={styles.rowTitle}>昵称</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowDec}>修改</Text>
              <Image style={styles.rightIcon} source={require('./../../assets/enter.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('ChangePass')} style={styles.row}>
            <Text style={styles.rowTitle}>修改密码</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowDec}>修改</Text>
              <Image style={styles.rightIcon} source={require('./../../assets/enter.png')} />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={() => this.loginOut()} style={styles.btnContent}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>退出登录</Text>
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={(c) => this.ActionSheet = c}
          title={'请选择图片'}
          options={['照相机拍摄', '从相册选择', '取消']}
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
    alignItems: 'center',
    position: 'relative'
  },

  userShow: {
    width: width * 0.94,
    height: px2dp(96),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: px2dp(28),
    backgroundColor: '#fff',
    marginVertical: px2dp(18),
    borderRadius: px2dp(4)
  },

  userName: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700'
  },

  userImg: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(30),
    marginRight: px2dp(20)
  },

  icon: {
    width: px2dp(16),
    height: px2dp(16),
    marginLeft: 4,
    marginTop: 2
  },

  row: {
    width: width,
    height: px2dp(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.035,
  },

  rowTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500'
  },

  rowRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  rowDec: {
    fontSize: 14,
    color: '#999',
    marginRight: px2dp(6)
  },

  rightIcon: {
    width: px2dp(14),
    height: px2dp(14),
    tintColor: '#999'
  },

  btnContainer: {
    position: 'absolute',
    bottom: px2dp(88),
    left: 0,
    width: width,
    justifyContent: 'center',
    alignItems: "center"
  },

  btnContent: {
    backgroundColor: colors.themeColor,
    height: px2dp(49),
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(6),
    marginVertical: px2dp(36)
  },

  imgContainer: {
    position: 'relative',
    overflow: 'hidden'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(30),
    marginRight: px2dp(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
})  