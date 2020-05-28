import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, TouchableOpacity, StatusBar, RefreshControl, DeviceEventEmitter } from 'react-native';
import { navigate, reset } from './../NavigationService';
import { size, statusBarHeight, px2dp, width, onePx, toast, colors } from '../utils/base';
import InnerSlider from './../components/slider/InnerSlider'
import LinearGradient from 'react-native-linear-gradient'
import Footer from './../components/tool-kit/Footer'
import HttpUtils from '../utils/http';
import api from './../utils/api'
import * as WeChat from 'react-native-wechat-lib';
import Store from './../utils/store';
import redux from './../redux/store'
import Loading from './../pages/other/Loading'
import MapItem from './../components/business-kit/MapItem'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import OptionLoading from './other/OptionLoading';
import XunQinItem from './../components/business-kit/XunQinItem'


export default class Home extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      resultList: [],
      slider: [],
      token: state.token,
      freshing: true,
      loading: false,
      pageLoading: true,
      optionLoading: false,
      lever: state.lever,
      xunqin: false
    };
    const changeListener = () => {
      const state = store.getState();
      this.setState({ token: state.token, lever: state.lever });
    };
    redux.subscribe(changeListener);
    this.isLogin = false;
    this.phoneVersion = 'apple';   //安卓固定型号，每个包写死  
    //字段：   huawei vivo oppo other   || 苹果不判断
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    WeChat.registerApp('wxaac4df0222052ed7', 'https://www.yunrongyao.com/')
      .then(res => {
        // alert(res)
      })
      .catch(err => {

      })
    this.dispatchUserMsg()
    this.getRefresh = DeviceEventEmitter.addListener('refresh', (a) => { this.getData() })  //系统刷新数据方法
    this.checkBusiness();
    this.getSliders();
    this.delayTask = setTimeout(() => {
      this.checkVesion();      //核对版本
      // this.getInTimeSplash();  //获取在时间段之内的启动页 || 实验功能
    }, 6000);  //6秒之后执行延时任务
  }

  dispatchUserMsg() {
    Store.getJsonObject('userMsg')
      .then(result => {
        redux.dispatch({ type: 'SET_USERMSG', msg: result })   //更新用户信息
      })
      .catch(err => {
        console.log(err)
      })
  }

  init() {
    // return false;
    try {
      let noLogin = this.props.route.params.noLogin;  //从登录页面进入，不登陆
      redux.dispatch({ type: 'SET_LEVER', lever: 1 });   //更新lever
      this.getData();
    }
    catch (e) {
      Store.getJsonObject('loginByPass')
        .then(res => {
          console.log(res)
          if (res.value) {
            this.loginByPass();
          } else {
            this.loginByToken();
          }
        })
        .catch(err => {
          this.loginByPass();
        })
    }
  }

  loginByPass() {
    Store.getJsonObject('userPass')
      .then(result => {
        HttpUtils.postRequrst(api.login, result)
          .then(res => {
            console.log(res);
            if (res.code == 1) {
              toast("登录成功")
              redux.dispatch({ type: 'SET_TOKEN', token: res.list.token });   //更新 token
              redux.dispatch({ type: 'SET_LEVER', lever: 1 });   //更新lever
              this.isLogin = true;
              this.getData();
            } else {
              toast(res.msg)
            }
          })
          .catch(err => {
            toast("网络出错了，请稍重试")
          })
      })
      .catch(err => {
        toast("未登录");
        redux.dispatch({ type: 'SET_LEVER', lever: 0 });   //更新lever
        this.setState({ loading: false, freshing: false, pageLoading: false })
      })
  }

  loginByToken() {
    // alert("通过token");
    Store.getJsonObject('userPass')
      .then(result => {
        console.log('token', result)
        HttpUtils.postRequrst(api.loginByToken, result)
          .then(res => {
            console.log(res);
            if (res.code == 1) {
              toast("登录成功")
              redux.dispatch({ type: 'SET_TOKEN', token: res.list.token });   //更新 token
              redux.dispatch({ type: 'SET_LEVER', lever: 1 });   //更新lever
              this.isLogin = true;
              this.getData();
            } else {
              toast("账号已过期，请重新登录");
              reset('Login', { isBack: false })
            }
          })
          .catch(err => {
            toast("网络出错了，请稍重试")
          })
      })
      .catch(err => {
        toast("未登录");
        redux.dispatch({ type: 'SET_LEVER', lever: 0 });   //更新lever
        this.setState({ loading: false, freshing: false, pageLoading: false });
      })
  }

  componentWillUnmount() {
    // this.viewDidAppear.remove();
    this.getRefresh.remove();
    this.delayTask && clearTimeout(this.delayTask);
  }

  getSliders() {
    HttpUtils.postRequrst(api.sliders, {})
      .then(res => {
        console.log('轮播图', res);
      })
      .catch(err => {
        toast("网络出错了，请稍后重试");
      })
  }

  jumpQQ() {
    this.setState({ optionLoading: true });
    HttpUtils.postRequrst(api.serviceAccout, {})
      .then(res => {
        this.setState({ optionLoading: false })
        if (res.code === 1) {
          let url = 'mqqwpa://im/chat?chat_type=wpa&uin='
          url += res.list.contact_qq;
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            } else {
              toast("很抱歉，无法打开QQ");
            }
          })
        } else {
          toast(res.msg);
          this.setState({ optionLoading: false })
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试");
        this.setState({ optionLoading: false })
      })
  }

  jumpResult() {
    if (this.state.lever === 0) {
      navigate('Login', { isBack: true });
      return false
    };
    if (this.state.xunqin) {
      navigate('AllList', { isSelf: true })
    } else {
      navigate('ResultList')
    }
  }

  getData() {
    if (this.state.loading) {
      console.log("加载等待中")
      return false
    }
    this.setState({ loading: true })
    let params = {
      token: this.state.token
    }
    let url;
    if (this.state.xunqin) {
      url = api.xunqinList;
      params.type = 1
    } else {
      url = api.resultList
    }
    HttpUtils.postRequrst(url, params)
      .then(res => {
        console.log(res);
        if (res.code === 1) {
          this.setState({ resultList: res.list, loading: false, freshing: false, pageLoading: false });
        } else {
          toast(res.msg);
          this.setState({ loading: false, freshing: false, pageLoading: false });
        };
      })
      .catch(e => {
        toast("网络出错了，请稍后重试");
      })
  }

  checkBusiness() {
    // this.init()
    // this.initXunqin();
    HttpUtils.postRequrst(api.show, {})
      .then(res => {
        console.log('开关', res);
        if (res.code === 1) {
          res.list.forEach(ele => {
            if (ele.key == this.phoneVersion) {   //找到目前安装包对应的配置
              if (ele.val === 1) {
                // alert("当前版本开启开关")
                console.log("上架" + this.phoneVersion + '开启');
                alert("已启用");
                this.setState({ xunqin: false })
                // redux.dispatch('SET_SHOW', { show: true })
                redux.dispatch('SET_SHOW', { show: false })
                this.initXunqin();
              } else {
                console.log("当前版本未开启")
                // alert("未启用")
                this.setState({ xunqin: false })
                redux.dispatch('SET_SHOW', { show: false })
                this.init()
              }
            }
          });
        } else {  //接口崩溃
          toast('检查版本出错');
          this.initXunqin();
          // this.init();
        }
      })
      .catch(err => {  //本地崩溃
        console.log(err);
        toast("网络出错了，请稍后重试");
        this.init();
      })
  }

  initXunqin() {
    this.setState({ xunqin: true });
    // redux.dispatch({ type: 'SET_SHOW', show: false });   //将寻亲业务关闭
    try {
      let noLogin = this.props.route.params.noLogin;  //从登录页面进入，不登陆
      redux.dispatch({ type: 'SET_LEVER', lever: 1 });   //更新lever
      this.getData();
    }
    catch (e) {
      Store.getJsonObject('loginByPass')
        .then(res => {
          console.log(res)
          // this.loginByToken()
          if (res.value) {
            this.loginByPass();
          } else {
            this.loginByToken();
          }
        })
        .catch(err => {
          this.loginByPass();
        })
    }
  }

  jumpDetails(item) {
    if (item.result_number === 0) {
      toast("该寻亲链接暂无结果")
      return false;
    }
    navigate("MyMapView", { id: item.id, title: item.name })
  }

  goToSelect() {
    if (this.state.lever === 0) {
      navigate('Login', { isBack: true });
      return false
    }
    if (this.state.xunqin) {
      navigate('XunQinPage');
    } else {
      navigate('SelectMethod')
    }
  }

  checkVesion() {  //check版本
  }

  reShare(item) {
    this.setState({ optionLoading: true });
    let params = {
      token: this.state.token,
    };
    let url;
    if (this.state.xunqin) {
      url = api.xunqinShare;
      params.luid = item.id;
    } else {
      url = api.getShareMsg;
      params.lid = item.id;
    }
    HttpUtils.postRequrst(url, params)
      .then(res => {
        console.log(res)
        this.setState({ optionLoading: false })
        if (res.code === 1) {
          // let isSelf = false;
          // if (res.list.custom_open === 1) {
          //   isSelf = true;
          // }
          // navigate('SharePage', {
          //   id: res.list.id,  //location ID
          //   title: res.list.title,
          //   imgUrl: res.list.portrait,
          //   isSelf: isSelf,
          // })
        } else {
          toast(res.msg);
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试");
        this.setState({ optionLoading: false })
      })
  }

  goToAllList() {
    navigate('AllList', { isSelf: false })
  }

  render_header() {
    return (
      <View>
        <InnerSlider />
        <View style={styles.toolContainer}>
          <TouchableOpacity onPress={() => this.goToSelect()}>
            <LinearGradient
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
              colors={['#A3C4FF', '#5988FF']}
              style={styles.toolBox}>
              <Image style={styles.icon} source={require('./../assets/find-man.png')} />
              <Text style={{ color: '#fff', fontSize: 18 }}>我要寻亲</Text>
            </LinearGradient>
          </TouchableOpacity>
          {
            this.state.xunqin ?
              <TouchableOpacity onPress={() => this.goToAllList()}>
                <LinearGradient
                  start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                  colors={['#A3A7FF', '#7081FF']}
                  style={styles.toolBox}>
                  <Image style={{ height: 20, width: 20, marginRight: 4 }} source={require('./../assets/find_lover.png')} />
                  <Text style={{ color: '#fff', fontSize: 18 }}>全部寻亲</Text>
                </LinearGradient>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => this.jumpQQ()}>
                <LinearGradient
                  start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                  colors={['#A3A7FF', '#7081FF']}
                  style={styles.toolBox}>
                  <Image style={{ height: 20, width: 20, marginRight: 4 }} source={require('./../assets/sevice.png')} />
                  <Text style={{ color: '#fff', fontSize: 18 }}>联系客服{this.state.xunqin + ''}</Text>
                </LinearGradient>
              </TouchableOpacity>
          }
        </View>
        <View style={styles.titleRow}>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>寻亲结果</Text>
          {
            this.state.lever === 1 || this.state.resultList.length > 0 ?
              <TouchableOpacity onPress={() => this.jumpResult()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#999' }}>查看更多</Text>
                <Image style={styles.rightAngle} source={require('./../assets/enter.png')} />
              </TouchableOpacity>
              :
              null
          }
        </View>
      </View>
    )
  }

  render_item({ item, index }) {
    if (this.state.xunqin) {
      return (
        <XunQinItem item={item} />
      )
    } else {
      return (
        <MapItem item={item} />
      )
    }
  }

  render_footer() {
    if (this.state.resultList.length > 3) {
      return <Footer title={"更多结果不作展示"} />
    } else {
      return null
    }
  }

  render_empty() {
    if (this.state.freshing && this.state.resultList.length === 0) {
      return null
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode={'contain'} style={styles.noResult} source={require('./../assets/no-result.png')} />
          <Text style={{ marginTop: px2dp(-42), fontSize: 12, color: '#999' }}>暂无寻亲结果，快去创建寻亲计划吧</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headTitle}>寻亲宝</Text>
        </View>
        {
          this.state.pageLoading ?
            <Loading />
            :
            <SwipeListView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.freshing}
                  colors={[colors.themeColor]}
                  progressViewOffset={px2dp(24)}
                  progressBackgroundColor={"#ffffff"}
                  onRefresh={() => {
                    if (this.state.lever === 0) {
                      return false;
                    }
                    this.setState({ freshing: true })
                    this.getData()
                  }}
                />
              }
              data={this.state.resultList}
              // bounces={false}
              ListHeaderComponent={this.render_header()}
              contentContainerStyle={{ width: '100%', alignItems: 'center' }}
              ListEmptyComponent={this.render_empty.bind(this)}
              ListFooterComponent={this.render_footer.bind(this)}
              renderItem={(data, rowMap) => (
                <SwipeRow
                  rightOpenValue={px2dp(-96)}
                  disableRightSwipe     //禁止右滑
                  closeOnScroll         //当滚动listview时，关闭打开的行
                  closeOnRowBeginSwipe
                  closeOnRowPress
                >
                  <View style={styles.rowBack}>
                    <TouchableOpacity
                      style={styles.rowBtn}
                      onPress={() => this.reShare(data.item)}
                    >
                      <Text style={styles.btnText}>再次分享</Text>
                    </TouchableOpacity>
                  </View>
                  {
                    this.state.xunqin ?
                      <XunQinItem item={data.item} />
                      :
                      <MapItem item={data.item} />
                  }
                </SwipeRow>
              )}
              leftOpenValue={0}
              rightOpenValue={px2dp(-96)}
              keyExtractor={(data, index) => index.toString()}
            />
        }
        {
          this.state.optionLoading ?
            <OptionLoading />
            :
            null
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    position: 'relative',
    flex: 1,
    width: '100%',
    backgroundColor: '#f6f6f6',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  header: {
    width: "100%",
    height: size.headHeight + statusBarHeight,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: statusBarHeight,
    borderBottomColor: '#eee',
    borderBottomWidth: onePx
  },

  headTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700'
  },

  toolContainer: {
    width: width,
    height: px2dp(96),
    backgroundColor: '#F6F6F6',
    marginTop: px2dp(16),
    // zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03
    // paddingHorizontal: 4
  },

  toolBox: {
    width: width * 0.47 - px2dp(6),
    height: px2dp(96),
    // backgroundColor: 'red',
    borderRadius: px2dp(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  icon: {
    height: 18,
    width: 18,
    marginRight: 4,
    marginBottom: -2
  },

  titleRow: {
    width: width,
    height: px2dp(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03
  },

  rightAngle: {
    width: 12,
    height: 12,
    tintColor: '#999'
  },

  item: {
    width: px2dp(352),
    height: px2dp(88),
    backgroundColor: '#fff',
    borderRadius: px2dp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(10),
    marginBottom: px2dp(12)
  },

  itemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  itemLogo: {
    width: px2dp(60),
    height: px2dp(60),
    borderRadius: px2dp(4)
  },

  itemCenter: {
    height: px2dp(40),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: width * 0.40,
    paddingLeft: px2dp(10),
    // backgroundColor: '#f2f2f2'
  },

  itemRight: {
    maxWidth: width * 0.3,
    // backgroundColor: 'tomato',
    justifyContent: 'flex-end'
  },

  resultText: {
    fontSize: 16,
    color: '#ff0000'
  },

  noResult: {
    width: px2dp(120),
    height: px2dp(120),
    marginVertical: px2dp(60)
  },

  rowBack: {
    width: px2dp(352),
    height: px2dp(88),
    borderRadius: px2dp(8),
    backgroundColor: colors.themeColor,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    // opacity: 0.72
  },

  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },

  rowBtn: {
    width: px2dp(96),
    height: px2dp(88),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeColor,
  }
})