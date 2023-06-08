<template>
  <div id="bargainList">
    <div class="up">
      <div class="time">
        <div class="timeLimit">
          <span class="text">时间选择:</span>
          <el-radio-group v-model="timeLimitVal" size="small" @change="timeAt">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="lately7">最近7天</el-radio-button>
            <el-radio-button label="lately30">最近30天</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
            <el-radio-button label="year">本年</el-radio-button>
          </el-radio-group>
        </div>
        <div class="dateLimit">
          <el-date-picker
            v-model="dateLimitVal"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            @change="getDate"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="option">
        <div>
          <span>砍价状态:</span
          ><SelectBoxBase
            @getVal="getSelectVal"
            :optionsData="optionsData"
          ></SelectBoxBase>
        </div>
      </div>
    </div>
    <div class="down">
      <div class="bargainGoodsTable">
        <el-table
          :data="bargainList"
          style="width: 100%"
          max-height="400px"
          :row-style="{ height: '40px' }"
          :cell-style="{ padding: '0px ' }"
        >
          <el-table-column prop="id" label="ID" width="40"></el-table-column>
          <el-table-column prop="avatar" label="头像" width="70">
            <template slot-scope="scope">
              <div class="userAvatar">
                <img :src="scope.row.avatar" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="发起用户"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="addTime"
            label="开启时间"
            width="150"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="title"
            label="砍价商品"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="bargainPriceMin"
            label="最低价"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="nowPrice"
            label="当前价"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="peopleNum"
            label="总砍价次数"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="剩余砍价次数"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="dataTime"
            label="结束时间"
            width="160"
          ></el-table-column>
          <el-table-column prop="status" label="砍价状态" width="80">
            <template slot-scope="scope">
              <el-button type="text">{{
                (scope.row.status == 1 && "进行中") ||
                (scope.row.status == 2 && "未完成") ||
                (scope.row.status == 3 && "已成功")
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="getBargainDetails(scope.row.id)"
                >查看详情</el-button
              >
            </template>
            <el-dialog
              title="查看详情"
              :visible.sync="dialogTableVisible"
              :append-to-body="true"
            >
              <el-table
                :data="viewDetails"
                style="width: 100%"
                max-height="250px"
                :row-style="{ height: '40px' }"
                :cell-style="{ padding: '0px ' }"
              >
                <el-table-column
                  prop="bargainId"
                  label="ID"
                  width="80"
                ></el-table-column>
                <el-table-column prop="avatar" label="头像" width="100">
                  <template slot-scope="scope">
                    <div class="userAvatarDetail">
                      <img :src="scope.row.avatar" alt="" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickname"
                  label="用户名称"
                  width="140"
                ></el-table-column>
                <el-table-column
                  prop="price"
                  label="砍价金额"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="addTime"
                  label="砍价时间"
                  width="180"
                ></el-table-column>
              </el-table>
            </el-dialog>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
const SearchBoxBase = () => import("@/components/base/SearchBoxBase.vue");
const SelectBoxBase = () => import("@/components/base/SelectBoxBase.vue");
import {
  getBargainList,
  getBargainInfo,
} from "@/network/api/marketingApi/bargainApi.js";
export default {
  name: "BargainList",
  components: {
    SelectBoxBase,
    SearchBoxBase,
  },
  data() {
    return {
      bargainList: [], //表格列表
      viewDetails: [], //查看详情
      timeLimitVal: "", //时限选项
      dateLimitVal: "", //日期选项
      status: "", //砍价状态
      dialogTableVisible: false, //控制弹出对话框
      pagination: {
        page: 1, //当前页
        limit: 10, // 条/页
        total: 50, //总条数
      },
      optionsData: [
        {
          value: 1,
          label: "进行中",
        },
        {
          value: 2,
          label: "未完成",
        },
        {
          value: 3,
          label: "已完成",
        },
      ],
    };
  },
  created() {
    let { page, limit } = this.pagination;
    let { timeLimitVal, status } = this;
    this.getBargainTable(page, limit, status, timeLimitVal);
  },
  methods: {
    //获取砍价列表
    async getBargainTable(page, limit, status, dateLimit) {
      let barRes = await getBargainList(page, limit, status, dateLimit);
      this.bargainList = barRes.data.data.list;
      this.pagination.total = barRes.data.data.total;
    },
    //时间选项
    timeAt(val) {
      let { page, limit } = this.pagination;
      let { status } = this;
      this.getBargainTable(page, limit, status, val);
    },
    //日期选项
    getDate(val) {
      let time = "";
      val.forEach((item) => {
        time += item + ",";
      });
      let { page, limit } = this.pagination;
      let { status } = this;
      this.getBargainTable(page, limit, status, time);
    },
    //获取下拉选项值,并筛选显示项
    getSelectVal(val) {
      //执行初始化的请求
      let { page, limit } = this.pagination;
      this.getBargainTable(page, limit, val);
    },
    //查看详情
    async getBargainDetails(id) {
      this.dialogTableVisible = true;
      let detRes = await getBargainInfo(id);
      this.viewDetails = detRes.data.data;
      console.log(detRes);
    },
    // 条/页
    handleSizeChange(val) {
      this.pagination.limit = val;
      let { page, limit } = this.pagination;
      let { timeLimitVal, status } = this;
      this.getBargainTable(page, limit, status, timeLimitVal);
    },
    //当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      let { page, limit } = this.pagination;
      let { timeLimitVal, status } = this;
      this.getBargainTable(page, limit, status, timeLimitVal);
    },
  },
};
</script>

<style lang="scss">
#bargainList {
  @include fullscreen;
  width: 1120px;
  border: 1px solid $marketing-border-color;
  background-color: white;
  border-radius: 5px;
  .up {
    height: 130px;
    border-bottom: 1px solid $marketing-border-color;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .time {
      display: flex;
      font-size: 14px;

      .timeLimit {
        margin-right: 20px;
        .text {
          font-weight: 700;
          color: $marketing-font-color;
          margin-right: 10px;
        }
      }
    }
    .option {
      display: flex;
      align-items: center;
    }
    .option > div {
      font-size: 14px;
      font-weight: 700;
      color: $marketing-font-color;
      margin-right: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .option > div {
      display: flex;
    }
    .option > div > span {
      margin-right: 10px;
    }
  }
  .down {
    box-sizing: border-box;
    padding: 10px 20px;
    .bargainGoodsTable {
      .userAvatar {
        img {
          width: 30px;
          height: 30px;
          margin-top: 6px;
        }
      }
      .el-table tr {
        color: $marketing-font-color;
      }
      .cell {
        font-size: 12px;
        text-align: center;
      }
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: end;
      .el-input__inner {
        height: 20px;
      }
    }
  }
}
.el-dialog__body {
  .el-table .el-table__body td.el-table__cell div {
    img {
      width: 30px;
      height: 30px;
      margin-top: 6px;
    }
  }
}
</style>