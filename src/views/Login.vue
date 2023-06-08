<template>
  <!-- 登录页 -->
  <div
    class="login"
    :style="{ backgroundImage: 'url(' + loginPic.backgroundImage + ')' }"
  >
    <div class="login-box">
      <div class="login-box-left">
        <img :src="bannerPic" />
      </div>
      <div class="login-box-right">
        <div class="login-box-right-head">
          <div class="logo">
            <img :src="loginPic.loginLogo" />
          </div>
        </div>
        <div class="login-box-right-form">
          <!-- 登录表单 -->
          <form @submit.prevent="login">
            <ul>
              <li>
                <el-input
                  type="text"
                  v-model="user.name"
                  placeholder="请输入账号"
                ></el-input>
              </li>
              <li>
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="user.password"
                  show-password
                ></el-input>
              </li>
              <li class="captcha">
                <el-input
                  type="text"
                  v-model="user.captcha"
                  placeholder="请输入验证码"
                  class="captcha-input"
                ></el-input>
                <div class="captcha-img" @click="changeCaptha">
                  <img :src="loginCaptcha" />
                </div>
              </li>
              <span>{{ msg }}</span>
              <li>
                <el-button type="primary" class="btn" native-type="submit"
                  >登录</el-button
                >
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, removeCookie } from "@/utils/cookie";
import { setStorage, getStorage } from "@/utils/html5.js";
import { getLoginPic, getLoginCaptcha, userLogin } from "@/network/api/login";
import { mapActions } from "vuex";
import "@/assets/js/canvas-nest.min.js";
export default {
  name: "Login",
  data() {
    return {
      loginPic: {},
      bannerPic: null,
      loginCaptcha: null,
      msg: " ",
      user: {
        name: "admin",
        password: "123456",
        captcha: "",
        key: "",
      },
    };
  },
  async created() {
    // 获取图片
    let loginPic = await getLoginPic();
    this.loginPic = loginPic.data.data;
    this.bannerPic = this.loginPic.banner[0].pic;

    // 获取验证码
    let loginCaptcha = await getLoginCaptcha();
    this.loginCaptcha = loginCaptcha.data.data.code;
    this.user.key = loginCaptcha.data.data.key;
  },
  mounted() {},
  methods: {
    ...mapActions("User", {
      userToken: "saveUserToken",
    }),

    // 用户登录
    async login() {
      let { user } = this;

      //用户登录完成之后需要将令牌值存储
      const { res, token } = await this.userToken({ user });
      // 缓存令牌
      setCookie("_token", token);
      setStorage("_userInfo", res.data.data);
      // 登陆失败: 提示信息并切换验证码
      this.msg = res.data.message;
      if (res.data.code !== 200) {
        this.user.captcha = "";
        this.changeCaptha();
        removeCookie("_token");
      } else {
        // 删除元素
        let can = document.getElementsByTagName("canvas")[0];
        can.remove();
      }

      // 登陆成功则跳转之前的页面
      let { redirect } = this.$route.query;
      console.log(this.$route.query);
      this.$router.replace({ path: getStorage("_defaultRouter") });
    },

    // 点击切换验证码
    async changeCaptha() {
      let loginCaptcha = await getLoginCaptcha();
      this.loginCaptcha = loginCaptcha.data.data.code;
      this.user.key = loginCaptcha.data.data.key;
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-box {
  background-color: white;
  display: flex;
  width: 670px;
  height: 400px;
  border-radius: 6px;
  z-index: 1;
  box-sizing: border-box;
}

.login-box-left {
  width: 268px;
}
.login-box-left > img {
  width: 268px;
  height: 400px;
  outline: 0;
}

.login-box-right {
  width: 384px;
  padding: 0 40px 32px 40px;
  height: 400px;
  box-sizing: border-box;
}
.login-box-right-head {
  display: flex;
  padding: 20px 0;
  justify-content: center;
}
.login-box-right-head > .logo {
  height: 75px;
}
.logo > img {
  max-height: 75px;
}

.login-box-right-form li {
  margin-bottom: 20px;
}
.login-box-right-form span {
  color: #f56c6c;
  font-size: 12px;
  display: block;
  height: 16px;
  position: relative;
}
.login-box-right-form .captcha {
  display: flex;
}
.login-box-right-form .captcha-input {
  width: 185px;
}
.login-box-right-form .captcha-img {
  width: 119px;
  height: 40px;
}
.login-box-right-form .captcha-img > img {
  width: 100%;
  height: 100%;
}
.login-box-right-form .btn {
  width: 100%;
}
</style>