import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/v1_0/',
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // 请求发起时会经过这里
    // config 本次请求的请求配置对象
    // console.log(config)
    const user = store.state.user
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // 请求出错会经过这里
    // Do something with request error
    if (error.response && error.response.status === 401) {
      this.$router.go('/login')
    }
    return Promise.reject(error)
  }
)
// 响应拦截器

export default request
