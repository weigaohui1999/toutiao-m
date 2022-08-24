<template>
    <van-button
      class="follow-btn"
      v-if="isFollowed"
      round
      :loading="followLoading"
      size="small"
      @click="onFollow"
    >已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      :loading="followLoading"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      @click="onFollow"
    >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',

  // 修改自定义组件 v-model 的 数据形式
  model: {
    prop: 'isFollowed',
    event: 'updata-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false
    }
  },
  methods: {
    async onFollow () {
      this.followLoading = true
      if (this.isFollowed) {
        await deleteFollow(this.userId)
      } else {
        await addFollow(this.userId).catch(err => {
          if (err.response && err.response.status === 400) {
            this.$toast('你不能关注你自己！')
          }
        })
      }
      this.followLoading = false
      // eslint-disable-next-line vue/no-mutating-props
      this.$emit('updata-is_followed', !this.isFollowed)
    }
  }
}
</script>

<style scoped>

</style>
