<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{liked : value ===1 }"
    @click="onCollected"
    :loading="loading"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    onCollected: async function () {
      this.loading = true
      let status = -1
      if (this.value === 1) {
        await delLike(this.articleId)
      } else {
        status = 1
        await addLike(this.articleId)
      }
      this.$emit('update', status)
      this.$toast.success(status === 1 ? '点赞成功' : '点赞失败')
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  van-icon {
    color: #e5645f;
  }
}
</style>
