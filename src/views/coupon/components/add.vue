<template>
  <div id="addCoupon">
    <div class="addCoupon-wrap">
      <i class="el-icon-back" @click="back_click"></i>
      <!-- 表单 -->
      <el-form
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
        label-position="right"
        size="small"
      >
        <div class="input-wrap">
          <el-form-item label="优惠劵名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="优惠劵类型" prop="useType">
          <el-radio-group v-model="formData.useType">
            <el-radio :label="1">通用券</el-radio>
            <el-radio :label="2">商品券</el-radio>
            <el-radio :label="3">品类券</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择商品券，显示-->
        <!-- required -->
        <el-form-item
          label="商品："
          prop="primaryKeyForm"
          v-show="formData.useType == 2"
        >
          <div class="imgs-wrap">
            <p v-for="(item, index) in selectedGoodsInfo" :key="index">
              <img :src="item.image" />
              <span @click="x_click(index)">x</span>
            </p>
            <span class="goods-img" @click="goodsCoupon_click">
              <i class="el-icon-camera"></i>
            </span>
          </div>
        </el-form-item>
        <!-- 选择品类券，显示-->
        <el-form-item
          label="选择品类："
          prop="class"
          v-show="formData.useType == 3"
        >
          <el-cascader
            :options="selectClass"
            clearable
            :show-all-levels="false"
            v-model="formData.class"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="优惠劵面值" prop="money">
          <el-input-number v-model="formData.money" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="使用门槛" prop="minPrice">
          <el-radio-group v-model="formData.minPrice">
            <el-radio :label="0">无门槛</el-radio>
            <el-radio :label="1">有门槛</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择有门槛，显示 -->
        <el-form-item
          label="优惠券最低消费"
          prop="minPrice"
          v-show="formData.minPrice != 0"
        >
          <el-input-number
            v-model="formData.minPriceInput"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="使用有效期" prop="isDay">
          <el-radio-group v-model="formData.isDay">
            <el-radio :label="0">天数</el-radio>
            <el-radio :label="1">时间段</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择天数，显示 -->
        <el-form-item
          label="使用有效期限（天）"
          prop="day"
          v-show="formData.isDay == 0"
        >
          <el-input-number v-model="formData.day" :min="1"></el-input-number>
        </el-form-item>
        <!-- 选择时间段，显示 -->
        <el-form-item
          label="使用有效期限"
          prop="detailDay"
          v-show="formData.isDay == 1"
        >
          <el-date-picker
            v-model="formData.detailDay"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="领取是否限时" prop="isForever">
          <el-radio-group v-model="formData.isForever">
            <el-radio :label="1">限时</el-radio>
            <el-radio :label="0">不限时</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择限时，显示 -->
        <el-form-item
          label="领取时间"
          prop="useStartTime"
          v-show="formData.isForever == 1"
        >
          <el-date-picker
            v-model="formData.useStartTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="领取方式" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">手动领取</el-radio>
            <el-radio :label="2">新人券</el-radio>
            <el-radio :label="3">赠送券</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否限量" prop="isLimited">
          <el-radio-group v-model="formData.isLimited">
            <el-radio :label="1">限量</el-radio>
            <el-radio :label="0">不限量</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择限量，显示 -->
        <el-form-item
          label="发布数量"
          prop="total"
          v-show="formData.isLimited != 0"
        >
          <el-input-number v-model="formData.total" :min="1"></el-input-number>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            添加
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 商品列表弹框 -->
      <!-- :visible.sync="isShowGoodsList" -->
      <goodsListDialog ref="dialog"></goodsListDialog>
    </div>
    <!--  -->
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getCouponClass, addCoupon } from '@/network/api/coupon/coupon'
const goodsListDialog = () => import('./goodsListDialog.vue')

