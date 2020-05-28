//@ts-nocheck
import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { size, px2dp, colors, onePx } from './../../utils/base';
const homeIconActive = require('./../../assets/home-icon.png');
// const homeIconInactive = require('./../../../assets/home-inactive.png');
// const cartIconActive = require('./../../../assets/cart-active.png');
// const cartIconInactive = require('./../../../assets/cart-inactive.png');
const mineIconActive = require('./../../assets/user-icon.png');
// const mineIconInactive = require('./../../../assets/mine-inactive.png');
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

import TabItem from '../tab-item/TabBarItem'

const BottomBar = ({ state, descriptors, navigation }) => {

    const [_isIphoneX] = React.useState(isIphoneX());
    
    React.useEffect(() => {
        // alert()
    }, []);

    return (
        <View style={[styles.container, _isIphoneX ? { paddingBottom: getBottomSpace() , height: size.tab_height + getBottomSpace()} : 0]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
                const isFocused = state.index === index;
                let icon;
                switch (index) {
                    case 0:
                        icon = homeIconActive
                        break;
                    case 1:
                        icon = mineIconActive 
                        break;
                    default:
                        return false
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };


                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={isFocused ? 1 : 0.42}
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={index + 'router'}
                    >
                        <TabItem isIphoneX={_isIphoneX} isFocused={isFocused} name={label} icon={icon} index={index}/>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: size.tab_height,
        backgroundColor: '#fff',
        borderTopColor: '#d9d9d9',
        borderTopWidth: onePx
    },

    tab: {
        position: 'relative',
        width: px2dp(375 / 3),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    tabIcon: {
        width: px2dp(24),
        height: px2dp(24),
    },

    label: {
        fontSize: 12,
        color: '#999'
    },

    
})

export default BottomBar;