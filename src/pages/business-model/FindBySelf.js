import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native'
import NormalHead from './../../components/tool-kit/NormalHead'
import { width, px2dp, colors, toast } from '../../utils/base';
import { navigate } from '../../NavigationService';
import { Switch } from 'react-native-switch';
import HttpUtils from '../../utils/http';
import api from '../../utils/api';
import redux from './../../redux/store'
import ActionSheet from 'react-native-actionsheet'
import LoadingKit from './../../components/tool-kit/LoadingKit'
import ImagePicker from 'react-native-image-crop-picker'

export default class FindBySelf extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      show: false,   //是否开启自定义
      height: 0,
      sysData: {
        type: 1,   //自定义链接 红包 游戏
        type_id: 2,
        name: '',
        sid: '',  //所属文章（自定义连接）
      },
      title: '',    //标题
      imgUrl: '',   //图片
      img_base64: '', //自定义上传图片base64
      content: '',  //内容（自定义连接）
      targetLink: '', //自定义目标链接
      aid: null,
      token: state.token,
      loading: false,
      isAgree: false,    //是否同意用户协议？
      isSuccessful: false,
      disable: false,
      result: {},     //发布活动成功之后的结果
    }
  }

  componentDidMount() {
    this.selectArcticle = DeviceEventEmitter.addListener('sendArticle', (a) => this.getArticle(a));
    this.getIsAgree = DeviceEventEmitter.addListener('I_agree', (a) => this.setState({ isAgree: true }));
  }

  componentWillUnmount() {
    this.selectArcticle && this.selectArcticle.remove();
    this.getIsAgree && this.getIsAgree.remove();
  }

  changeLayout(value) {

  }

  getArticle(a) {
    console.log(a)
    let sysData = this.state.sysData;
    sysData.sid = a.aid;
    this.setState({ title: a.title, sysData, imgUrl: a.imgUrl, aid: a.aid })
  }

  changeName(text) {
    let sysData = this.state.sysData;
    sysData.name = text;
    this.setState({ sysData })
  }

  creatLocation() {
    if (this.state.isSuccessful) {
      navigate('SharePage', { lid: this.state.result.id, title: this.state.title, imgUrl: this.state.imgUrl, aid: this.state.aid, isSelf: false });
      return false;
    }
    if (this.state.show) {
      this.bySelf();
    } else {
      if (this.state.title === null || this.state.sysData.sid === '' || this.state.sysData.name === '') {
        toast("请先完善信息");
      } else {
        if (!this.state.isAgree) {
          navigate('Accept');
          return false
        }
        this.setState({ loading: true })
        let params = {
          type: this.state.sysData.type,
          type_id: this.state.sysData.type_id,
          name: this.state.sysData.name,
          sid: this.state.sysData.sid,
          custom_open: 0,
          token: this.state.token
        };
        HttpUtils.postRequrst(api.createLocation, params)
          .then(res => {
            console.log(res)
            if (res.code === 1) {
              this.setState({ loading: false, isSuccessful: true, result: res.list, disable: true })   //发布成功之后直接使用
              // toast("创建成功！")
              navigate('SharePage', { lid: res.list.id, title: this.state.title, imgUrl: this.state.imgUrl, aid: this.state.aid });
            } else {
              this.setState({ loading: false })
              toast(res.msg)
            }
          })
          .catch(err => {
            this.setState({ loading: false })
            toast("网络出错了，请稍后重试")
            console.log(err)
          })
      }
    }
  }

  bySelf() {
    if (this.state.isSuccessful) {
      navigate('SharePage', {
        lid: this.state.result.id,
        title: this.state.title,
        imgUrl: this.state.imgUrl,
        link: this.state.targetLink,
        aid: null,
        isSelf: true
      });
      return false
    }
    if (this.state.sysData.name === '') {
      return toast("请先输入昵称");
    };
    if (this.state.title === '') {
      return toast("请输入标题");
    };
    if (this.state.content === '') {
      return toast("请输入内容");
    };
    if (this.state.targetLink === '') {
      return toast("请输入目标链接");
    };
    if (this.state.img_base64 === '') {
      return toast("请选择图片")
    }
    this.setState({ loading: true })
    let params = {
      type: 1,
      type_id: 2,
      name: this.state.sysData.name,
      custom_open: 1,
      link_url: this.state.targetLink,
      title: this.state.title,
      content: this.state.content,
      picture: this.state.img_base64,
      token: this.state.token
    };
    HttpUtils.postRequrst(api.createLocation, params)
      .then(res => {
        console.log(res);
        this.setState({ loading: false })
        if (res.code === 1) {
          toast("发布成功");
          this.setState({ result: res.list })
          navigate('SharePage', {
            lid: res.list.id,
            title: this.state.title,
            imgUrl: res.list.img,
            lid: res.list.id,
            link: this.state.targetLink,
            isSelf: true
          });
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        console.log(err);
        toast("网络出错了，请稍后重试")
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
  getImage(img) {
    if (img && img.data) {
      console.log(img);
      let url = img.path;
      this.setState({ imgUrl: url, img_base64: 'data:image/jpeg;base64,' + img.data, });
    } else {
      toast("选取图片失败，请重试")
    }
  }

  render() {
    return (
      <View style={styles.page}>
        <NormalHead title={"分享定位"} />
        <KeyboardAvoidingView behavior={"height"}>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View style={[styles.row, { marginTop: px2dp(12) }]}>
              <Text style={styles.title}>定位昵称</Text>
              <TextInput
                placeholder={"请输入昵称，如老婆、同事..."}
                style={styles.input}
                onChangeText={(text) => this.changeName(text)}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>自定义链接</Text>
              <Switch
                onTintColor={'#000'}
                tintColor={'#aaaa11'}
                value={this.state.show}
                onValueChange={(value) => {
                  this.setState({ show: value });
                  this.changeLayout(value);
                }}
                circleSize={px2dp(24)}    //圆圈尺寸
                backgroundActive={colors.themeColor}   //激活时整体背景
                circleActiveColor={'#fff'}    //
                circleInActiveColor={'#fff'}
                circleBorderWidth={3}  //圆圈外径
                outsideCircleStyle={{ backgroundColor: 'red', borderColor: 'red' }}  //
                innerCircleStyle={{ borderColor: this.state.show ? colors.themeColor : '#ccc' }}  //
                backgroundInactive={"#ccc"}
              />
            </View>
            {
              !this.state.show ?
                <TouchableOpacity onPress={() => navigate('ArticleTabs')} style={styles.row}>
                  <Text numberOfLines={1} style={styles.title}>{this.state.title ? this.state.title : '系统文章'}</Text>
                  <Image style={{ width: px2dp(18), height: px2dp(18) }} source={require('./../../assets/enter.png')} />
                </TouchableOpacity>
                :
                <>
                  <View style={styles.bgRow}>
                    <Text style={styles.smallTitle}>链接：</Text>
                  </View>
                  <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                    <Text style={[styles.title, { color: '#4c4c4c' }]}>输入链接：</Text>
                    <TextInput
                      placeholder={"如https://www.baidu.com"}
                      placeholderTextColor={'#4c4c4c'}
                      onChangeText={(text) => this.setState({ targetLink: text })}
                      style={[styles.input, { textAlign: 'left' }]}
                    />
                  </View>
                  <View style={styles.bgRow}>
                    <Text style={styles.smallTitle}>自定义链接标题：</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={'请输入标题'}
                      style={styles.rowInput}
                      onChangeText={(text) => this.setState({ title: text })}
                    />
                  </View>
                  <View style={styles.bgRow}>
                    <Text style={styles.smallTitle}>自定义链接内容：</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={'请输入文本'}
                      style={styles.rowInput}
                      onChangeText={(text) => this.setState({ content: text })}
                    />
                  </View>
                  <View style={styles.bgRow}>
                    <Text style={styles.smallTitle}>上传图片：</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.ActionSheet.show()} style={styles.bigRow}>
                    {
                      this.state.imgUrl ?
                        <Image style={styles.selectImg} source={{ uri: this.state.imgUrl }} />
                        :
                        <View style={styles.selectImg}>
                          <Image style={styles.selectIcon} source={require('./../../assets/add.png')} />
                        </View>
                    }
                  </TouchableOpacity>
                </>
            }
            {
              this.state.loading ?
                <View style={styles.btnContainer}>
                  <LoadingKit />
                </View>
                :
                <TouchableOpacity onPress={() => this.creatLocation()} style={styles.btnContainer}>
                  <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>发布定位</Text>
                </TouchableOpacity>
            }
          </ScrollView>
        </KeyboardAvoidingView>
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
    color: '#4c4c4c',
    fontSize: 16,
    alignItems: 'center',
    paddingVertical: 0
  },

  inputRow: {
    width: width,
    height: px2dp(72),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.035,
    paddingVertical: px2dp(6)
  }
})