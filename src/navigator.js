// import React from 'react'
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { createStackNavigator } from 'react-navigation-stack';
// import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

// import Home from './pages/Home';
// import Mine from './pages/Mine';
// import MyMapView from './pages/map-view/MyMapView'
// import Setting from './pages/user-center/Setting'
// import ChangePass from './pages/user-center/ChangePass'
// import BuyPackage from './pages/home-subpages/BuyPackage'

// //启动模块
// import Login from './pages/start-modle/Login'
// import SetUserName from './pages/user-center/SetUserName'
// import ForgetPass from './pages/start-modle/ForgetPass'
// import SetPassWord from './pages/start-modle/SetPassWord'
// import UseInvateCode from './pages/start-modle/UseInvateCode'
// import Register from './pages/start-modle/Register'

// //个人中心
// import AboutUs from './pages/mine-model/AboutUs';
// import FeedBack from './pages/mine-model/FeedBack';
// import HelpPage from './pages/mine-model/HelpPage';
// import PrivatePage from './pages/mine-model/PrivatePage';

// //代理中心
// import AgentCenter from './pages/agent-center/AgentCenter'
// import TakeCash from './pages/agent-center/TakeCash'
// import CashHistory from './pages/agent-center/CashHistory'  //提现列表
// import GetList from './pages/agent-center/GetList'
// import MyBanner from './pages/agent-center/MyBanner'
// import MyGroup from './pages/agent-center/MyGroup'

// //other
// import MyWebView from './pages/other/MyWebView'

// //业务模块
// import ResultList from './pages/business-model/ResultList'
// import SelectMethod from './pages/business-model/SelectMethod'
// import FindBySelf from './pages/business-model/FindBySelf'
// import FindByHB from './pages/business-model/FindByHB'
// import FindByGame from './pages/business-model/FindByGame'
// import ArticleTabs from './pages/business-model/ArticleTabs'
// import SelectArticle from './pages/business-model/SelectArticle'
// import TestPage from './pages/other/TestPage'
// import Accept from './pages/business-model/Accept'
// import SharePage from './pages/business-model/SharePage'
// import CheckStatus from './pages/map-view/CheckStatus'

// //寻亲业务模块
// import XunQinPage from './pages/xunqin-model/XunQinPage'
// import WriteMsg from './pages/xunqin-model/WriteMsg'
// import AllList from './pages/xunqin-model/AllList'

// import TabBarItem from './components/tab-item/TabBarItem'

// import { colors, size } from './utils/base';
// const TabScreens = createBottomTabNavigator({
//   home: {
//     screen: Home,
//     navigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, tintColor }) => (
//         <TabBarItem
//           tintColor={tintColor}
//           focused={focused}
//           text='首页'
//           normalImage={require('./assets/home-icon.png')}
//           selectedImage={require('./assets/home-icon.png')}
//         />
//       )
//     }),
//   },
//   mine: {
//     screen: Mine,
//     navigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, tintColor }) => (
//         <TabBarItem
//           tintColor={tintColor}
//           focused={focused}
//           text="个人中心"
//           normalImage={require('./assets/user-icon.png')}
//           selectedImage={require('./assets/user-icon.png')}
//         />
//       )
//     }),
//   }
// }, {
//   navigationOptions: {
//     header: null
//   },
//   tabBarOptions: {
//     //当前选中的tab bar的文本颜色和图标颜色
//     activeTintColor: '#0066FF',
//     //当前未选中的tab bar的文本颜色和图标颜色
//     inactiveTintColor: '#999999',
//     //是否显示tab bar的图标，默认是false
//     showIcon: true,
//     //showLabel - 是否显示tab bar的文本，默认是true
//     showLabel: false,
//     //material design中的波纹颜色(仅支持Android >= 5.0)
//     // pressColor: 'red',
//     //按下tab bar时的不透明度(仅支持iOS和Android < 5.0).
//     // pressOpacity: 0.8,
//     style: {
//       backgroundColor: '#fff',
//       paddingBottom: 1,
//       borderTopWidth: 0.5,
//       paddingTop: 1,
//       borderTopColor: '#eee',
//       height: size.tabHeight
//     },
//     tabStyle: {
//       // justifyContent: 'center',
//       // alignItems: 'center',
//       // backgroundColor: 'red',
//       paddingLeft: 0,
//       paddingRight: 0
//     },
//     //tab 页指示符的样式 (tab页下面的一条线).
//     indicatorStyle: { height: 0 },
//   },
//   //tab bar的位置, 可选值： 'top' or 'bottom'
//   tabBarPosition: 'bottom',
//   //是否懒加载
//   lazy: true,
//   //返回按钮是否会导致tab切换到初始tab页？ 如果是，则设置为initialRoute，否则为none。 缺省为initialRoute。
//   backBehavior: 'initialRoute',
// })

// let jumpType = StackViewStyleInterpolator.forHorizontal;

// /**
//  * 
//  * @param {Number} type 
//  */
// const changeJumpType = (type) => {
//   switch (type) {
//     case 1:
//       jumpType = StackViewStyleInterpolator.forHorizontal;   //水平
//       break;
//     case 2:
//       jumpType = StackViewStyleInterpolator.forVertical;   //竖直
//       break;
//     default:
//       break;
//   }
// }

// const StackScreens = createStackNavigator({
//   TabScreens,
//   Setting,
//   MyMapView,
//   ChangePass,
//   SetUserName,
//   BuyPackage,
//   Login,
//   ForgetPass,
//   SetPassWord,
//   UseInvateCode,
//   Register,
//   AgentCenter,
//   TestPage,
//   ResultList,
//   SelectMethod,
//   FindBySelf,
//   FindByHB,
//   FindByGame,
//   ArticleTabs,
//   MyWebView,
//   SelectArticle,
//   Accept,
//   SharePage,
//   TakeCash,
//   AboutUs,
//   FeedBack,
//   HelpPage,
//   PrivatePage,
//   CashHistory,
//   GetList,
//   MyBanner,
//   MyGroup,
//   CheckStatus,
//   XunQinPage,
//   WriteMsg,
//   AllList
// }, {
//   defaultNavigationOptions: {
//     header: null
//   },
//   transitionConfig: () => ({
//     // 只要修改最后的forVertical就可以实现不同的动画了。
//     screenInterpolator: jumpType,
//   })
// })

// const AppContainer = createAppContainer(StackScreens);

// export {
//   AppContainer,
//   changeJumpType
// } 
