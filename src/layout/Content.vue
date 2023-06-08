<template>
  <div class="content">
    <!-- 二级路由出口 -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <router-view> </router-view>
    </transition>
    
  </div>
</template>

<script>
import History from "./History.vue";
export default {
  name: "Content",
  components: {
    History,
  },
};
</script>

<style scoped lang="scss">
// 路由出口页面样式
.content {
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  height: auto;
  transition: width 0.3s ease-in-out;
}
</style>