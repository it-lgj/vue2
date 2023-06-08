<template>
  <div id="record">
    <div class="record-wrap">
      <!-- 表单 -->
      <el-form label-position="right" class="el-form" inline>
        <el-form-item label="使用状态：" label-width="120px">
          <el-select
            v-model="requestParams.status"
            placeholder="请选择一个状态"
            clearable
          >
            <el-option label="未使用" :value="0"></el-option>
            <el-option label="已使用" :value="1"></el-option>
            <el-option label="已过期" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="领取人：" label-width="130px">
          <el-input
            placeholder="请输入领取人"
            v-model="requestParams.uid"
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

        <el-form-item label="优惠劵：" label-width="130px">
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
      <!-- 表格 -->
      <el-table
        :data="tableData"
        :style="{
          width: '100%',
          paddingTop: '30px',
          paddingLeft: '30px',
          fontSize: '12px',
        }"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          v-for="(item, index) in tableTitle"
          :key="index"
        ></el-table-column>

        <!-- 获取方式 -->
        <el-table-column label="获取方式" width="80">
          <template slot-scope="scope">
            {{
              (scope.row.type == 'buy' && '买商品赠送') ||
              (scope.row.type == 'send' && '系统发送') ||
              (scope.row.type == 'receive' && '手动领取')
            }}
          </template>
        </el-table-column>

        <!-- 是否可用 -->
        <el-table-column label="是否可用" width="80">
          <template slot-scope="scope">
            {{(scope.row.validStr)}}
            <i class="el-icon-check" v-show="!scope.row.validStr"></i>
            <i class="el-icon-close" v-show="scope.row.validStr"></i>
          </template>
        </el-table-column>

        <!-- 是否可用 -->
        <el-table-column label="使用状态" width="80">
          <template slot-scope="scope">
            {{
              (scope.row.status == 0 && '未使用') ||
              (scope.row.status == 1 && '已使用') ||
              (scope.row.status == 2 && '已失效')
            }}
          </template>
        </el-table-column>
=======
        <!-- <el-table-column label="获取方式" min-width="100px">
          <template slot-scope="scope">
            <p>{{ scope.row.type }}</p>
          </template>
        </el-table-column> -->
>>>>>>> 6aede27cc402c3871b949ac6318cc5d422b15a00
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="requestParams.page"
          :page-sizes="[10, 30, 60]"
          :page-size="requestParams.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getHasCouponUser, getUserNickname } from '@/network/api/coupon/coupon'

export default {
  name: 'Record',
  components: {},
  data() {
    return {
      requestParams: {
        limit: 10,
        page: 1,
        name: '',
        status: '',
        uid: '',
      },
      total: 1,
      tableData: [],
      tableTitle: [
        {
          prop: 'couponId',
          label: '优惠券ID',
          width: '100',
        },
        {
          prop: 'name',
          label: '优惠券名称',
          width: '150',
        },
        {
          prop: 'nickname',
          label: '领取人',
          width: '130',
        },
        {
          prop: 'money',
          label: '面值',
          width: '100',
        },
        {
          prop: 'minPrice',
          label: '最低消费额',
          width: '120',
        },
        {
          prop: 'createTime',
          label: '开始使用时间',
          width: '200',
        },
        {
          prop: 'endTime',
          label: '结束使用时间',
          width: '200',
        },
      ],
      // 提示框数据请求参数
      inputListParams: {
        limit: 100,
        page: 1,
        keywords: '',
      },
      // 提示框数据
      restaurants: [],
    }
  },
  created() {
    this.getData()
  },
  computed: {},
  methods: {
    async getData() {
      let res = await getHasCouponUser(this.requestParams)
      this.tableData = res.data.data.list
      this.total = res.data.data.total
    },
    // 搜索领取人，提示框
    async querySearch(queryString, cb) {
      let res = await getUserNickname(this.inputListParams)
      cb(res.data.data.list)
    },
    // 搜索领取人，提示框点击后，重新渲染页面
    handleSelect(item) {
      this.inputListParams.keywords = item.nickname
      this.requestParams.uid = item.uid
      this.getData()
    },
    // 搜索优惠券名
    search_click() {
      this.getData()
    },
    // 分页的：
    // 每页几条事件
    handleSizeChange(val) {
      this.requestParams.limit = val
      this.getData()
    },
    // 当前哪页事件
    handleCurrentChange(val) {
      this.requestParams.page = val
      this.getData()
    },
  },
  watch: {
    // 下拉框选择未开启 或 已开启后，请求新数据
    'requestParams.status': {
      handler(newValue) {
        this.requestParams.status = newValue
        this.getData()
      },
    },
    // 监视搜索领取人input为空，重新拿数据
    'inputListParams.keywords': {
      handler(newValue) {
        if (!newValue) {
          this.requestParams.uid = newValue
          this.getData()
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.record-wrap {
  background-color: white;
  padding: 20px 10px;
  box-sizing: border-box;
}
.pagination-wrap {
  margin-top: 40px;
  margin-left: 30px;
}
</style>
