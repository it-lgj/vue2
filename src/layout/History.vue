<template>
  <!-- 历史导航组件 -->
  <div id="History">
    <div
      v-for="(item, index) in history"
      :class="['history-menu', { active: item.isNow }]"
      :key="index"
      @click="goHistory(item)"
    >
      <span> {{ item.name }}</span>
      <template v-if="index != 0">
        <i class="el-icon-close" @click.stop="removehistory(index)"></i>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { REMOVE_HISTORY, UPDATE_DEFAULT } from "@/store/mutations-types";
import { setStorage, getStorage } from "@/utils/html5";
export default {
  name: "History",
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      remove: REMOVE_HISTORY,
      defaultRouter: UPDATE_DEFAULT,
    }),
    goHistory(item) {
      let { path } = item;
      this.defaultRouter(path);
      this.$router.push({ path: path });
    },

    // 点击关闭历史导航
    removehistory(index) {
      let history = getStorage("_history");
      let isThis = history[index].isNow;
      this.remove({ index });
      // 如果是当前页面则跳转到主页
      if (isThis) {
        this.$router.push({
          path: "/",
        });
      }
    },
  },
  computed: {
    ...mapState(["history"]),
  },
  // watch: {
  //   history(newValue) {
  //     newValue[0].isNow ? this.$router.push({ path: newValue[0].path }) : null;
  //   },
  // },
};
</script>

<style scoped lang="scss">
#History {
  height: 50px;
  background-color: #f5f5f5;
  padding: 5px 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  .history-menu {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding: 0 15px;
    background-color: #fff;
    margin-top: 5px;
    margin-right: 10px;
    span,
    i {
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      font-weight: 100;
      margin: 0 5px;
    }
  }
  div.active {
    background-color: #bedef88e;
    color: #359af8;
    border-bottom: 2px solid #359af881;
    box-sizing: border-box;
  }
}
</style>