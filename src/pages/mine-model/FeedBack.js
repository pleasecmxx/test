import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, Keyboard } from 'react-native'
import { size, statusBarHeight, px2dp, width, onePx, colors, toast } from '../../utils/base';
import { navigate, back } from '../../NavigationService';
import NormalHead from '../../components/tool-kit/NormalHead';
import LoadingKit from './../../components/tool-kit/LoadingKit'
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from '../../utils/api';


export default class FeedBack extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      height: 0,
      value: '',
      token: state.token,
      loading: false,
    }
  }

  _onContentSizeChange (event) {
    console.log(event.nativeEvent.contentSize.height)
    if (event.nativeEvent.contentSize.height <= 200) {
      this.setState({
        height: event.nativeEvent.contentSize.height,
      });
    } else {
      return false;
    }
  }

  insertValue (text) {
    let value = text.slice(0, 300);
    this.setState({ value });
  }

  post () {
    this.setState({ loading: true });
    let params = {
      token: this.state.token,
      content: this.state.value
    };
    HttpUtils.postRequrst(api.feedback, params)
      .then(res => {
        if (res.code === 1) {
          toast("您的反馈已受理，我们会及时改进");
          back();
        } else {
          toast(res.msg)
        }
      })
      .catch(err => {
        toast("网络出错了， 请稍后重试")
      })
  }

  render () {
    return (
      <View style={styles.page}>
        <NormalHead title={"投诉建议"} />
        <ScrollView contentContainerStyle={{ width: width, alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: width * 0.93, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.title}>投诉/建议：</Text>
            </View>
            <View style={styles.feedbackInputBox}>
              <TextInput
                style={[styles.feedbackInput, { height: Math.max(32, this.state.height), overflow: 'scroll' }]}
                multiline
                placeholder={"请输入您的留言"}
                placeholderTextColor={"#999"}
                onChangeText={(text) => this.insertValue(text)}
                onContentSizeChange={this._onContentSizeChange.bind(this)}
                value={this.state.value}
              />
            </View>
            <View style={{ width: width, height: 36, justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12, color: '#999', marginRight: width * 0.03 }}>您还能输入{300 - this.state.value.length}字</Text>
            </View>
          </View>
          {
            this.state.loading ?
              <View style={[[styles.btnContent, { opacity: 0.7 }]]}>
                <LoadingKit />
              </View>
              :
              <TouchableOpacity onPress={() => this.post()} style={styles.btnContent}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>提交</Text>
              </TouchableOpacity>
          }
        </ScrollView>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  page: {
    width: width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    position: 'relative'
  },

  title: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
    marginTop: px2dp(12)
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

  feedbackInputBox: {
    width: width * 0.94,
    height: 200,
    alignItems: 'flex-start',
    paddingTop: px2dp(6),
    paddingRight: px2dp(6),
    paddingBottom: px2dp(6),
    paddingLeft: px2dp(6),
    backgroundColor: '#fff',
    borderRadius: 6,
    marginTop: 16
  },

  feedbackInput: {
    width: width * 0.94 - px2dp(20),
    fontSize: 14,
    color: '#333',
    letterSpacing: 0.5,
    lineHeight: 18,
    paddingBottom: 0,
    paddingTop: 0
  },
})