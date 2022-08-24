<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()"/>
    </van-nav-bar>

    <van-form ref="loginFrom" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round size="small"
            type="default"
            @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { getSmsCode, login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      const user = this.user
      // duration 为0 则持续展示
      this.$toast.loading({ message: '登录中', forbidClick: true, duration: 0 })

      await login(user).then(({ data }) => {
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$router.back()
      }).catch(err => {
        if (err.response.status === 400) {
          this.$toast.fail(`${err.response.data.message}`)
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      })
    },
    async onSendSms () {
      await this.$refs.loginFrom.validate('mobile').catch(err => {
        return this.$toast.fail(`验证失败,${err}`)
      })

      this.isCountDownShow = true

      await getSmsCode(this.user.mobile).catch(
        err => {
          this.isCountDownShow = false
          if (err.response.status === 429) {
            this.$toast('发送太频繁，请稍后重试')
          } else {
            this.$toast('发送失败，请稍后重试')
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
