import axios from 'axios'
// 轻提示插件（Vant UI）
import { Toast } from 'vant'
import router from '../router'

// 根据环境变量切换本地和线上的请求地址
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : '//47.99.134.126:7008/api'
// 允许跨域
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// token的用户鉴权方式，在请求头的 headers 内添加 token，每次请求都会验证用户信息
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  // 返回数据的类型不是对象，则报异常
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  // code 状态码不是200，则报异常
  if (res.data.code != 200) {
    if (res.data.msg) Toast.fail(res.data.msg)
    // code 状态码为 401 代表接口需要登录，继而跳转到登录页面
    if (res.data.code == 401) {
      router.push({ path: '/login' })
    }
    // 返回失败的实例
    return Promise.reject(res.data)
  }
  // code 为 200 时，请求成功，返回数据