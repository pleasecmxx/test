import { combineReducers } from 'redux'

function showReducer (state = true, action) {
  if (typeof action === 'undefined') {
    return state;
  }
  switch (action.type) {
    case 'SET_SHOW':
      // 返回新的状态对象
      return action.show;
    case 'CLEAR_SHOW':
      // 返回新的状态对象
      return null;
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}

function setPosition (state = {
  province: '湖南省',
  city: '正在定位',
  street: '正在获取街道信息',
  longitude: null,
  latitude: null
}, action) {
  if (typeof action === 'undefined') {
    return state;
  }
  switch (action.type) {
    case 'setPosition':
      // 返回新的状态对象
      return action.position;
    case 'CLEAR_position':
      // 返回新的状态对象
      return null;
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}

function tokenReducer (state = "", action) {
  if (typeof action === 'undefined') {
    return state;
  }
  switch (action.type) {
    case 'SET_TOKEN':
      // 返回新的状态对象
      return action.token;
    case 'CLEAR_TOKEN':
      // 返回新的状态对象
      return "";
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}

function lerverReducer (state = 0, action) {   //用户身份，默认为0
  if (typeof action === 'undefined') {
    return state;
  }

  switch (action.type) {
    case 'SET_LEVER':
      // 返回新的状态对象
      return action.lever;
    case 'CLEAR_LEVER':
      // 返回新的状态对象
      return "";
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}

function userMsgReducer (state = null, action) {
  if (typeof action === 'undefined') {
    return state;
  }
  switch (action.type) {
    case 'SET_USERMSG':
      // 返回新的状态对象
      return action.msg;
    case 'CLEAR_USERMSG':
      // 返回新的状态对象
      return null;
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}

//设置app版本号
function setVersion (state = null, action) {
  if (typeof action === 'undefined') {
    return state;
  }
  switch (action.type) {
    case 'SET_VERSION':
      // 返回新的状态对象
      return action.version_count;
    case 'CLEAR_VERSION':
      // 返回新的状态对象
      return null;
    default:
      // 没有改动发生，返回原状态对象
      return state;
  }
}
/**
 * 合并上面定义的各个 reducer 形成一个 reducer 用于创建 Redux store
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const combinedReducer = combineReducers({
  token: tokenReducer,
  show: showReducer,
  msg: userMsgReducer,
  lever: lerverReducer,
  position: setPosition,
  version_count: setVersion,
});

export default combinedReducer;