<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfrim"
    />

    <div class="field-wrap">
    <van-field
      v-model="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      show-word-limit
      placeholder="请输入昵称"
    />
    </div>

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfrim () {
      const localName = this.localName
      if (!localName.length) {
        this.$toast('昵称不能为空')
        return
      }
      await updateUserProfile({
        name: localName
      }).then(() => {
        this.$emit('input', localName)
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
