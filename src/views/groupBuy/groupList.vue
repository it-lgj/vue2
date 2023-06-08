<template>
  <div id="groupList">
    <div class="statistics">
      <div class="partakeCount">
        <div>
          <span class="el-icon-user-solid"></span>
        </div>
        <dl>
          <dt>参与人数</dt>
          <dd>{{ countPeople }}</dd>
        </dl>
      </div>
      <div class="groupCount">
        <div>
          <span class="el-icon-sell"></span>
        </div>
        <dl>
          <dt>成团数量（个）</dt>
          <dd>{{ countTeam }}</dd>
        </dl>
      </div>
    </div>
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
          :data="groupList"
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
            label="开团团长"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="addTime"
            label="开团时间"
            width="150"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="title"
            label="拼团商品"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="countPeople"
            label="几人团"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="people"
            label="几人参加"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="stopTime"
            label="结束时间"
            width="160"
          ></el-table-column>
          <el-table-column prop="status" label="拼团状态" width="80">
            <template slot-scope="scope">
              <el-button type="text">{{
                (scope.row.status == 1 && "进行中") ||
                (scope.row.status == 2 && "已完成") ||
                (scope.row.status == 3 && "未成功")
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="getGroupDetails(scope.row.id)"
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
                  prop="id"
                  label="ID"
                  width="40"
                ></el-table-column>
                <el-table-column prop="avatar" label="头像" width="60">
                  <template slot-scope="scope">
                    <div class="userAvatarDetail">
                      <img :src="scope.row.avatar" alt="" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickname"
                  label="用户名称"
                  width="120"
                ></el-table-column>
                <el-table-column
                  prop="orderId"
                  label="订单编号"
                  width="260"
                ></el-table-column>
                <el-table-column
                  prop="totalPrice"
                  label="金额"
                  width="90"
                ></el-table-column>
                <el-table-column
                  prop="refundStatus"
                  label="订单状态"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span>{{
                      (scope.row.refundStatus == 0 && "未退款") ||
                      (scope.row.refundStatus == 1 && "申请中") ||
                      (scope.row.refundStatus == 2 && "已退款") ||
                      (scope.row.refundStatus == 3 && "退款中")
                    }}</span>
                  </template>
                </el-table-column>
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
  getGroupList,
  getGroupInfo,
  getGroupStatistics,
} from "@/network/api/marketingApi/groupApi.js";
export default {
  name: "GroupList",
  components: {
    SelectBoxBase,
    SearchBoxBase,
  },
  data() {
    return {
      groupList: [], //表格列表
      viewDetails: [], //查看详情
      timeLimitVal: "", //时限选项
      dateLimitVal: "", //日期选项
      status: "", //砍价状态
      dialogTableVisible: false, //控制弹出对话框
      countPeople: "", //参与人数
      countTeam: "", //成团数量
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
          label: "已完成",
        },
        {
          value: 3,
          label: "未完成",
        },
      ],
    };
  },
  created() {
    let { page, limit } = this.pagination;
    let { timeLimitVal, status } = this;
    this.getGroupTable(page, limit, status, timeLimitVal);
    this.getGroupCount();
  },
  methods: {
    //获取砍价列表
    async getGroupTable(page, limit, status, dateLimit) {
      let groupRes = await getGroupList(page, limit, status, dateLimit);
      this.groupList = groupRes.data.data.list;
      this.pagination.total = groupRes.data.data.total;
    },
    //时间选项
    timeAt(val) {
      let { page, limit } = this.pagination;
      let { status } = this;
      this.getGroupTable(page, limit, status, val);
    },
    //日期选项
    getDate(val) {
      let time = "";
      val.forEach((item) => {
        time += item + ",";
      });
      let { page, limit } = this.pagination;
      let { status } = this;
      this.getGroupTable(page, limit, status, time);
    },
    //获取下拉选项值,并筛选显示项
    getSelectVal(val) {
      //执行初始化的请求
      let { page, limit } = this.pagination;
      this.getGroupTable(page, limit, val);
    },
    //查看详情
    async getGroupDetails(id) {
      this.dialogTableVisible = true;
      let detRes = await getGroupInfo(id);
      this.viewDetails = detRes.data.data;
    },
    //拼团统计
    async getGroupCount() {
      let countRes = await getGroupStatistics();
      this.countPeople = countRes.data.data.countPeople;
      this.countTeam = countRes.data.data.countTeam;
      //   console.log(countRes);
    },
    // 条/页
    handleSizeChange(val) {
      this.pagination.limit = val;
      let { page, limit } = this.pagination;
      let { timeLimitVal, status } = this;
      this.getGroupTable(page, limit, status, timeLimitVal);
    },
    //当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      let { page, limit } = this.pagination;
      let { timeLimitVal, status } = this;
      this.getGroupTable(page, limit, status, timeLimitVal);
    },
  },
};
</script>

<style lang="scss">
#groupList {
  @include fullscreen;
  width: 1120px;
  border: 1px solid $marketing-border-color;
  background-color: white;
  border-radius: 5px;
  .statistics {
    display: flex;
    box-sizing: border-box;
    padding: 20px 20px 0 20px;
    > div {
      border-radius: 5px;
      width: 250px;
      height: 80px;
      align-items: center;
    }
    .partakeCount {
      margin-right: 20px;
      display: flex;
      box-sizing: border-box;
      padding: 20px;
      border: 1px solid rgb(220, 245, 252);

      div {
        width: 50px;
        height: 50px;
        background: rgb(229, 248, 253);
        border-radius: 5px;
        text-align: center;
        margin-right: 10px;
        .el-icon-user-solid {
          font-size: 30px;
          color: #409eff;
          line-height: 50px;
        }
      }
      dl {
        dd {
          font-weight: 700;
        }
      }
    }
    .groupCount {
      margin-right: 20px;
      display: flex;
      box-sizing: border-box;
      padding: 20px;
      border: 1px solid rgb(251, 226, 255);
      div {
        width: 50px;
        height: 50px;
        background: rgb(251, 232, 254);
        border-radius: 5px;
        text-align: center;
        margin-right: 10px;
        .el-icon-sell {
          font-size: 30px;
          color: #a829d6;
          line-height: 50px;
        }
      }
      dl {
        dd {
          font-weight: 700;
        }
      }
    }
  }
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