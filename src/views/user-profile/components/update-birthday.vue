<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      currentDate: new Date(this.value),
      minDate: new Date(1970, 0, 1),
      maxDate: new Date()
    }
  },
  methods: {
    async onConfirm () {
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserProfile({
        birthday: currentDate
      }).then(() => {
        this.$emit('input', currentDate)
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
