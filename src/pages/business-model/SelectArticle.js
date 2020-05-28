import React, { Component } from "react";
import {
  StyleSheet, Text, View, ProgressBarAndroid,
  TouchableOpacity, Image, ProgressViewIOS, StatusBar,
  DeviceEventEmitter
} from "react-native";
import { WebView } from "react-native-webview";
// import { StackActions } from 'react-navigation';
import { colors, size, isIos, width, px2dp, statusBarHeight } from '../../utils/base';
import { back, navigate, backUtils } from './../../NavigationService'

export default class SelectArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.route.params.url,    //网页的链接
      id: this.props.route.params.id,
      title: this.props.route.params.title,
      imgUrl: this.props.route.params.imgUrl,
      progress: 0.01,
      loading: true,
      show: true
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content')
    this.setState({ loading: false })
  }

  getProgress(e) {
    let progress = e.nativeEvent.progress;
    if (progress === 1) {
      this.setState({ show: false })
      return false
    }
    this.setState({ progress })
  }

  backToShow() {
    DeviceEventEmitter.emit('sendArticle', { aid: this.state.id, title: this.state.title, imgUrl: this.state.imgUrl })
    // const popAction = StackActions.pop({ n: 2 });
    // this.props.navigation.dispatch(popAction);
    backUtils(2)
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={[styles.normalHead, { position: 'relative' }]}>
          <TouchableOpacity onPress={() => back()} style={styles.backContainer}>
            <Image source={require('./../../assets/back-android.png')} style={styles.backImg} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.normalHeadTitle}>{this.props.route.params.title}</Text>
          <View style={styles.backContainer}></View>
          <View style={styles.barContainer}>
            {
              this.state.show ?
                <View>
                  {
                    isIos() ?
                      <ProgressViewIOS
                        progressTintColor={colors.themeColor}
                        trackTintColor={colors.opacityRed}
                        indeterminate={false}
                        progress={this.state.progress}
                        styleAttr={'Horizontal'}
                        style={{ width: width, height: 1.5, backgroundColor: '#fff' }}
                      />
                      :
                      <ProgressBarAndroid
                        color={colors.themeColor}
                        indeterminate={false}
                        progress={this.state.progress}
                        styleAttr={'Horizontal'}
                        style={{ width: width, height: 1.5, backgroundColor: '#fff' }}
                      />
                  }
                </View>
                :
                null
            }
          </View>
        </View>
        {
          !this.state.loading ?
            <>
              <WebView
                // source={{ uri: this.state.url }}
                source={{ uri: this.state.url , method: 'GET', headers: { 'Cache-Control':'no-cache'} }}
                style={styles.container}
                onLoadProgress={e => this.getProgress(e)}
              />
              <View style={styles.bottom}>
                <TouchableOpacity onPress={() => this.backToShow()} style={styles.bottomBtn}>
                  <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>选择此文章</Text>
                </TouchableOpacity>
              </View>
            </>
            :
            null
        }
      </View>
    );
  }
}



const styles = StyleSheet.create({
  page: {
    width: width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(240,240,237)',
    position: 'relative'
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

  backContainer: {
    width: width * 0.06 + px2dp(24),
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: width,
    flex: 1,
  },

  barContainer: {
    width: width,
    height: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center'
  },

  normalHeadTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '400',
    maxWidth: px2dp(200)
  },

  backImg: {
    height: px2dp(20),
    width: px2dp(20),
    tintColor: '#333',
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: px2dp(60),
    width: width,
    backgroundColor: colors.themeColor,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bottomBtn: {
    width: width,
    height: px2dp(60),
    justifyContent: 'center',
    alignItems: 'center'
  }
})