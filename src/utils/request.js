import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { Message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from '@/utils/constant'
import { isAuthenticated, logout } from '@/utils/session'
import { refreshToken } from '@/store/actions'
import qs from 'qs'
import history from './history'
const BASE_URL = process.env.REACT_APP_BASE_URL || ''
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

let token = '';
//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  let authention = isAuthenticated()
  if (authention) {
    token = authention.access_token;
  }
  config.headers.common['Authorization'] = 'Bearer ' + token;
  //console.dir(config);
  return config;
}, function (error) {
  // Do something with request error
  console.info("error: ");
  console.info(error);
  return Promise.reject(error);
});


//添加一个响应拦截器
axios.interceptors.response.use(response => {
  return response;
}, err => {
  return new Promise((resolve, reject) => {

    const { response } = err
    let error = response
    if (error.status === 401 && error.data.error_description.indexOf('Access token expired') != -1) {
      refreshToken({ initialRequest: error.config, resolve: resolve, reject: reject });
    } else if (error.status === 401 && error.statusText === 'Unauthorized') {
      logout()
      history.push('/login')
    }else if(error.status === 504){
      history.push('/error')
    } 
     else {
      reject(error);
    }
  });
});




const { CancelToken } = axios

window.cancelRequest = new Map()

export default function request(options) {
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)
  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }

    url = domain + url

  } catch (e) {
    Message.fail(e.message)
  }

  options.url = url
  if (options.method === 'post' || options.method === 'put'  ) {
    if (url&&(url.indexOf('oauth/token') != -1)){
      options.data = qs.stringify(cloneData);
    }else if(url&&(url.indexOf('file/upload') != -1)){
      options.data=data
    }
     else {
      options.data = cloneData
    }
  } else {
    options.params = cloneData
  }

  

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return axios(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message} = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      }else if(error&&error.data['error'] === 'invalid_grant'){
        statusCode = 601
        msg = error.data.error_description || '用户名或密码错误'
      } else {
        statusCode = 600
        msg = (error&&error.message) || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
