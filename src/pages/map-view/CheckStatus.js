import React, { Component } from 'react';
import { View } from 'react-native'
import { toast } from './../../utils/base';
import OptionLoading from '../other/Loading';
import redux from './../../redux/store'
import HttpUtils from '../../utils/http';
import api from './../../utils/api';
import { back, replace, navigate } from './../../NavigationService';

export default class CheckStatus extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      token: state.token,
      id: this.props.route.params.id,
      title: this.props.route.params.title,
      loading: true
    }
  }

  componentDidMount() {
    let params = {
      token: this.state.token,
      lid: this.state.id,
    };
    HttpUtils.postRequrst(api.details, params)    //获取详情
      .then(res => {
        console.log(res);
        this.setState({ loading: false })
        if (res.code === 1) {
          if (res.list.see_is === 1) {
            console.log("去展示")
            replace("MyMapView", { id: this.state.id, title: this.state.title, data: res.list })
          } else {
            console.log("去买会员")
            toast("请先开通会员")
            replace('BuyPackage', { isService: true, id: this.state.id, title: this.state.title })
          }
        } else {
          toast(res.msg);
          back()
        }
      })
      .catch(err => {
        toast("网络出错了，请稍后重试")
      })
  }

  render() {
    const { loading } = this.state;
    return (
      <View>
        {
          loading ?
            <OptionLoading title={'111'} />
            :
            null
        }
      </View>
    )
  }
}