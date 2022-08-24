<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  watch: {
    searchText: {
      // debounce防抖处理 传入一个函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      await getSearchSuggestion(q).then(data => {
        this.suggestions = data.data.data.options
        console.log(this.suggestions)
      }).catch()
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // new RegExp 创建正则表达式构造函数
      // 参数1： 匹配的字符串
      // 参数2： 匹配规则
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
