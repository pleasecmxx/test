import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

export default class LodingKit extends Component {

  static defaultProps = {
    height: 20,
    width: 20,
    tintColor: "#fff"
  }

  constructor(props) {
    super(props);
    this.fadeAnim = new Animated.Value(0);
  }

  componentDidMount () {
    Animated.loop(Animated.timing(
      this.fadeAnim,
      {
        duration: 2000,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )).start()
  }

  render () {
    const { width, height, tintColor } = this.props;
    return (
      <Animated.Image style={{
        transform: [{
          rotate: this.fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"]
          }),
        }],
        width,
        height,
        tintColor,
      }}
        source={require("./../../assets/loading.png")} />
    );
  }
}