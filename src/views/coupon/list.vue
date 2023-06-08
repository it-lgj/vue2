<template>
  <div id="couponList">
    <div class="couponList-wrap" v-if="!componentName">
      <!-- 表单 -->
      <el-form label-position="right" class="el-form">
        <!-- 选择优惠券状态 -->
        <el-form-item label="状态：" label-width="60px">
          <el-select
            v-model="requestParams.status"
            placeholder="请选择一个状态"
            clearable
          >
            <el-option label="未开启" :value="0"></el-option>
            <el-option label="已开启" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索优惠券 -->
        <el-form-item label="优惠券名称：" label-width="130px">
          <el-input
            placeholder="请输入优惠券名称"
            v-model="requestParams.name"
            class="input"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search_click"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 添加优惠券按钮 -->
      <el-button type="primary" size="medium" @click="add_click">
        添加优惠券
      </el-button>

      <!-- 表格 -->
      <div class="table-wrap">
        <el-table
          :data="tableData"
          :cell-style="{
            fontSize: '12px',
          }"
          :header-cell-style="{
            color: '#333',
            fontWeight: 'bold',
          }"
          style="width: 95%;"
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in tableTitle"
            :key="index"
            :min-width="item.minWidth"
          ></el-table-column>
          <!-- 发布数量 -->
          <el-table-column label="发布数量" min-width="150px">
            <template slot-scope="scope">
              <p v-if="!scope.row.releaseNumber.total">不限量</p>
              <p v-if="scope.row.releaseNumber.total" class="release-p">
                发布：{{ scope.row.releaseNumber.total }}
              </p>
              <p v-if="scope.row.releaseNumber.total" class="last-p">
                剩余：{{ scope.row.releaseNumber.lastTotal }}
              </p>
            </template>
          </el-table-column>
          <!-- switch -->
          <el-table-column label="是否开启" min-width="150px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="switch_change(scope.row.id, scope.row.status)"
              ></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
              >
                领取记录
              </el-button>
              <!-- <el-button type="text" size="small" v-if="scope.row.status">
                复制
              </el-button> -->
              <el-button
                type="text"
                size="small"
                @click="deleteCouponFn(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="requestParams.page"
          :page-sizes="pageSizes"
          :page-size="requestParams.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加优惠券组件 -->
    <component :is="componentName"></component>

    <!-- 领取记录模态框 -->
    <historyCoupon ref="historyCouponDialog"></historyCoupon>
  </div>
</template>

<script>
const addCoupon = () => import('@/views/coupon/components/add.vue')
const historyCoupon = () => import('@/views/coupon/components/history.vue')
import { Message, MessageBox } from 'element-ui'
import {
  getCouponList,
  delCoupon,
  updateCoupon,
  getHasCouponUser,
} from '@/network/api/coupon/coupon'

export default {
  name: 'CouponList',
  components: {
    historyCoupon,
  },
  data() {
    return {
      componentName: null,
      historyComponentName: null,
      // 分页的
      pageSizes: [5, 10, 15, 20, 25, 30],
      // currentPage: 1,
      total: 0,
      // totalPage: 1,
      // 请求参数
      requestParams: {
        limit: 5,
        page: 1,
        name: '',
        status: '',
        // type: 0,
        // userType: 0,
      },
      // 表格的
      tableData: [],
      tableTitle: [
        {
          prop: 'id',
          label: 'ID',
          minWidth: '80',
        },
        {
          prop: 'name',
          label: '名称',
          minWidth: '150',
        },
        {
          prop: 'useType',
          label: '类型',
          minWidth: '120',
        },
        {
          prop: 'money',
          label: '面值',
          minWidth: '100',
        },
        {
          prop: 'type',
          label: '领取方式',
          minWidth: '120',
        },
        {
          prop: 'canGetTime',
          label: '领取日期',
          minWidth: '300',
        },
        {
          prop: 'day',
          label: '使用时间',
          minWidth: '300',
        },
      ],
    }
  },
  created() {
    this.getCouponListFn()
  },
  computed: {},
  methods: {
    // 事件函数-----------------
    // form的：
    // input搜索
    search_click() {
      this.getCouponListFn()
    },
    // 添加优惠券事件
    add_click() {
      this.componentName = addCoupon
    },
    // table的：
    // switch开关切换
    async switch_change(id, status) {
      await updateCoupon(id, status)
      Message({
        type: 'success',
        message: '修改成功！',
      })
      this.getCouponListFn()
    },
    // 领取记录
    async handleClick(row) {
      let params = {
        page: 1,
        limit: 100,
        couponId: row.id,
      }
      // 拿到领取该优惠券的用户们
      let res = await getHasCouponUser(params)
      // 弹出模态框
      this.$refs.historyCouponDialog.dialogTableVisible = true
      this.$refs.historyCouponDialog.tableData = res.data.data.list
    },
    // 删优惠券
    deleteCouponFn(delId) {
      MessageBox.confirm('确定删除该优惠券信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await delCoupon(delId)
          Message({
            type: 'success',
            message: '删除成功！',
          })
          this.getCouponListFn()
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '取消删除',
          })
        })
    },
    // 分页的：
    // 每页几条事件
    handleSizeChange(val) {
      this.requestParams.limit = val
      this.getCouponListFn()
    },
    // 当前哪页事件
    handleCurrentChange(val) {
      this.requestParams.page = val
      this.getCouponListFn()
    },
    // 函数区-------------------
    // 请求数据
    async getCouponListFn() {
      let res = await getCouponList(this.requestParams)
      this.tableData = this.makeData(res.data.data.list)
      this.total = res.data.data.total
    },
    // 整理数据，(辅助getCouponListFn函数的)
    makeData(data) {
      let newTableTitleData = []
      let userTypeRule = ['全场通用', '商品券', '品类券']
      let typeRule = ['手动领取', '新人券', '赠送券']
      data.forEach((item, index) => {
        let {
          id,
          name,
          money,
          status,
          day,
          useStartTime,
          useEndTime,
          useType,
          type,
          receiveStartTime,
          receiveEndTime,
          total,
          lastTotal,
        } = item
        newTableTitleData.push({
          id,
          name,
          money,
          status,
          // day: `${day}天`,
          day: day == 0 ? `${useStartTime} - ${useEndTime}` : `${day}天`,
          useType: userTypeRule[useType - 1],
          type: typeRule[type - 1],
          canGetTime: receiveEndTime
            ? `${receiveStartTime} - ${receiveEndTime}`
            : '不限时',
          releaseNumber: {
            total,
            lastTotal,
          },
        })
      })
      return newTableTitleData
    },
  },
  watch: {
    // 下拉框选择未开启 或 已开启后，请求新数据
    'requestParams.status': {
      handler(newValue) {
        this.requestParams.status = newValue
        this.getCouponListFn()
      },
    },
    // 输入框为空，发送一次请求
    'requestParams.name': {
      handler(newValue) {
        newValue == '' && this.getCouponListFn()
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.couponList-wrap {
  background-color: $bgwhite;
  padding: 20px 0px 20px 30px;
  box-sizing: border-box;
  .input {
    width: 300px;
  }
  .el-form {
    display: flex;
  }
  .table-wrap {
    padding: 30px 0;
    margin-top: 30px;
    border-top: 1px solid $border-color-card-top;
    .release-p {
      color: $releaseP;
    }
    .last-p {
      color: $lastP;
    }
  }
  .pagination-wrap {
    text-align: right;
  }
}
</style>
