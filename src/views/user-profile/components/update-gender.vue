<template>
  <div class="update-gender">
    <van-picker
    show-toolbar
    title=""
    :columns="columns"
    :default-index="localGender"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    async onConfirm () {
      const localGender = this.localGender
      await updateUserProfile({
        gender: localGender
      }).then(() => {
        this.$emit('input', localGender)
        this.$emit('close')
      })
    },
    onPickerChange (picker, value, index) {
      this.localGender = 0
    }
  }
}
</script>

<style scoped>

</style>
