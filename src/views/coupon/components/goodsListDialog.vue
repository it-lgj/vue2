<!-- 沐斓的 商品列表弹窗 可公用 -->
<template>
  <div id="goodsListDialog">
    <!-- 商品列表弹框 -->
    <div class="dialog-wrap">
      <el-dialog
        title="商品列表"
        :visible.sync="isShow"
        @close="closeDialog_click"
        :lock-scroll="true"
        width="80%"
        top="10px"
        :close-on-click-modal="false"
        @open="open_self"
      >
        <!-- form -->
        <el-form :model="requestParams" :inline="true" size="small">
          <el-form-item label="商品分类：" prop="class">
            <el-cascader
              :options="selectClass"
              clearable
              @change="selectClass_change"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品搜索：" prop="keywords" label-width="100px">
            <el-input v-model="requestParams.keywords">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search_click"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>

        <!-- table-list -->
        <el-table
          ref="multipleTable"
          :data="goodsTableData"
          tooltip-effect="dark"
          @selection-change="checkbox_click"
          :cell-style="{ fontSize: '12px', fontWeight: '400' }"
          :header-cell-style="{
            fontWeight: 'bold',
            color: '#333',
            paddingTop: '50px',
          }"
          :row-key="getRowKey"
        >
          <!-- :reserve-selection="true" -->
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          ></el-table-column>

          <el-table-column label="ID" width="80">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>

          <el-table-column label="商品图" width="80">
            <template slot-scope="scope">
              <el-image
                style="width: 50px;"
                :src="scope.row.image"
                :preview-src-list="srcList"
              ></el-image>
            </template>
          </el-table-column>

          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            v-for="(item, index) in tableTitle"
            :key="index"
          ></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="requestParams.page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="requestParams.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>

        <!-- 确认按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm_click">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCouponClass, getGoodsInfo } from '@/network/api/coupon/coupon'

export default {
  name: 'GoodsListDialog',
  components: {},
  data() {
    return {
      // 是否显示dialog
      isShow: false,
      // 获取商品列表信息请求的参数
      requestParams: {
        cateId: '',
        keywords: '',
        limit: 5,
        page: 1,
        type: 1,
      },
      // 商品分类下拉框数据
      selectClass: [],
      // 商品列表表格表头
      tableTitle: [
        {
          prop: 'storeName',
          label: '商品名称',
          width: '350',
        },
        {
          prop: 'cateValues',
          label: '商品分类',
          width: '350',
        },
      ],
      // 商品列表表格数据
      goodsTableData: [],
      // 图片预览
      srcList: [],
      // 分页
      total: 1,
      // 勾选的商品id们
      checkboxValues: [],
    }
  },
  async created() {
    // 获取商品分类下拉框选项
    let res = await getCouponClass()
    this.selectClass = this.makeClassData(res.data.data)
    // 获取商品列表数据
    this.getTableListDataFn()
  },
  computed: {},
  methods: {
    // 事件--------------------------------
    // 关闭按钮点击事件
    closeDialog_click() {
      this.isShow = false
    },
    open_self() {
      this.getTableListDataFn()
    },
    // 表格的：
    // 选择某分类后，重新渲染页面
    selectClass_change(val) {
      this.requestParams.cateId = val[1]
      this.getTableListDataFn()
    },
    // 搜索某个商品
    search_click() {
      this.getTableListDataFn()
    },
    // 主动勾选一些商品时：
    checkbox_click(val) {
      this.checkboxValues = val
    },
    // 实现默认勾选一些数据
    selectedFn(selectedData) {
      // console.log('selectedData',selectedData);
      let newArr = []
      // let falseArr = []
      selectedData.forEach((selected) => {
        this.goodsTableData.forEach((row) => {
          if (row.id == selected.id) {
            // console.log('一样');
            newArr.push(row)
          } else {
            // falseArr.push(row)
          }
        })
      })
      this.$refs.multipleTable.clearSelection()
      newArr.forEach((row) => {
        console.log('勾上', row)
        this.$refs.multipleTable.toggleRowSelection(row, true)
      })
      // falseArr.forEach((row) => {
      //   console.log('去掉',row);
      //   this.$refs.multipleTable.toggleRowSelection(row, false)
      // })
    },
    // 分页的：
    // 每页几条事件
    handleSizeChange(val) {
      this.requestParams.limit = val
      this.getTableListDataFn()
    },
    // 当前哪页事件
    handleCurrentChange(val) {
      this.requestParams.page = val
      this.getTableListDataFn()
    },
    // 点击确认按钮事件
    confirm_click() {
      this.$parent.selectedGoodsInfo = this.checkboxValues
      this.isShow = false
    },
    // 函数-------------------------
    // 获取商品列表数据
    async getTableListDataFn() {
      let res = await getGoodsInfo(this.requestParams)
      let { list, total } = res.data.data
      this.goodsTableData = list
      this.total = total
      list.forEach((item) => {
        this.srcList.push(item.image)
      })

      // if (this.checkboxValues.length != 0) {
      //   this.selectedFn(this.checkboxValues)
      // }
    },
    // 整理数据，形成商品分类下拉框选项
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
    //
    getRowKey(row) {
      return row.id
    },
  },
}
</script>

<style lang="scss" scoped>
.goods-img {
  width: 50px;
  cursor: pointer;
}
.pagination-wrap {
  text-align: right;
  padding-top: 30px;
}
</style>
