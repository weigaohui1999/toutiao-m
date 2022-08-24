<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{collected : value}"
    @click="onCollected"
    :loading="loading"
  />
</template>

<script>
import { addCollected, delCollected } from '@/api/article'

export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
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
    async onCollected () {
      this.loading = true
      if (this.value) {
        await delCollected(this.articleId)
      } else {
        await addCollected(this.articleId)
      }
      this.$emit('input', !this.value)
      this.$toast.success(!this.value ? '收藏成功' : '收藏失败')
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.collected {
  van-icon {
    color: #ffa500;
  }
}
</style>
