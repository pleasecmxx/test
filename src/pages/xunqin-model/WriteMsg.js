import React, { Component } from 'react'
import { View, Text, Image, Keyboard, TextInput, TouchableOpacity, NativeModules, Animated, LayoutAnimation, ScrollView, KeyboardAvoidingView, Easing, StyleSheet } from 'react-native'
import { px2dp, width, colors, size, statusBarHeight, onePx, toast } from './../../utils/base'
import ImagePicker from 'react-native-image-crop-picker'
import redux from './../../redux/store'
import { back, backUtils } from '../../NavigationService';
import HttpUtils from '../../utils/http'
import api from '../../utils/api'
import LoadingKit from './../../components/tool-kit/LoadingKit'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class WriteMsg extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState()
    this.state = {
      ok: false,
      msg: state.msg,
      token: state.token,
      name: this.props.route.params.name,
      title: this.props.route.params.title,
      loading: false,
      contentList: [{ type: 2, val: "" }],   //内容列表 type = 2 文字 type = 1 图片
    }
  }

  // componentDidMount () {
  //   this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
  //   this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  // }

  // componentWillUnmount () {
  //   this.keyboardDidShowListener.remove();
  //   this.keyboardDidHideListener.remove();
  // }

  // _keyboardDidShow (e) {
  //   // this.setState({ showTool: true })
  // }

  // _keyboardDidHide (e) {
  //   // this.setState({ showTool: false })
  // }

  done () {
    this.setState({ loading: true });
    let list = this.state.contentList;
    let logo;
    for (let i = 0; i < list.length; i++) {
      if (list[i].type === 1) {
        logo = list[i].val;
        break;
      } else if (i === list.length - 1 && list[i].type != 1) {
        toast("请至少上传一张图片")
      };
    };
    let params = {
      token: this.state.token,
      logo: logo,
      title: this.state.title,
      content: list
    }
    HttpUtils.postRequrst(api.uploaderArticle, params)
      .then(res => {
        if (res.code === 1) {
          toast("发布成功");
          backUtils(2);
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  //拍照
  _openCamera () {
    Keyboard.dismiss()
    ImagePicker.openCamera({
      includeExif: true,
      multiple: false,
      waitAnimationEnd: false,
      cropping: true,
      compressImageMaxWidth: 1080,
      compressImageMaxHeight: 1920,
      mediaType: 'photo',
      includeBase64: true,
    }).then(images => {
      if (images) {
        this.setImgToContent(images)
      }
    }).catch(e => {
      console.log('取消', e);
    });
  }

  // 选择图片
  _openPicker () {
    Keyboard.dismiss()
    ImagePicker.openPicker({
      multiple: false,
      waitAnimationEnd: false,
      cropping: true,
      compressImageMaxWidth: 1080,
      compressImageMaxHeight: 1920,
      includeBase64: true,
    })
      .then(images => {
        if (images) {
          this.setImgToContent(images)
        }
      })
      .catch(e => {
        console.log("取消选择", e);
      });
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
* @param {*} images 
*/
  setImgToContent (images) {
    let img = {
      type: 1,
      val: 'data:image/jpeg;base64,' + images.data,
      path: images.path,
      size: images.height / images.width
    };
    let { contentList } = this.state;
    contentList.push(img);
    let len = contentList.length;
    if (contentList[len - 2].type === 2 && contentList[len - 2].val.replace(/(^\s*)|(\s*$)/g, '') === '') {
      contentList.splice(len - 2, 1);
    };
    let input = {
      type: 2,
      val: '    '
    }
    contentList.push(input);
    this.setState({ contentList });
    if (contentList.length > 1) {
      this.setState({ ok: true })
    }
  }

  render_item (item, index) {
    switch (item.type) {
      case 1:
        return <Image style={[styles.img, { height: px2dp(352 * item.size) }]} source={{ uri: item.path }} />
      case 2:
        return <TextInput
          placeholder={index === 0 ? "请提供尽可能详细的寻亲信息，并至少上传一张图" : null}
          ref={c => { this['input' + index] = c }}
          onChangeText={(text) => {
            let contentList = this.state.contentList;
            contentList[index].val = text;
            this.setState({ contentList })
          }}
          multiline={true}
          style={styles.input}
          value={item.val}
        />
      default:
        return null;
    }
  }

  render () {
    return (
      <View style={{ width: '100%', flex: 1, position: 'relative' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => back()} style={styles.sideContent}>
            <Image style={styles.backIcon} source={require('./../../assets/back-android.png')} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>编写寻亲文章</Text>
            <Text style={{ fontSize: 12, color: "#333" }}>{this.state.msg.name}</Text>
          </View>
          <View style={[styles.sideContent, { alignItems: 'flex-end' }]}>
            {
              this.state.ok ?
                <TouchableOpacity style={styles.fabuBtn} onPress={() => this.done()}>
                  {
                    this.state.loading ?
                      <LoadingKit />
                      :
                      <Text style={{ fontSize: 14, color: '#fff' }}>发布</Text>
                  }
                </TouchableOpacity>
                :
                <View style={[styles.fabuBtn, { opacity: 0.72 }]}>
                  <Text style={{ fontSize: 14, color: '#fff' }}>发布</Text>
                </View>
            }
          </View>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <KeyboardAvoidingView behavior="padding" enabled>
            {this.state.contentList.map((item, index) => this.render_item(item, index))}
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={styles.bottomLine}>
          <TouchableOpacity onPress={() => this._openCamera()} style={styles.bottomBtn}>
            <Image resizeMode={'contain'} style={styles.icon1} source={require('./../../assets/zhaoxiangji.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._openPicker()} style={styles.bottomBtn}>
            <Image resizeMode={'contain'} style={styles.icon2} source={require('./../../assets/xiangce.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: statusBarHeight + px2dp(50),
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(12),
    backgroundColor: '#f2f2f2'
  },

  sideContent: {
    width: px2dp(80),
    height: px2dp(50),
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: 'red'
  },

  content: {
    width: width,
    flex: 1,
    paddingBottom: px2dp(52)
  },

  backIcon: {
    height: px2dp(20),
    width: px2dp(20),
    tintColor: '#000',
  },

  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: px2dp(6),
    paddingBottom: px2dp(52)
  },

  input: {
    width: px2dp(352),
    paddingVertical: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: 14,
    color: '#000',
    lineHeight: 22,
    marginVertical: px2dp(4),
    flexWrap: 'wrap',
  },

  fabuBtn: {
    width: px2dp(52),
    height: px2dp(26),
    backgroundColor: colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(4)
  },

  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: px2dp(42),
    backgroundColor: '#f2f2f2',
    zIndex: 999,
    borderTopColor: '#ccc',
    borderTopColor: onePx,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: px2dp(12),
    marginBottom: px2dp(44)
  },

  icon1: {
    width: px2dp(24),
    height: px2dp(24),
    tintColor: '#999',
  },

  icon2: {
    width: px2dp(22),
    height: px2dp(24),
    tintColor: '#999',
    marginTop: 1
  },

  bottomBtn: {
    height: px2dp(40),
    paddingHorizontal: px2dp(24),
    justifyContent: 'center',
    alignItems: 'center'
  },

  img: {
    width: px2dp(352),
    marginVertical: px2dp(4),
    borderColor: '#f2f2f2',
    borderWidth: onePx
  }
}) 