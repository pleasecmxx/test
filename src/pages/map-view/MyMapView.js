
import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, NativeModules, } from 'react-native'
import { MapView, Marker } from 'react-native-amap3d'
import { width, toast, px2dp, statusBarHeight, size, colors, onePx } from '../../utils/base'
import NormalHead from '../../components/tool-kit/NormalHead'
import Loading from './../../pages/other/Loading'
import HttpUtils from '../../utils/http'
import api from './../../utils/api'
import redux from './../../redux//store'
import LoadingKit from './../../components/tool-kit/LoadingKit'
import { back } from '../../NavigationService'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class MyMapView extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      id: this.props.route.params.id,
      token: state.token,
      list: [],
      coordinate: {
        latitude: 39.806901,
        longitude: 116.397972,
      },
      height: 60,
      title: this.props.route.params.title,
      loading: true,
      show: false
    }
  }

  componentDidMount () {
    console.log("开始展示")
    try {
      this.delayShow = setTimeout(() => {
        let data = this.props.route.params.data;
        data.list.forEach(item => {
          item.isActive == false
        })
        data.list[0].isActive = true;
        const coordinate = {
          latitude: Number(data.list[0].latitude),
          longitude: Number(data.list[0].longitude)
        }
        LayoutAnimation.linear();
        this.setState({ list: data.list, loading: false, coordinate, height: 200, show: true });
      }, 500);
      this.delayChangeLoading = setTimeout(() => {
        this.setState({ loading: false })
      }, 500)
    } catch (error) {
      toast("网络出错了，请稍后重试");
    }
  }

  componentWillUnmount () {
    this.delayShow && clearTimeout(this.delayShow);
  }

  test (item, index) {
    if (item.isActive) {
      return false;
    }
    this._mapView.animateTo({
      tilt: 0,
      // rotation: 90,
      zoomLevel: 19,
      coordinate: {
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      }
    });
    let list = this.state.list;
    list.forEach(ele => {
      ele.isActive = false
    });
    list[index].isActive = true;
    this.setState({ list })
  }

  render_marker (item, index) {
    return <Marker
      active={item.isActive}
      title={item.address_set}
      color='green'
      zIndex={999}
      description={'时间：' + item.time}
      coordinate={{
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      }}
    />
  }

  changeSize () {
    if (this.state.show) {
      LayoutAnimation.linear();
      this.setState({ show: false, height: 36 })
    } else {
      LayoutAnimation.linear();
      this.setState({ show: true, height: 200 })
    }
  }

  render_item ({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.test(item, index)} style={styles.row}>
        <View style={styles.textKit}>
          <Text style={styles.textIcon}>精确</Text>
        </View>
        <Text numberOfLines={2} style={[{ fontSize: 12, color: '#000', maxWidth: px2dp(160) }, item.isActive ? { color: colors.themeColor } : null]}>{item.address_set}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    const { coordinate, loading } = this.state;
    return (
      <View style={styles.page}>
        <NormalHead title={this.state.title + '的结果展示'} />
        <MapView
          ref={(c) => this._mapView = c}
          style={{ width: width, flex: 1 }}
          coordinate={coordinate}
          zoomLevel={18}
          // tilt={45}
          // locationEnabled
          // onLocation={({ nativeEvent }) =>
          //   console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
          showsIndoorMap >
          {this.state.list.map((item, index) => this.render_marker(item, index))}
        </MapView>
        <View style={[styles.toolList, { height: this.state.height }]}>
          {
            this.state.loading ?
              <LoadingKit tintColor={'#000'} />
              :
              <>
                {
                  this.state.show ?
                    <FlatList
                      data={this.state.list}
                      renderItem={this.render_item.bind(this)}
                      keyExtractor={(item, index) => index + ''}
                    />
                    :
                    null
                }
              </>
          }
          <>
            {
              this.state.loading ?
                null :
                <View style={styles.footLine}>
                  <Text style={{ paddingVertical: 5, paddingHorizontal: 20 }} onPress={() => this.changeSize()}>{this.state.show ? "收起" : "展开列表"}</Text>
                </View>
            }
          </>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: width,
    position: 'relative'
  },

  toolList: {
    position: 'absolute',
    right: width * 0.03,
    top: statusBarHeight + size.headHeight + px2dp(10),
    zIndex: 9999,
    width: px2dp(200),
    height: px2dp(100),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px2dp(4)
  },

  row: {
    width: px2dp(190),
    maxHeight: px2dp(42),
    flexDirection: 'row',
    paddingHorizontal: px2dp(6),
    marginVertical: px2dp(2)
  },

  textIcon: {
    fontSize: 12,
    color: '#333',
  },

  textKit: {
    width: 32,
    height: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginRight: 4,
    marginTop: 2,
    marginLeft: -5
  },

  footLine: {
    width: px2dp(200),
    height: px2dp(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#d9d9d9',
    borderTopWidth: onePx
  }
})