export default {
  name: 'AddCoupon',
  components: {
    goodsListDialog,
  },
  data() {
    return {
      formData: {
        name: '', // 优惠券名字
        useType: 1,
        money: 1,
        minPrice: 0,
        isDay: 0,
        day: null, // 天数
        detailDay: '', // 时间段
        isForever: 0, // 是否限时
        type: 2,
        isLimited: 0,
        sort: 0,
        status: 0,
        class: '',
        minPriceInput: 1,
        useStartTime: '',
        total: 1,
        primaryKeyForm: null,
      },
      a: '',
      rules: {
        name: [
          { required: true, message: '请输入优惠劵名称', trigger: 'blur' },
        ],
        // class: [{ required: true, message: '请选择商品品类', trigger: 'blur' }],
        // minPriceInput: [
        //   { required: true, message: '请输入优惠券最低消费', trigger: 'blur' },
        // ],
        // primaryKeyForm: [
        //   { required: true, message: '请选择商品', trigger: 'blur' },
        // ],
      },
      // 品类券的选项（要获取）
      selectClass: [],
      // 设置用户进制选择某些时间
      pickerOptions: {
        disabledDate(time) {
          // 设置禁止用户选择今天之前的日期，包含今天。
          // return time.getTime() <= (Date.now());
          // 此条为设置禁止用户选择今天之前的日期，不包含今天。
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        },
      },
      // 商品券中，选中的商品信息
      selectedGoodsInfo: [],
    }
  },
  async created() {
    let res = await getCouponClass()
    // 整理数据
    this.selectClass = this.makeClassData(res.data.data)
  },
  computed: {},
  methods: {
    // 函数区-----------------------------
    // 整理数据，形成品类券选项
    makeClassData(data) {
      let newData = []
      data.forEach((item, index) => {
        if (item.child) {
          newData.push({
            value: item.id,
            label: item.name,
            children: this.makeClassData(item.child),
          })
        } else {
          newData.push({
            value: item.id,
            label: item.name,
          })
        }
      })

      return newData
    },
    // 事件函数-----------------------------
    // 选择商品券，点击弹出对话框事件
    goodsCoupon_click() {
      this.$refs.dialog.isShow = true
    },
    // 表单提交
    submitForm(formName) {
      let data = this.makeRequestData()
      this.$refs[formName].validateField(['name'], async (valid) => {
        if (!valid) {
          await addCoupon(data)
          Message({
            type: 'success',
            message: '添加成功！',
          })
          this.$parent.componentName = null
          this.$parent.getCouponListFn()
        } else {
          alert(`${valid}`)
          return false
        }
      })
    },
    // 制作请求参数
    makeRequestData() {
      if (this.formData.useType == 1) {
        this.a = ''
      } else if (this.formData.useType == 2) {
        this.selectedGoodsInfo.forEach((item, index) => {
          if (index == this.selectedGoodsInfo.length - 1) {
            this.a += item.id
          } else {
            this.a += item.id + ','
          }
        })
      } else if (this.formData.useType == 3) {
        this.a = this.formData.class[1]
      }
      let data = {
        checked: JSON.parse(JSON.stringify(this.selectedGoodsInfo)),
        day: this.formData.isDay ? null : this.formData.day,
        isFixedTime: this.formData.detailDay ? true : false,
        isForever: !!this.formData.isForever,
        isLimited: !!this.formData.isLimited,
        minPrice: this.formData.minPrice ? this.formData.minPriceInput : 0,
        money: this.formData.money,
        name: this.formData.name,
        primaryKey: JSON.parse(JSON.stringify(this.a)),
        receiveEndTime: this.formData.useStartTime
          ? this.formData.useStartTime[1]
          : '',
        receiveStartTime: this.formData.useStartTime
          ? this.formData.useStartTime[0]
          : '',
        sort: this.formData.sort,
        status: !!this.formData.status,
        total: this.formData.isLimited ? this.formData.total : 0,
        type: this.formData.type,
        useEndTime: this.formData.detailDay ? this.formData.detailDay[1] : '',
        useStartTime: this.formData.detailDay ? this.formData.detailDay[0] : '',
        useType: this.formData.useType,
      }
      return data
    },
    // 回退
    back_click() {
      this.$parent.componentName = null
    },
    // 点小叉叉删掉选择的商品信息
    x_click(index) {
      this.$refs.dialog.checkboxValues.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
#addCoupon {
  position: relative;

  .addCoupon-wrap {
    background-color: white;
    padding: 10px 10px;
    box-sizing: border-box;
    font-weight: bold;
    .el-icon-back {
      font-size: 30px;
      color: #1890ff;
      cursor: pointer;
    }
    .imgs-wrap {
      display: flex;
      align-items: center;
      .goods-img {
        border: 1px dashed $goods-img-border-add;
        background-color: $goods-img-bg-add;
        padding: 0 20px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        cursor: pointer;
      }
      img {
        width: 50px;
        vertical-align: top;
      }
      p {
        position: relative;
        margin-right: 10px;
        span {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 15px;
          height: 15px;
          line-height: 15px;
          border-radius: 50%;
          background-color: #333;
          color: white;
          font-size: 12px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    .input-wrap {
      width: 500px;
    }
  }
}
</style>
