<template>
  <div class="login-bg">
    <div class="login-form">
      <h3>{{ title }}</h3>
      <el-form ref="loginForm" :model="loginForm" style="margin-top: 30px;" :rules="dataRules">
        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input ref="password" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input ref="code" v-model="loginForm.code" prefix-icon="el-icon-circle-check" style="width: 65%;" />
          <el-image class="captcha-img" :src="captcha" @click="getCaptcha" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">{{ loginText }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getCaptchaImg } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      title: '后台登录',
      loginForm: {
        username: 'admin',
        password: '123456',
        code: '',
        uuid: ''
      },
      captcha: '',
      loading: false,
      loginText: '登录',
      dataRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      redirect: undefined
    }
  },
  created() {
    this.getCaptcha()
  },
  mounted() {
  },
  methods: {
    getCaptcha() {
      const time = new Date().getTime()
      getCaptchaImg(time).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.captcha = data.captcha
          this.loginForm.code = data.code
          this.loginForm.uuid = data.uuid
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        console.log('valid => ' + valid)
      })
      this.loading = true
      this.loginText = '登录中……'
      this.$message.success('登录中')
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/'})
      }).catch(err => {
        this.loading = false
        console.log(err)
      }).finally(() => {
        this.loading = false
        this.loginText = '登录'
      })
    }
  }
}
</script>
<style lang="scss">
  .login-bg {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/login-bg.jpg");
    display: flex;
    align-items: center;
    justify-content: center;
    .login-form {
      width: 350px;
      height: 380px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 0 20px;
      box-sizing: border-box;
      h3 {
        text-align: center;
        color: #333333;
        display: block;
        margin-top: 40px;
      }
      .captcha-img {
        width: 100px;
        height: 36px;
        margin-left: 8px;
        position: absolute;
        cursor: pointer;
      }
      .login-btn {
        width: 100%;
        margin-top: 20px;
      }
    }
  }
</style>
