import { Component } from 'react'
import { reset } from './../NavigationService'
import { toast, BaseUrl, getTime, getRandom } from './base'

/**
 * fetch 网络请求的header，可自定义header 内容
 * @type {{Accept: string, Content-Type: string, accessToken: *}}
 */
const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

// /**           
//  * GET 请求时，拼接请求URL
//  * @param url 请求URL
//  * @param params 请求参数
//  * @returns {*}
//  */
// const handleUrl = url => params => {
//   if (params) {
//     let paramsArray = []
//     Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])));
//     if (url.search(/\?/) === -1) {
//       typeof (params) === 'object' ? url += '?' + paramsArray.join('&') : url;
//     } else {
//       url += '&' + paramsArray.join('&');
//     }
//   }
//   return url;
// }


/**
 * fetch 网络请求超时处理
 * @param original_promise 原始的fetch
 * @param timeout 超时时间 30s
 * 
 */
const timeoutFetch = (original_fetch, timeout = 60000) => {
  let timeoutBlock = () => { }
  let timeout_promise = new Promise((resolve, reject) => {
    timeoutBlock = () => {
      // 请求超时处理
      reject('请求超时');
    }
  })

  // Promise.race(iterable)方法返回一个promise
  // 这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
  let abortable_promise = Promise.race([
    original_fetch,
    timeout_promise
  ])

  setTimeout(() => {
    timeoutBlock()
  }, timeout)

  return abortable_promise
}

/**
 * 网络请求工具类
 */
export default class HttpUtils extends Component {

  // /**
  //  * 基于fetch 封装的GET 网络请求
  //  * @param url 请求URL
  //  * @param params 请求参数
  //  * @returns {Promise}
  //  */

  // static getRequest = (url, params = {}) => {
  //   return timeoutFetch(fetch(handleUrl(url)(params), {
  //     method: 'GET',
  //     headers: header
  //   })).then(response => {
  //     if (response.ok) {

  //       return response.json()
  //     } else {
  //       alert("出错啦~")
  //     }
  //   }).then(response => {
  //     if (response) {
  //       return response
  //     } else {
  //       // 非 200，错误处理
  //       // alert(response.msg)
  //       return response
  //     }
  //   }).catch(error => {
  //     alert(error)
  //   })
  // }

  /**
   * 基于fetch 的 POST 请求
   * @param url 请求的URL
   * @param params 请求参数
   * @returns {Promise}
   */
  static postRequrst = (url, params = {}) => {
    params.time_stamp = getTime();
    params.number_random = getRandom();
    params.sign = params.time_stamp + params.number_random + 'hongmenyuncong';
    params.yzdl = 'test'
    console.log(params)
    console.log(JSON.stringify(params))
    let fetchUrl = BaseUrl + url
    return timeoutFetch(fetch(fetchUrl, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(params)
    })).then(response => {
      return response.json()
    }).then(response => {
      if (response && response.code === 1) {
        return response
      } else if (response && response.code === 101) {  //被顶号了
        toast('监测到您的账号在别处登录')
        // setTimeout(() => {
        //   reset('login')
        // }, 200)
      } else {
        // toast(res.msg);
        return response
      }
    }).catch(error => {
      toast(JSON.stringify(error))
    })
  }
}