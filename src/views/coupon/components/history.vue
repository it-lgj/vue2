<template>
  <div id="receiveHistory">
    <el-dialog title="领取记录" :visible.sync="dialogTableVisible">
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column property="nickname" label="用户名"></el-table-column>

        <el-table-column label="用户头像">
          <template slot-scope="scope">
            <el-image
              style="width: 30px;"

              :src="scope.row.avatar"
              :preview-src-list="srcList"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column
          property="createTime"
          label="领取时间"
          width="200"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ReceiveHistory',
  components: {},
  data() {
    return {
      gridData: [],
      dialogTableVisible: false,
      tableData: [],
      srcList: [],
    }
  },
  created() {},
  computed: {},
  methods: {},
  watch: {
    tableData(newVale) {
      if (newVale) {
        let arr = []
        newVale.forEach((item) => {
          arr.push(item.avatar)
        })
        this.srcList = arr
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
