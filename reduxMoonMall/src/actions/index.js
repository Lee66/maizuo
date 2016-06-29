/**
 * Created by zhengguorong on 16/6/27.
 */
// import fetch from 'isomorphic-fetch'
import 'whatwg-fetch';
import * as types from '../constants/ActionTypes'


/**
 * get请求
 * @param  {String} options.url   api地址
 * @param  {String} options.query query参数
 * @return {Promise}               Promise
 */
const _get = ({ url, query },dispatch) => {
  dispatch({type:types.START_LOADING})
  let _url
  if (query) {
    _url = `http://m.maizuo.com/v4/api${url}?${query}`
  } else {
    _url = `http://m.maizuo.com/v4/api${url}`
  }
  return fetch(_url)
    .then(res => {
      dispatch({type:types.FINISH_LOADING})
      if (res.status >= 200 && res.status < 300) {
        return res.json()
      }
      return Promise.reject(new Error(res.status));
    })
}

/**
 * 获取即将开始电影列表
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {Number} page             页数
 * @param  {Number} count             每页数量
 * @return {Promise}                  Promise
 */
export const fetchComingSoonLists = (page,count) => {
  const url = '/film/coming-soon';
  const query = `count=${count}&page=${page}&_t=`+new Date().getTime()
  return (dispatch) =>{
    _get({ url, query},dispatch)
      .then((json) => {
        if (json.status===0) {
          return dispatch({type:types.FETCH_COMING_SOON_SUCCESS, comingSoonFilms:json.data})
        }
        return Promise.reject(new Error('fetchFilmsLists failure'))
      })
      .catch((error) => {
        dispatch({type:types.FETCH_COMING_SOON_FAIL})
        return Promise.reject(error)
      })
  }
}
/**
 * 获取广告
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {Number} id             电影id
 * @return {Promise}                  Promise
 */
export const fetchBillboards = () => {
  const url = '/billboard/home';
  const query = '_t='+new Date().getTime()
  return (dispatch) => {
    _get({url, query}, dispatch)
      .then((json) => {
        if (json.status === 0) {
          return dispatch({type:types.FETCH_BILLBOARD_SUCCESS, billboards:json.data})
        }
        return Promise.reject(new Error('FETCH_BILLBOARD_SUCCESS failure'))
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
