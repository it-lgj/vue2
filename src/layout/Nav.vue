<template>
  <!-- 侧边栏导航 -->
  <div id="navMenu">
    <div :class="['logo', { logocollapse: isCollapse }]">
      <img class="img1" v-if="!isCollapse" :src="logoImgUrl" />
      <img class="img2" v-if="isCollapse" :src="logoimgurl" />
    </div>
    <div class="menu">
      <el-menu
        :default-active="defaultRouter"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        :collapse="isCollapse"
        :router="true"
        background-color="#001121"
        text-color="#fff"
      >
        <!-- 一级导航 -->
        <el-submenu
          :index="item.path"
          v-for="(item, index) in menuList"
          :key="index"
        >
          <template slot="title">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.title }}</span>
          </template>

          <template v-for="(ite, ind) in item.children">
            <!-- 二级导航 C -->
            <el-menu-item
              :index="ite.path"
              :key="ind"
              v-if="ite.meta.type == 'C'"
            >
              {{ ite.title }}
            </el-menu-item>
            <!-- 二级导航 M -->
            <el-submenu
              v-if="ite.meta.type == 'M'"
              :index="ite.path"
              :key="ind"
            >
              <template slot="title">
                <span slot="title">{{ ite.title }}</span>
              </template>

              <!-- 三级导航 -->
              <el-menu-item
                :index="i.path"
                :key="x"
                v-for="(i, x) in ite.children"
              >
                {{ i.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/html5";
import { mapState } from "vuex";
export default {
  data() {
    return {
      menuList: [],
      logoImgUrl:
        "http://xawn.f3322.net:10001/crmebimage/public/operation/2021/12/25/6d292f4a663a453e8bcc9410eda89db55z1vksp7fx.png",
      logoimgurl:
        "http://xawn.f3322.net:10001/crmebimage/public/maintain/2021/12/25/8cf6cd4fd29c4a59a094ba028c8f3f4czyd21fctzc.png",
    };
  },
  created() {
    this.menuList = getStorage("_menu");
  },
  computed: {
    ...mapState(["isCollapse", "defaultRouter"]),
  },
};
</script>

<style scoped lang="scss">
#navMenu {
  height: 100%;
  background: #001529;
  overflow-y: scroll;
  box-sizing: border-box;

  .menu {
    margin-top: 60px;
  }
  .logo {
    box-sizing: border-box;
    padding: 0 20px;
    height: 60px;
    width: 200px;
    background-color: #001529;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: fixed;
    z-index: 2;
    top: 0;
    transition: all 0.3s ease-in-out;
    .img1 {
      width: 100%;
      height: 40px;
    }
    .img2 {
      width: 35px;
      height: 35px;
    }
    span {
      font-weight: bold;
      font-size: 20px;
      white-space: nowrap;
    }
  }
  .menuList-parent,
  .menuList-child {
    display: inline-block;
    padding: 0 20px;
    height: 40px;
    width: 100%;
    line-height: 40px;
    box-sizing: border-box;
  }
  .menuList-child {
    margin-left: 20px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
#navMenu .logocollapse {
  width: 64px;
}
</style>