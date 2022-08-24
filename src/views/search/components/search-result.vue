<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      ></van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      error: false,
      list: [],
      page: 1,
      perPage: 20
    }
  },
  methods: {
    async onLoad () {
      await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText
      })
        .then((data) => {
          const { results } = data.data.data

          this.list.push(...results)

          this.loading = false
          if (results.length) {
            this.page++
          } else {
            this.finished = true
          }
        }).catch(
          this.error = true
        )
    }
  }
}
</script>

<style scoped>

</style>
