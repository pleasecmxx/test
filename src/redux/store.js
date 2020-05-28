import {createStore} from 'redux'
// 引入我们刚才所创建的 reducer，也就是使用 combineReducers 组合后的那个 reducer
import combinedReducer from './reducers'

export default store = createStore(combinedReducer)