import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 全局使用默认中文
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

dayjs().format('YYYY-MM-DD')

// 全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs((value)))
})
