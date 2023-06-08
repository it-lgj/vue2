<template>
  <div id="order">
    <!-- 表单 -->
    <el-form label-position="right" label-width="100px" class="el-form">
      <el-form-item label="订单状态：">
        <!-- 一堆按钮 未支付、未发货... -->
        <el-radio-group
          v-model="radioCheckedTop"
          size="small"
          @change="radioCheckedTop_change"
        >
          <el-radio-button
            :label="item"
            v-for="(item, index) in radioTextTop"
            :key="index"
          ></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="时间选择：">
        <!-- 一堆按钮 今天、昨天... -->
        <el-radio-group
          v-model="radioChecked"
          size="small"
          @change="radioChecked_change"
        >
          <el-radio-button
            :label="item"
            v-for="(item, index) in radioText"
            :key="index"
          ></el-radio-button>
        </el-radio-group>

        <!-- 选择一段时间 -->
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          class="el-date"
          @change="date_change"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <!-- 搜索订单号 -->
      <div class="order-search">
        <el-form-item label="订单号：">
          <el-input
            placeholder="请输入订单号"
            v-model="requestData.orderNo"
            class="nicknameInput"
            size="medium"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="orderNo_click"
            ></el-button>
          </el-input>
        </el-form-item>
      </div>
    </el-form>

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
        style="width: 100%;"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in tableTitle"
          :key="index"
          :min-width="item.minWidth"
        ></el-table-column>

        <!-- 商品信息 -->
        <el-table-column label="商品信息" width="600">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.productList"
              :key="index"
              class="goods-info"
            >
              <img :src="item.info.image" />
              <span>{{ item.info.productName }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <span
              class="el-dropdown-link"
              @click="send_click(scope.row)"
              v-show="scope.row.statusStr['value'] == '未发货'"
            >
              发送货
            </span>

            <el-dropdown trigger="click" @command="dropdown_click">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="`订单详情,${scope.row.orderId}`">
                  订单详情
                </el-dropdown-item>
                <el-dropdown-item :command="`订单记录,${scope.row.orderId}`">
                  订单记录
                </el-dropdown-item>
                <el-dropdown-item :command="`订单备注,${scope.row.orderId}`">
                  订单备注
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestData.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="requestData.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible">
      <!-- 发送货弹窗 -->
      <div class="form-send-wrap" v-show="isShowSendDialogAll">
        <p class="title">发送货</p>
        <el-form
          :model="formData"
          ref="formData"
          label-width="200px"
          class="demo-ruleForm"
          label-position="right"
          size="medium"
        >
          <el-form-item label="选择类型：">
            <el-radio-group v-model="formData.type">
              <el-radio :label="1">发货</el-radio>
              <el-radio :label="2">送货</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 选择发货显示 -->
          <div class="send" v-show="isShowSendDialog[0]">
            <el-form-item label="发货类型：" prop="expressRecordType">
              <el-radio-group v-model="formData.expressRecordType">
                <el-radio label="normal">手动填写</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="快递公司：" prop="expressCode">
              <el-select v-model="formData.expressCode" placeholder="请选择">
                <el-option
                  :label="item.name"
                  :value="item.code"
                  v-for="(item, index) in companyData"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>

            <div class="input-wrap">
              <el-form-item label="快递单号：" prop="expressNumber">
                <el-input
                  v-model="formData.expressNumber"
                  placeholder="请输入快递单号"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <!-- 选择送货显示 -->
          <div div class="send2" v-show="isShowSendDialog[1]">
            <div class="input-wrap">
              <el-form-item label="送货人姓名：" prop="deliveryName">
                <el-input
                  v-model="formData.deliveryName"
                  placeholder="请输入送货人姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="送货人手机号：" prop="deliveryTel">
                <el-input
                  v-model="formData.deliveryTel"
                  placeholder="请输入送货人电话"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 按钮们 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              提交
            </el-button>
            <el-button @click="dialogTableVisible = false">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 订单详情 -->
      <div class="order-info" v-show="isShow[0]">
        <p class="title">订单详情</p>
        <div class="info-wrap">
          <div>
            <p class="title-inner">用户信息</p>
            <p>用户昵称：{{ infoData.nikeName }}</p>
          </div>
          <div>绑定电话：{{ infoData.phone }}</div>
        </div>
        <div class="info-wrap">
          <div>
            <p class="title-inner">收货信息</p>
            <p>收货人：{{ infoData.realName }}</p>
            <p>收货地址：{{ infoData.userAddress }}</p>
          </div>
          <div>收货电话：{{ infoData.userPhone }}</div>
        </div>
        <div class="info-wrap">
          <div>
            <p class="title-inner">订单信息</p>
            <p>订单编号：{{ infoData.orderId }}</p>
            <p>商品总数：{{ infoData.totalNum }}</p>
            <p>支付邮费：{{ infoData.payPostage }}</p>
            <p>实际支付：{{ infoData.payPrice }}</p>
            <p>退款金额：{{ infoData.refundPrice }}</p>
            <p>支付方式：{{ infoData.payTypeStr }}</p>
            <p>商家备注：{{ infoData.remark }}</p>
          </div>
          <div>
            <p class="statusStr">订单状态：{{ statusStr.value }}</p>
            <p>商品总价：{{ infoData.proTotalPrice }}</p>
            <p>优惠券金额：{{ infoData.couponPrice }}</p>
            <p>抵扣金额：{{ infoData.deductionPrice }}</p>
            <p>创建时间：{{ infoData.createTime }}</p>
            <p>推广人：-</p>
          </div>
        </div>
      </div>

      <!-- 操作记录 -->
      <div class="order-notes" v-show="isShow[1]">
        <p class="title">操作记录</p>
        <el-table :data="gridData" border>
          <el-table-column
            property="oid"
            label="ID"
            width="80"
          ></el-table-column>
          <el-table-column
            property="changeMessage"
            label="操作记录"
          ></el-table-column>
          <el-table-column
            property="createTime"
            label="操作时间"
          ></el-table-column>
        </el-table>
      </div>

      <!-- 订单备注 -->
      <div class="order-textarea" v-show="isShow[2]">
        <p class="title">订单备注</p>
        <p class="textarea">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入订单备注"
            v-model="addMarkParams.mark"
          ></el-input>
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="btn_click">
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <footer>
      test
    </footer>
  </div>
</template>

<script>
import {
  getOrderList,
  getOrderNum,
  getOrderInfo,
  getOrderNotes,
  addOrderMark,
  getCompanyList,
  getSendPerson,
  send,
} from '@/network/api/order-ml/order'

import { Message } from 'element-ui'

export default {
  name: 'Order',
  components: {},
  data() {
    return {
      companyData: [],
      isShowSendDialog: [true, false, false],
      isShowSendDialogAll: false,
      sendOrderId: '',
      formData: {
        deliveryName: '',
        deliveryTel: '',
        type: 1,
        expressRecordType: 'normal',
        expressCode: '',
        expressNumber: '',
        orderNo: '',
        toAddr: '',
        toTel: '',
        yesterday:''
      },
      dialogTableVisible: false,
      gridData: [],
      infoData: [],
      statusStr: '',
      radioChecked: '全部',
      radioText: [
        '全部',
        '今天',
        '昨天',
        '最近7天',
        '最近30天',
        '本月',
        '本年',
      ],
      radioText2: [
        '',
        'today',
        'yesterday',
        'lately7',
        'lately30',
        'month',
        'year',
      ],
      dateValue: '',
      radioCheckedTop: '',
      radioTextTop: [],
      radioTextTop2: [
        'all',
        'unPaid',
        'notShipped',
        'spike',
        'bargain',
        'complete',
        'toBeWrittenOff',
        'refunding',
        'refunded',
        'deleted',
      ],
      radioIndex: 0,
      requestData: {
        status: 'all',
        dateLimit: '',
        orderNo: '',
        page: 1,
        limit: 10,
        type: 0,
      },
      requestNumParams: {
        dateLimit: '',
        type: 0,
      },
      // 表格的
      tableData: [],
      tableTitle: [
        {
          prop: 'orderId',
          label: '订单号',
          minWidth: '250',
        },
        {
          prop: 'orderType',
          label: '订单类型',
        },
        {
          prop: 'realName',
          label: '收货人',
        },
        {
          prop: 'payPrice',
          label: '实际支付',
        },
        {
          prop: 'payTypeStr',
          label: '支付方式',
        },
        {
          prop: 'statusStr.value',
          label: '订单状态',
        },
        {
          prop: 'createTime',
          label: '下单时间',
          minWidth: '200',
        },
      ],
      total: 1,
      isShow: [false, false, false],
      addMarkParams: {
        orderNo: '',
        mark: '',
      },
    }
  },
  async created() {
    let res = await getOrderNum(this.requestNumParams)
    this.updateTop(res)
    this.radioCheckedTop = this.radioTextTop[0]
    this.getOrderListFn()
  },
  computed: {},
  methods: {
    // 发送货点击
    async send_click(row) {
      this.dialogTableVisible = true // 显示弹窗
      this.isShowSendDialogAll = true // 显示发送货信息
      this.isShowSendDialog = [true, false, false]
      this.isShow = [false, false, false] // 控制更多下拉框展示信息
      this.getCompanyListFn()
      // 获取发货人基本信息
      let res = await getSendPerson()
      let { exportToAddress, exportToName, exportToTel } = res.data.data
      this.formData.toAddr = exportToAddress
      this.formData.toName = exportToName
      this.formData.toTel = exportToTel
      this.formData.orderNo = row.orderId
    },
    // 表单提交
    async submitForm() {
      if (this.formData.type == 2) {
        if (this.formData.deliveryTel.length < 11) {
          Message({
            type: 'error',
            message: '操作失败！请输入正确发货人手机号格式',
          })
          return
        }
      }
      this.formData.expressRecordType == 'normal'
        ? (this.formData.expressRecordType = 1)
        : (this.formData.expressRecordType = 2)
      await send(this.formData)
      Message({
        type: 'success',
        message: '发货成功！',
      })
      this.$refs['formData'].resetFields()
      this.dialogTableVisible = false
      this.getOrderListFn()
    },
    // 拿到快递公司列表
    async getCompanyListFn() {
      let res = await getCompanyList({ type: this.formData.expressRecordType })
      this.companyData = res.data.data
    },
    // 打开弹窗
    async dropdown_click(command) {
      this.isShowSendDialogAll = false
      // console.log(command) // '订单详情,order45549166775281753818331'
      if (command.split(',')[0] == '订单详情') {
        this.isShowSendDialog = [false, false, false]
        this.isShow = [true, false, false]
        let res = await getOrderInfo({ orderNo: command.split(',')[1] })
        this.infoData = res.data.data
        this.statusStr = res.data.data.statusStr
      } else if (command.split(',')[0] == '订单记录') {
        this.isShowSendDialog = [false, false, false]
        this.isShow = [false, true, false]
        let res = await getOrderNotes(command.split(',')[1])
        this.gridData = res.data.data.list
      } else if (command.split(',')[0] == '订单备注') {
        this.isShowSendDialog = [false, false, false]
        this.isShow = [false, false, true]
        this.addMarkParams.orderNo = command.split(',')[1]
      }
      this.dialogTableVisible = true
    },
    radioChecked_change(radioLabel) {
      // 清空日期选中
      this.dateValue = ''
      // 转值并存值
      this.requestData.dateLimit = this.radioText2[
        this.radioText.indexOf(radioLabel)
      ]
      this.requestNumParams.dateLimit = this.radioText2[
        this.radioText.indexOf(radioLabel)
      ]
      this.getOrderListFn()
      this.getOrderNumFn()
    },
    radioCheckedTop_change(radioLabelTop) {
      this.requestData.status = this.radioTextTop2[
        this.radioTextTop.indexOf(radioLabelTop)
      ]
      this.radioIndex = this.radioTextTop.indexOf(radioLabelTop)
      this.getOrderListFn()
    },
    date_change(value) {
      // 清空按钮选中
      this.radioChecked = ''
      // 加工日期数据并存值
      if (value) {
        this.requestData.dateLimit = this.makeDate(value)
        this.requestNumParams.dateLimit = this.makeDate(value)
      } else {
        this.requestData.dateLimit = ''
        this.requestNumParams.dateLimit = ''
      }
      this.getOrderListFn()
      this.getOrderNumFn()
    },
    orderNo_click() {
      this.requestData.page = 1
      this.getOrderListFn()
    },
    async getOrderListFn() {
      let res = await getOrderList(this.requestData)
      this.tableData = res.data.data.list
      this.total = res.data.data.total
    },
    async getOrderNumFn() {
      let res = await getOrderNum(this.requestNumParams)
      this.updateTop(res)
      this.radioCheckedTop = this.radioTextTop[this.radioIndex]
    },
    // 加工日期数据
    makeDate(dateValue) {
      let newDate = ''
      dateValue.forEach((item, index) => {
        for (let ite of new Date(item).toLocaleDateString()) {
          if (ite == '/') {
            newDate += '-'
          } else {
            newDate += ite
          }
        }
        if (index != dateValue.length - 1) {
          newDate += ','
        }
      })
      return newDate
    },
    updateTop(res) {
      this.radioTextTop = [
        `全部 ${res.data.data.all}`,
        `未支付 ${res.data.data.unPaid}`,
        `未发货 ${res.data.data.notShipped}`,
        `待收货 ${res.data.data.spike}`,
        `待评价 ${res.data.data.bargain}`,
        `交易完成 ${res.data.data.complete}`,
        `待核销 ${res.data.data.toBeWrittenOff}`,
        `退款中 ${res.data.data.refunding}`,
        `已退款 ${res.data.data.refunded}`,
        `已删除 ${res.data.data.deleted}`,
      ]
    },
    // 分页的：
    // 每页几条事件
    handleSizeChange(val) {
      this.requestData.limit = val
      this.getOrderListFn()
    },
    // 当前哪页事件
    handleCurrentChange(val) {
      this.requestData.page = val
      this.getOrderListFn()
    },
    // 添加备注确认
    async btn_click() {
      if (this.addMarkParams.mark) {
        await addOrderMark(this.addMarkParams)
        Message({
          type: 'success',
          message: '备注添加成功',
        })
        this.dialogTableVisible = false
      } else {
        Message({
          type: 'warning',
          message: '备注不能为空！',
        })
      }
    },
  },
  watch: {
    'formData.type': {
      handler(newValue) {
        if (newValue == 1) {
          this.$refs['formData'].resetFields()
          this.isShowSendDialog = [true, false, false]
        } else if (newValue == 2) {
          this.isShowSendDialog = [false, true, false]
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.el-date {
  margin-left: 20px;
}
img {
  width: 30px;
}
.goods-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  span {
    white-space: nowrap;
    margin-left: 10px;
  }
}

#order {
  padding: 20px 30px;
}
.table-wrap {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.order-search {
  width: 600px;
}

.pagination-wrap {
  padding-top: 20px;
  text-align: right;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-right: 5px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.title {
  font-size: 20px;
  padding: 20px 0;
  margin-top: -50px;
}
.info-wrap {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  > div {
    width: 49%;
  }
  .title-inner {
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .statusStr {
    color: orangered;
  }
  p {
    padding: 5px 0;
  }
}
.order-textarea {
  width: 400px;
  margin: 0 auto;
  padding-top: 20px;
  p {
    padding: 0;
  }
  .textarea {
    margin-top: 30px;
  }
  .dialog-footer {
    padding-top: 20px;
    text-align: right;
  }
}
.input-wrap {
  width: 450px;
}
.dialog-wrap {
  border: 10px solid red;
}
</style>
