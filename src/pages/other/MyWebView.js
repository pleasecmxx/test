import React, { Component } from "react";
import {
  StyleSheet, Text, View, ProgressBarAndroid,
  TouchableOpacity, Image, ProgressViewIOS, StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { colors, size, isIos, width, px2dp, statusBarHeight } from './../../utils/base';
import { back } from "../../NavigationService";

export default class MyWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.route.params.url,    //网页的链接
      title: this.props.route.params.title,
      progress: 0.01,
      loading: true,
      show: true
    }
  }

  componentDidMount () {
    StatusBar.setBarStyle('dark-content')
    this.setState({ loading: false })
  }

  getProgress (e) {
    let progress = e.nativeEvent.progress;
    if (progress === 1) {
      this.setState({ show: false })
      return false
    }
    this.setState({ progress })
  }

  render () {
    return (
      <View style={styles.page}>
        <View style={[styles.normalHead, { position: 'relative' }]}>
          <TouchableOpacity
            onPress={() => back()}>
            <View style={styles.backContainer}>
              <Image source={require('./../../assets/close.png')} style={styles.backImg} />
            </View>
          </TouchableOpacity>
          <Text style={styles.normalHeadTitle}>{this.state.title || "标题"}</Text>
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
            <WebView
              source={{ uri: this.state.url }}
              style={styles.container}
              onLoadProgress={e => this.getProgress(e)}
            />
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
    backgroundColor: 'rgb(240,240,237)'
  },

  normalHead: {
    width: width,
    height: statusBarHeight + size.headHeight,
    paddingTop: statusBarHeight,
    backgroundColor: colors.bgColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
  },

  backContainer: {
    height: size.headHeight,
    justifyContent: 'center',
    alignItems: 'center',
    width: px2dp(40)
  },

  container: {
    width: width,
    flex: 1
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
    color: '#000',
    fontWeight: '400'
  },

  backImg: {
    height: px2dp(15),
    width: px2dp(15),
    tintColor: '#000',
  },
})