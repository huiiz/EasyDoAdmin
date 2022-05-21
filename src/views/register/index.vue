<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">易睹 管理员注册申请</h3>
      </div>
      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="cellphone" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="手机号，必须先在应用上注册"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名，大于3位"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码，大于6位"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="repass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="repass"
          v-model="loginForm.repass"
          :type="passwordType"
          placeholder="重复输入密码"
          name="repass"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="invite">
        <span class="svg-container">
          <svg-icon icon-class="invite" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.invite"
          placeholder="注册码"
          name="invite"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 55%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
        >提交注册申请</el-button
      >
      <el-button
        :loading="loading"
        type="warming"
        style="width: 40%; margin-bottom: 30px"
        @click.native.prevent="toLogin"
        >返回登录</el-button
      >

      <!--      <div class="tips">-->
      <!--        <span style="margin-right:20px;">username: admin</span>-->
      <!--        <span> password: any</span>-->
      <!--      </div>-->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { Message } from "element-ui";
export default {
  name: "Login",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error("手机号必须为11位"));
      } else {
        callback();
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("用户名不得小于3位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error("密码不得少于6位"));
      } else {
        callback();
      }
    };
    const validateRepass = (rule, value, callback) => {
      if (this.loginForm.password !== value) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    const validateInvite = (rule, value, callback) => {
      if (!value) {
        callback(new Error("注册码不得为空！"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        phone: "",
        username: "",
        password: "",
        repass: "",
        invite: "",
      },
      loginRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        repass: [
          { required: true, trigger: "blur", validator: validateRepass },
        ],
        invite: [
          { required: true, trigger: "blur", validator: validateInvite },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/register", this.loginForm)
            .then(() => {
              Message.success("管理员注册申请已提交！");
              setTimeout(() => {
                this.$router.push({ path: this.redirect || "/" });
                this.loading = false;
              }, 1500);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toLogin() {
      this.$router.push({
        path: "/login",
        query: { username: this.loginForm.username },
      });
    },
  },
  created() {
    // console.log(this.$route.query.username)
    this.loginForm.username = this.$route.query.username;
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
