<template>
  <div class="user-profile">
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()" />
    <input type="file" ref="file" hidden @change="onFileChange"/>
    <van-cell title="头像">
      <van-image class="avator" fit="cover" center round :src="user.photo" @click="$refs.file.click()"/>
    </van-cell>
    <van-cell title="昵称" @click="isUpdateNameShow = true" :value="user.name" is-link/>
    <van-cell title="性别" @click="isUpdateGenderShow = true" :value="user.gender === 0 ? '男' : '女'" is-link/>
    <van-cell title="生日" @click="isUpdateBirthdayShow = true" :value="user.birthday" is-link/>

    <van-popup v-model="isUpdateNameShow" position="bottom" style="height: 100%">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name"/>
    </van-popup>

    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model="user.gender"/>
    </van-popup>

    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday v-if="isUpdateBirthdayShow" @close="isUpdateBirthdayShow = false" v-model="user.birthday"/>
    </van-popup>

    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height: 100%">
      <updata-photo :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event"/>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from '@/views/user-profile/components/update-name'
import UpdateGender from '@/views/user-profile/components/update-gender'
import UpdateBirthday from '@/views/user-profile/components/update-birthday'
import UpdataPhoto from '@/views/user-profile/components/updata-photo'

export default {
  name: 'UserProfile',
  components: { UpdataPhoto, UpdateBirthday, UpdateGender, UpdateName },
  data () {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      await getUserProfile().then(data => {
        console.log(data)
        this.user = data.data.data
      })
    },
    onFileChange (e) {
      const file = this.$refs.file.files[0]
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  }

}
</script>

<style lang="less" scoped>
.user-profile {
  .avator {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
