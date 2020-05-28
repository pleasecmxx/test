/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';
// // @ts-nocheck
import React from 'react';
import { StatusBar, TextInput, Image, TouchableOpacity, Text, DeviceEventEmitter, View, Keyboard, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EasyToast from 'react-native-easy-toast'
import { navigationRef } from './NavigationService';

import Home from './pages/Home';
import Mine from './pages/Mine';

import MyMapView from './pages/map-view/MyMapView'
import Setting from './pages/user-center/Setting'
import ChangePass from './pages/user-center/ChangePass'
import BuyPackage from './pages/home-subpages/BuyPackage'

//启动模块
import Login from './pages/start-modle/Login'
import SetUserName from './pages/user-center/SetUserName'
import ForgetPass from './pages/start-modle/ForgetPass'
import SetPassWord from './pages/start-modle/SetPassWord'
import UseInvateCode from './pages/start-modle/UseInvateCode'
import Register from './pages/start-modle/Register'

//个人中心
import AboutUs from './pages/mine-model/AboutUs';
import FeedBack from './pages/mine-model/FeedBack';
import HelpPage from './pages/mine-model/HelpPage';
import PrivatePage from './pages/mine-model/PrivatePage';


//代理中心
import AgentCenter from './pages/agent-center/AgentCenter'
import TakeCash from './pages/agent-center/TakeCash'
import CashHistory from './pages/agent-center/CashHistory'  //提现列表
import GetList from './pages/agent-center/GetList'
import MyBanner from './pages/agent-center/MyBanner'
import MyGroup from './pages/agent-center/MyGroup'


//other
import MyWebView from './pages/other/MyWebView'

//业务模块
import ResultList from './pages/business-model/ResultList'
import SelectMethod from './pages/business-model/SelectMethod'
import FindBySelf from './pages/business-model/FindBySelf'
import FindByHB from './pages/business-model/FindByHB'
import FindByGame from './pages/business-model/FindByGame'
import ArticleTabs from './pages/business-model/ArticleTabs'
import SelectArticle from './pages/business-model/SelectArticle'
import TestPage from './pages/other/TestPage'
import Accept from './pages/business-model/Accept'
import SharePage from './pages/business-model/SharePage'
import CheckStatus from './pages/map-view/CheckStatus'

//寻亲业务模块
import XunQinPage from './pages/xunqin-model/XunQinPage'
import WriteMsg from './pages/xunqin-model/WriteMsg'
import AllList from './pages/xunqin-model/AllList'

import IndexTabBar from './components/my-tab-bar/IndexTabBar'
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function TabScreens() {
  return (
    <Tab.Navigator
      tabBar={props => <IndexTabBar {...props} />}
    // tabBarOptions={{}}
    // screenOptions={({ route }) => ({})}
    >
      <Tab.Screen name="首页" component={Home} />
      <Tab.Screen name="我的" component={Mine} />
    </Tab.Navigator>
  )
}

const App = () => {
  TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { defaultProps: false, placeholderTextColor: "#ccc", style: { color: '#000', paddingVertical: 0 } })
  Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false, style: { color: '#333', fontSize: 14, fontWeight: '400' } })
  TouchableOpacity.defaultProps = Object.assign({}, Text.defaultProps, { activeOpacity: 0.72 })
  Image.defaultProps = Object.assign({}, Image.defaultProps, { resizeMethod: "resize" });

  const easyToastListner = React.useRef(null);
  const easyToastRef = React.useRef(null);

  React.useEffect(() => {
    easyToastListner.current = DeviceEventEmitter.addListener('toast-ios', (a) => {
      easyToastRef.current && easyToastRef.current.show(a.msg)
    });
    return () => {
      easyToastListner.current && easyToastListner.current.remove();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 1 }}>
      <NavigationContainer ref={navigationRef} >
        <Stack.Navigator
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS
          }}
          headerMode={"none"}
        >
          <Stack.Screen name="TabScreens" component={TabScreens} />
          <Stack.Screen name="MyMapView" component={MyMapView} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ChangePass" component={ChangePass} />
          <Stack.Screen name="BuyPackage" component={BuyPackage} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SetUserName" component={SetUserName} />
          <Stack.Screen name="ForgetPass" component={ForgetPass} />
          <Stack.Screen name="SetPassWord" component={SetPassWord} />
          <Stack.Screen name="UseInvateCode" component={UseInvateCode} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="FeedBack" component={FeedBack} />
          <Stack.Screen name="HelpPage" component={HelpPage} />
          <Stack.Screen name="PrivatePage" component={PrivatePage} />
          <Stack.Screen name="AgentCenter" component={AgentCenter} />
          <Stack.Screen name="TakeCash" component={TakeCash} />
          <Stack.Screen name="CashHistory" component={CashHistory} />
          <Stack.Screen name="GetList" component={GetList} />
          <Stack.Screen name="MyBanner" component={MyBanner} />
          <Stack.Screen name="MyGroup" component={MyGroup} />
          <Stack.Screen name="MyWebView" component={MyWebView} />
          <Stack.Screen name="ResultList" component={ResultList} />
          <Stack.Screen name="SelectMethod" component={SelectMethod} />
          <Stack.Screen name="FindBySelf" component={FindBySelf} />
          <Stack.Screen name="FindByHB" component={FindByHB} />
          <Stack.Screen name="FindByGame" component={FindByGame} />
          <Stack.Screen name="ArticleTabs" component={ArticleTabs} />
          <Stack.Screen name="SelectArticle" component={SelectArticle} />
          <Stack.Screen name="TestPage" component={TestPage} />
          <Stack.Screen name="Accept" component={Accept} />
          <Stack.Screen name="SharePage" component={SharePage} />
          <Stack.Screen name="CheckStatus" component={CheckStatus} />
          <Stack.Screen name="XunQinPage" component={XunQinPage} />
          <Stack.Screen name="WriteMsg" component={WriteMsg} />
          <Stack.Screen name="AllList" component={AllList} />
        </Stack.Navigator>
        <EasyToast ref={easyToastRef} position={'center'} />
      </NavigationContainer>
    </View>
  );
};

export default App;
