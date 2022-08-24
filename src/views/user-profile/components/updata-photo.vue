<template>
  <div class="updata-photo">
    <img :src="img" alt="" ref="img">

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>

</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhotoImg } from '@/api/user'
export default {
  name: 'UpdataPhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm () {
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        const formDate = new FormData()
        formDate.append('photo', blob)

        const { data } = await updateUserPhotoImg(formDate)

        this.$emit('close')
        this.$emit('update-photo', data.date.photo)
        console.log(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.updata-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  max-width: 100%;
  display: block;
}
</style>
