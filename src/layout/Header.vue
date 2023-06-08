<template>
  <!-- 头部 -->
  <div id="Header">
    <div class="header-right">
      <div>
        <div class="header-sys">
          <!-- 点击缩放侧边栏 -->
          <i @click="Collapse" class="el-icon-s-fold" ></i>
          <i @click="refresh" class="el-icon-refresh"></i>
        </div>
        <div class="header-menu">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ path: item == '主页' ? '/' : '' }"
              v-for="(item, index) in bread"
              :key="index"
            >
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 头部右侧 -->
      <div class="user-menu">
        <i class="el-icon-search"></i>
        <i class="el-icon-full-screen" @click="fullScreen"></i>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.realName
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><span @click="toIndex">主页</span>
            </el-dropdown-item>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>
              <span @click="close">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <History></History>
  </div>
</template>

<script>
import History from "./History.vue";

import screenFull from "screenfull";
import { removeCookie } from "@/utils/cookie";
import { UPDATE_COLLAPSE } from "@/store/mutations-types";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    History,
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      collapse: UPDATE_COLLAPSE,
    }),
    ...mapActions("User", ["userClose"]),

    //全屏
    fullScreen() {
      let body = document.body;
      screenFull.request(body);
    },
    //刷新
    refresh() {
      location.reload();
    },
    //合并
    Collapse() {
      this.collapse();
    },
    //系统退出
    close() {
      //映射的action执行
      this.userClose();
      // 移除token
      removeCookie("_token");
      //编程导航到登录界面
      this.$router.replace({
        path: "/",
        query: { redirect: this.$route.path },
      });
    },

    // 跳转主页
    toIndex() {
      this.$router.push({
        path: "/",
      });
    },
  },
  computed: {
    ...mapState(["bread", "isCollapse"]),
    ...mapState("User", ["userInfo"]),
  },
};
</script>

<style scoped lang="scss">
#Header {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  padding-right: 18px;
  .trans {
    width: 64px;
  }
  .header-right {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    height: 50px;
    div {
      @include itemcenter;
    }
  }
  i {
    font-size: 18px;
    color: #000;
  }
  .header-sys {
    i {
      padding: 0 10px;
    }
  }
  .user-menu {
    i,
    button {
      margin: 0 15px;
    }
    i {
      cursor: pointer;
    }
  }
}
</style>