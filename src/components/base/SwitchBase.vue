<template>
  <div id="switchBase">
    <el-switch
      v-model="value"
      :active-value="1"
      :inactive-value="0"
      active-text="开启"
      inactive-text="关闭"
      @change="onChange"
    ></el-switch>
  </div>
</template>

<script>
export default {
  name: "SwitchBase",
  data() {
    return {
      value: 1,
    };
  },
  methods: {
    onChange(val) {
      this.$emit("statusVal", val);
    },
  },
};
</script>

<style lang="scss">
#switchBase {
  .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  .el-switch__label--right {
    text-align: left;
    z-index: 1;
    right: -13px;
    top: -1px; /*不同场景下可能不同，自行调整*/
    span {
      font-size: 12px;
    }
  }
  .el-switch__label--left {
    text-align: left;
    z-index: 1;
    left: 22px; /*不同场景下可能不同，自行调整*/
    top: -1px;
    span {
      font-size: 12px;
    }
  }
  .el-switch__label.is-active {
    display: block;
  }
  .el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 60px !important; /*开关按钮的宽度大小*/
  }
}
</style>