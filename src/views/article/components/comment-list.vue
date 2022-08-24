<template>
  <van-list
  v-model="loading"
  :finished="finished"
  :immediate-check="false"
  @load="onLoad"
  error="error"
  error-text="加载失败，请点击重试"
  finished-text="没有更多了">
  <comment-item
    v-for="(item, index) in list"
    :key="index"
    :comment="item"
    @reply-click="$emit('reply-click', $event)"
  />
  </van-list>
</template>

<script>
import { gettComment } from '@/api/comment'
import CommentItem from '@/views/article/components/comment-item'

export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validate (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  created () {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      await gettComment({ type: this.type, source: this.source.toString(), offset: this.offset, limit: this.limit }).then(data => {
        const { results } = data.data.data
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(...results)
        console.log(data.data.data)
        this.$emit('onload-success', data.data.data)
        this.loading = false
        if (results.length) {
          this.offset = data.data.data().last_id
        } else {
          this.finished = true
        }
      }).catch(() => {
        this.loading = false
        this.error = true
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
