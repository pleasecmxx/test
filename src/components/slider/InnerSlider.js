import { Image, StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from 'react';
import { px2dp, colors, width } from '../../utils/base';
import { navigate } from '../../NavigationService';
import redux from './../../redux/store'

export default class InnerSlider extends Component {
  constructor(props) {
    super(props);
    const state = redux.getState();
    this.state = {
      lever: state.lever,
      entries: [1, 1, 1, 1],
      activeSlide: 0,
      token: state.token,
      show: state.show,
    };
    const changeListener = () => {
      const state = store.getState();
      this.setState({ token: state.token, lever: state.lever, show: state.show });
    };
    redux.subscribe(changeListener);
  }

  jumpToWebView () {
    navigate('MyWebView',{title: '合作链接',url: 'http://www.china-seek.net/'})
  }

  _renderItem ({ item, index }) {
    return (
      // <View style={styles.slide}>
      //   <Text style={styles.title}>item.title</Text>
      // </View>
      <Image style={styles.slide} source={{ uri: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3392446666,2648420238&fm=26&gp=0.jpg' }} />
    );
  }

  goPackage () {
    if (this.state.lever === 0) {
      navigate('Login',  { isBack: true });
      return false;
    };
    navigate('BuyPackage',{ isService: false })  //不再供给后续服务
  };

  get pagination () {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ width: width, top: px2dp(-46) }}
        dotStyle={{
          width: 20,
          height: 4,
          borderRadius: 3,
          marginHorizontal: 0,
          backgroundColor: colors.themeColor
        }}
        inactiveDotStyle={{
          width: 20,
          height: 4,
          borderRadius: 3,
          marginHorizontal: 0,
          backgroundColor: '#999'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width}
          // layout={'tinder'}
          // layoutCardOffset={0}
          // activeSlideOffset={0}
          // activeSlideAlignment={'center'}
          // autoplay={true}
          // loop={true}
          inactiveSlideScale={0.98}
          // renderDots={this.render_dots.bind(this)}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          // containerStyle={{height: px2dp(120), alignItems:'center', width: width}}
          // containerStyle={{ height: px2dp(140), alignItems: 'center', backgroundColor: 'red' }}
          dimensions={{ width: width * 0.94, height: px2dp(140) }}
        />
        {this.pagination}
        <View style={styles.box}>
          <Image resizeMode={'contain'} style={styles.packageImg} source={require('./../../assets/package-bg.png')} />
        </View>
        {
          this.state.show ?
            <TouchableOpacity onPress={() => this.goPackage()} style={styles.boxContent}>
              <View style={{ height: px2dp(32), justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={{ color: '#EEDDBD', fontSize: 14, fontWeight: '700', marginBottom: 2 }}>购买套餐</Text>
                <Text style={{ color: '#EEDDBD', fontSize: 10 }}>PURCHASE PACKAGE</Text>
              </View>
              <Image style={styles.pageArrow} source={require('./../../assets/package-arow.png')} />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.jumpToWebView()} style={styles.boxContent}>
              <View style={{ height: px2dp(32), justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={{ color: '#EEDDBD', fontSize: 14, fontWeight: '700', marginBottom: 2 }}>帮助更多的人们寻找走失亲人</Text>
                <Text style={{ color: '#EEDDBD', fontSize: 10 }}>Help more people find lost loved ones</Text>
              </View>
              <Text style={{ color: '#EEDDBD', fontSize: 10, marginTop: px2dp(16) }}>——  寻亲宝</Text>
            </TouchableOpacity>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    position: 'relative',
    // backgroundColor: '#f2f2f2',
    height: px2dp(234),
    zIndex: 99999,
    justifyContent: "flex-start",
    zIndex: 99,
    marginTop: px2dp(12)
  },

  box: {
    position: 'absolute',
    left: width * 0.03,
    right: 0,
    bottom: 0,
    width: width * 0.94,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9
    // backgroundColor:'red'
  },

  boxContent: {
    position: 'absolute',
    left: width * 0.03,
    right: 0,
    bottom: 0,
    width: width * 0.94,
    height: width * 0.158,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(32)
  },

  pageArrow: {
    width: px2dp(24),
    height: px2dp(24),
  },

  wrapper: {
    width: width * 0.94,
    height: width * 0.94 / 2.5,
    borderRadius: 6,
    overflow: 'hidden'
  },

  slide: {
    width: width * 0.94,
    height: px2dp(140),
    borderRadius: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
    marginHorizontal: "3%",
    borderRadius: px2dp(6),
    zIndex: 9999
  },

  dotStyle: {
    width: 6,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },

  activeDotStyle: {
    width: 6,
    height: 4,
    backgroundColor: '#ff4141',
    borderRadius: 1.5,
  },

  packageImg: {
    width: width * 0.94,
    height: width * 0.158,
    borderRadius: width * 0.158 / 2,
  }
});