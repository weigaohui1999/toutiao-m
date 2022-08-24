<template>
  <div class="article-list">

    <van-pull-refresh
      v-model="isLoading"
      :success-text="refreshText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :article="item"
        >
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'article-list',
  components: { ArticleItem },
  props: {
    channel: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false,
      isLoading: false,
      refreshText: '刷新成功'

    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      // console.log(this.channel)
      // 1. 请求获取数据
      await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now() || this.timestamp,
        with_top: 1
      }).then(data => {
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data.data
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        //     loading 关闭以后才能触发下一次的加载更多
        this.loading = false

        this.refreshText = `刷新成功, 更新了${results.length}条数据`
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = false
        }
      }).catch(() => {
        this.error = true
        this.loading = false
      })
    },
    async onRefresh () {
      await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now() || this.timestamp,
        with_top: 1
      }).then(data => {
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data.data
        this.list.unshift(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        //     loading 关闭以后才能触发下一次的加载更多
        this.isLoading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = false
        }
      }).catch(() => {
        this.refreshText = '刷新失败'
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
