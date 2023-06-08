<template>
  <div id="console">
    <div class="console-wrap" @click="path_click">
      <i :class="`el-icon-${iType}`" :style="{ color: iColor }"></i>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Console',
  components: {},
  props: {
    iColor: String,
    iType: String,
    text: String,
    path: String,
  },
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {
    path_click() {
      this.$router.push({ path: this.$props.path })
    },
  },
}
</script>

<style lang="scss" scoped>
.console-wrap {
  @include wrap-base-style;
  @include flex-column-between-center;
  font-size: 12px;
  color: #303133;
  padding: 20px 0;
  cursor: pointer;

  i {
    font-size: 32px;
    margin-bottom: 5px;
  }
}
</style>
