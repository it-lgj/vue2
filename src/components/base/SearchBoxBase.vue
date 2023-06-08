<!-- 作用：搜索框封装文件
时间：2022-11-1
作者：张晓瑜 -->
<template>
  <div id="searchBoxBase">
    <div>
      <el-input
        :placeholder="placeholderData"
        v-model="input"
        clearable
        @change="getSearch"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBoxBase",
  props: {
    placeholderData: {
      type: String,
      default: function () {
        return "请输入内容";
      },
    },
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    getSearch(val) {
      console.log(val);
      this.$emit("getVal", val);
    },
  },
};
</script>

<style lang="scss">
#searchBoxBase {
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-input__inner {
    width: 245px;
    height: 35px;
  }
  .el-button--default {
    height: 35px;
  }
}
</style>