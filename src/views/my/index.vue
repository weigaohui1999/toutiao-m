<template>
  <div class="my-container">
    <div v-if="!user" class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <div v-else class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" :src="userinfo.photo" round fit="cover"></van-image>
          <span>{{ userinfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userinfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <van-grid class="grid-van" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link></van-cell>
    <van-cell title="小智同学" is-link></van-cell>
    <van-cell v-if="user" title="退出登录" class="lgout-cell" clickable @click="onLogout"></van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  data () {
    return {
      userinfo: {

      }
    }
  },
  created () {
    if (this.user) {
      // 如果用户登录了则加载用户数据
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLogout () {
      this.$dialog.confirm({ title: '确认退出吗' }).then(() => {
        this.$store.commit('setUser', null)
      }).catch(() => {

      })
    },
    async loadUserInfo () {
      await getUserInfo().then(({ data }) => {
        this.userinfo = data.data
      }).catch(() => {
        this.$toast('获取数据失败，请稍后重试')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 22px;
        color: #fff;
      }
    }
  }
  .base-info {
    height: 231px;
    padding: 76px 32px 23px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        border: 1px solid #fff;
        margin-right: 23px;
      }
      .name {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .grid-van {
    .grid-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .lgout-cell {
    margin-top: 9px;
    color: #e28c8c;
    text-align: center;
  }
}
</style>
