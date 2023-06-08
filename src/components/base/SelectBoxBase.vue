<!-- 作用：下拉选项框封装文件
时间：2022-11-1
作者：张晓瑜 -->
<template>
  <div id="selectBoxBase">
    <el-select
      v-model="value"
      clearable
      :placeholder="placeholder"
      @change="selectChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "SelectBoxBase",
  props: {
    optionsData: {
      type: Array,
      default: function () {
        return [
          {
            value: 1,
            label: "开启",
          },
          {
            value: 0,
            label: "关闭",
          },
        ];
      },
    },
    placeholder: {
      type: String,
      default: function () {
        return "请选择";
      },
    },
  },
  data() {
    return {
      value: null,
      options: [],
    };
  },
  created() {
    let { optionsData } = this.$props;
    this.options = optionsData;
  },
  methods: {
    selectChange(val) {
      this.$emit("getVal", val);
    },
  },
};
</script>

<style lang="scss" >
#selectBoxBase {
  .el-select .el-input__inner {
    width: 100%;
    height: 35px;
  }
}
</style>