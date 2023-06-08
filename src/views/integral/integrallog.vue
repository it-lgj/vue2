<template>
  <div id="integralLog">
    <div class="integralLog-wrap">
      <!-- 表单 -->
      <el-form label-position="right" label-width="150px" class="el-form">
        <el-form-item label="时间选择：" @submit="form_submit()">
          <!-- 一堆按钮 -->
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
          ></el-date-picker>
        </el-form-item>

        <!-- 用户昵称搜索 -->
        <el-form-item label="用户微信昵称：">
          <el-input
            placeholder="请输入用户昵称"
            v-model="requestData.keywords"
            class="nicknameInput"
            size="small"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="nickname_click"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div class="table-wrap">
        <el-table
          :data="tableData"
          :cell-style="{
            minWidth: '200px',
            fontSize: '12px',
          }"
          :header-cell-style="{
            color: '#333',
            fontWeight: 'bold',
          }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :width="item.width"
            v-for="(item, index) in tableTitle"
            :key="index"
            class="my-el-table-column"
          ></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="pageSizes"
          :page-size="requestData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getIntegralLog } from '@/network/api/integral-ml/integral'

export default {
  name: 'IntegralLog',
  components: {},
  data() {
    return {
      // 表单变量
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
      radioChecked: '全部',
      dateValue: '',
      requestData: {
        dateLimit: '',
        keywords: '',
        limit: 10,
        page: 1,
      },
      // 表格变量
      tableData: [],
      tableTitle: [
        {
          prop: 'id',
          label: 'ID',
          sortable: false,
          width: '100',
        },
        {
          prop: 'title',
          label: '标题',
          sortable: false,
        },
        {
          prop: 'balance',
          label: '积分余量',
          sortable: true,
          width: '150',
        },
        {
          prop: 'integral',
          label: '明细数字',
          sortable: true,
          width: '150',
        },
        {
          prop: 'mark',
          label: '备注',
          sortable: false,
        },
        {
          prop: 'nickName',
          label: '用户昵称',
          sortable: false,
        },
        {
          prop: 'updateTime',
          label: '添加时间',
          sortable: false,
        },
      ],
      // 分页变量
      pageSizes: [10, 20, 30, 40],
      currentPage4: 1,
      totalPage: 1,
      total: 0,
    }
  },
  created() {
    this.getIntegralLogList(this.requestData)
  },
  computed: {},
  methods: {
    // 事件函数区-----------------
    // form的：
    // radio的change事件
    radioChecked_change(radioLabel) {
      // 清空日期选中
      this.dateValue = ''
      // 转值并存值
      this.requestData.dateLimit = this.radioText2[
        this.radioText.indexOf(radioLabel)
      ]
      // console.log(this.requestData)
      this.getIntegralLogList(this.requestData)
    },
    // 选择日期change事件
    date_change(value) {
      // 清空按钮选中
      this.radioChecked = ''
      // 加工日期数据并存值
      this.requestData.dateLimit = this.makeDate(value)
      // console.log(this.requestData)
      this.getIntegralLogList(this.requestData)
    },
    // 表单提交事件
    nickname_click() {
      // console.log(this.requestData)
      this.getIntegralLogList(this.requestData)
    },
    // 分页的：
    // 每页几条事件
    handleSizeChange(val) {
      this.requestData.limit = val
      this.getIntegralLogList(this.requestData)
    },
    // 当前哪页事件
    handleCurrentChange(val) {
      this.requestData.page = val
      this.getIntegralLogList(this.requestData)
    },
    // 函数区------------------------
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
    // 拿到积分日志列表数据
    async getIntegralLogList(data) {
      let res = await getIntegralLog(data)
      this.tableData = res.data.data.list
      this.totalPage = res.data.data.totalPage
      this.total = res.data.data.total
    },
  },
}
</script>

<style lang="scss" scoped>
.integralLog-wrap {
  width: 95%;
  background-color: $bgwhite;
  border: 1px solid $border-color-card-top;
  padding: 15px;
  .el-form {
    font-weight: bold;
    .el-date {
      margin-left: 20px;
    }
    .nicknameInput {
      width: 300px;
    }
  }
  .table-wrap {
    border-top: 1px solid $border-color-card-top;
    padding: 30px 0px  30px 30px;
    box-sizing: border-box;
  }
  .pagination-wrap {
    text-align: right;
  }
}
// 改element-UI源码
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
</style>
