<template>
  <!-- 后台管理系统主界面 -->
  <div class="index">
    <div :class="['Nov', { Novcollapse: isCollapse }]">
      <Nav></Nav>
    </div>
    <div :class="['Top', { Topcollapse: isCollapse }]">
      <Header></Header>
    </div>
    <div :class="['Coc', { Coccollapse: isCollapse }]">
      <Content> </Content>
      <div class="Foo">
        <div>官网 社区 文档</div>
        <div>Copyright © 2020 西安众邦网络科技有限公司</div>
      </div>
    </div>
  </div>
</template>

<script>
const Nav = () => import("@/layout/Nav.vue");
const Header = () => import("@/layout/Header.vue");
const Content = () => import("@/layout/Content.vue");

import { mapState } from "vuex";
export default {
  name: "index",
  components: {
    Nav,
    Header,
    Content,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["isCollapse"]),
  },
};
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  background-color: #f5f5f5;
  position: relative;
  // 侧边栏样式
  .Nov {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    width: 200px;
    box-sizing: border-box;
    transition: width 0.3s ease-in-out;
  }
  .Novcollapse {
    width: 64px;
    transition: width 0.3s ease-in-out;
  }
  // 头部样式
  .Top {
    width: calc(100% - 200px);
    position: fixed;
    margin-left: 200px;
    top: 0;
    right: 0;
    z-index: 9;
    background-color: transparent;
    box-sizing: border-box;
    height: 100px;
    transition: width 0.3s ease-in-out;
  }
  .Topcollapse {
    width: calc(100% - 64px);
    transition: width 0.3s ease-in-out;
  }
  // 内容区最外层样式
  .Coc {
    width: calc(100% - 200px);
    height: calc(100vh - 100px);
    position: relative;
    margin-left: 200px;
    margin-top: 100px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    transition: margin-left 0.3s ease-in-out;
    padding: 0 20px;
  }
  .Coccollapse {
    width: calc(100% - 64px);
    margin-left: 64px;
    transition: margin-left 0.3s ease-in-out;
  }
  .Foo {
    height: 200px;
    box-sizing: border-box;
    padding: 100px 0;
    div {
      text-align: center;
    }
  }
}
</style>