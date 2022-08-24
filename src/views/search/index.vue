<template>
 <div class="search-container">

   <from class="search-from" action="/">
     <van-search
     v-model="searchText"
     show-action
     placeholder="请输入搜索关键词"
     background="#3296fa"
     @search="onSearch"
     @focus="isResultShow = false"
     @cancel="onCancel" />
   </from>
   <!--   历史记录-->
   <search-result v-if="isResultShow" :search-text="searchText"/>
    <!--   搜索联想-->
   <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"/>
   <!--   搜索历史记录-->
   <search-history
     v-else
     :search-histories="searchHistories"
     @clear-search-histories="searchHistories = []"
     @search="onSearch"
   />

 </div>
</template>

<script>
import SearchHistory from '@/views/search/components/search-history'
import SearchSuggestion from '@/views/search/components/search-suggestion'
import SearchResult from '@/views/search/components/search-result'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: { SearchResult, SearchSuggestion, SearchHistory },
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SERACH_HISTORIES') || []
    }
  },
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SERACH_HISTORIES', value)
    }
  },
  methods: {
    onSearch (val) {
      this.searchText = val
      // 存储搜索历史记录
      // 不要有重复历史记录，最新的排在最前的
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search-action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
