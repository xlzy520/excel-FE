<template>
  <div class="login-container">
    <div class="container">
      <div class="top">
        <div class="header">
          <img src="~@/assets/logo.svg" class="logo" alt="logo">
          <span class="title">信息校验系统</span>
        </div>
      </div>
      <div class="main">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="Username" name="username"
                      tabindex="1" auto-complete="on"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="Password" name="password"
                      tabindex="2" auto-complete="on" show-password @keyup.enter.native="handleLogin"/>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%" @click="handleLogin">登录</el-button>
        </el-form>
      </div>
      <div class="footer">
        <div class="copyright">Copyright &copy; 2019 执笔看墨花开出品</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '13588043792',
        password: 'admin123'
      },
      loginRules: {
        username: [this.$methods.required('用户名')],
        password: [
          this.$methods.required('密码'),
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-input {
    input:focus {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, .2);
    }
  }

  .login-container {
    height: 100%;
    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 40px 0 37px;
      position: relative;
      a {
        text-decoration: none;
      }
      .top {
        text-align: center;
        .header {
          height: 44px;
          line-height: 44px;
          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }
          .title {
            font-size: 33px;
            /*color: rgba(0, 0, 0, .85);*/
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
            color: white;
            text-transform: capitalize;
            background-image: linear-gradient(to right, #fb618d 10%, #8dc00a 40%, #d68fe9 70%);
            background-size: auto auto;
            background-clip: border-box;
            background-size: 200% auto;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            animation: textclip 3s linear infinite;
          }
        }
      }
      .main {
        min-width: 260px;
        width: 368px;
        margin: 100px auto;
      }
      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
  @keyframes textclip {
    100% {
      background-position: 200% center;
    }
  }
</style>
