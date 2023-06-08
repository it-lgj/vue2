<template>
  <div id="integralConfig">
    <el-form
      class="integralConfig-wrap"
      label-position="right"
      label-width="350px"
      ref="form"
      :model="form"
    >
      <el-form-item
        label="积分抵用比例(1积分抵多少金额)"
        required
        prop="setOff"
      >
        <el-input-number
          v-model="form.setOff"
          :min="0"
          :step="0.5"
          @change="inputNumberChange"
        ></el-input-number>
      </el-form-item>

      <el-form-item
        label="下单赠送积分比例（实际支付1元赠送多少积分）"
        required
        prop="give"
      >
        <el-input-number
          v-model="form.give"
          :min="0"
          @change="inputNumberChange"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="积分冻结时间(天)" required prop="dueTime">
        <el-input-number
          v-model="form.dueTime"
          :min="0"
          @change="inputNumberChange"
        ></el-input-number>
      </el-form-item>

      <!-- 提交/重置按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">
          提交
        </el-button>

        <el-button @click="resetForm('form')" :disabled="isDisable">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  getIntegralConfig,
  submitIntegralConfig,
} from '@/network/api/integral-ml/integral'

export default {
  name: 'IntegralConfig',
  components: {},
  data() {
    return {
      form: {
        setOff: 0,
        give: 0,
        dueTime: 0,
      },
      isDisable: false,
    }
  },
  async created() {
    let res = await getIntegralConfig()
    this.form = {
      setOff: res.data.data.integral_ratio,
      give: res.data.data.order_give_integral,
      dueTime: res.data.data.freeze_integral_day,
    }
  },
  computed: {},
  methods: {
    // 事件函数----------------
    // 表单提交
    async submitForm() {
      await submitIntegralConfig(this.form)
      Message.success('提交成功')
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.isDisable = true
    },
    // el-input-number元素change事件
    inputNumberChange() {
      this.isDisable = false
    },
  },
}
</script>

<style lang="scss" scoped>
#integralConfig {
  background-color: white;
  display: flex;
  justify-content: center;
  .integralConfig-wrap {
    padding: 20px 0;
    .explain {
      font-weight: bold;
      color: #666;
      margin-right: 10px;
    }
  }
}
</style>
