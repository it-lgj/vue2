<template>
  <div id="groupGoods">
    <div class="up">
      <div class="option">
        <div>
          <span>拼团状态:</span
          ><SelectBoxBase @getVal="getSelectVal"></SelectBoxBase>
        </div>
        <div><span>商品搜索:</span><SearchBoxBase></SearchBoxBase></div>
      </div>
      <div class="btn">
        <el-button type="primary" size="small">添加砍价商品</el-button>
      </div>
    </div>
    <div class="down">
      <div class="groupGoodsTable">
        <el-table
          :data="groupGoodsTable"
          style="width: 100%"
          max-height="400px"
          :row-style="{ height: '40px' }"
          :cell-style="{ padding: '0px ' }"
        >
          <el-table-column prop="id" label="ID" width="40"></el-table-column>
          <el-table-column prop="image" label="拼团图片" width="70">
            <template slot-scope="scope">
              <div class="goodsImg">
                <img :src="scope.row.image" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="拼团名称"
            width="260"
          ></el-table-column>
          <el-table-column
            prop="otPrice"
            label="原价"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="拼团价"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="countPeople"
            label="拼团人数"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="countPeopleAll"
            label="参与人数"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="countPeoplePink"
            label="成团数量"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="quota"
            label="限量"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="quotaShow"
            label="限量剩余"
            width="100"
          ></el-table-column>
          <el-table-column prop="currentTime" label="结束时间" width="200">
            <template slot-scope="scope">
              <div>
                {{ scope.row.stopTimeStr }}
                {{ new Date(scope.row.stopTime).getHours() }}:{{
                  new Date(scope.row.stopTime).getMinutes()
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isShow" label="拼团状态" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isShow"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                @change="groupState(scope.row)"
                :plain="true"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteConfig(scope.row.id)"
                >删除</el-button
              >
            </template>
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
  getGroupGoodsTable,
  reviseGroupGoodsStatus,
  groupGoodsDelete,
} from "@/network/api/marketingApi/groupApi.js";
export default {
  name: "GroupGoods",
  components: {
    SelectBoxBase,
    SearchBoxBase,
  },
  data() {
    return {
      groupGoodsTable: [],
      pagination: {
        page: 1, //当前页
        limit: 10, // 条/页
        total: 50, //总条数
      },
    };
  },
  created() {
    let { page, limit } = this.pagination;
    this.getGroupGoodsList(page, limit);
  },
  methods: {
    //获取下拉选项值,并筛选显示项
    getSelectVal(args) {
      //执行初始化的请求
      let { page, limit } = this.pagination;
      this.getGroupGoodsList(page, limit, args);
    },
    //获取拼团商品列表
    async getGroupGoodsList(page, limit, isShow) {
      let groupRes = await getGroupGoodsTable(page, limit, isShow);
      this.groupGoodsTable = groupRes.data.data.list;
      this.pagination.total = groupRes.data.data.total;
    },
    //修改砍价商品状态
    async groupState(data) {
      let { id, isShow } = data;
      let stateRes = await reviseGroupGoodsStatus(id, isShow);
      console.log(stateRes);
      if (stateRes.data.code == 200) {
        Message.success("修改成功");
      } else {
        Message.error("修改失败");
      }
    },
    //删除拼团商品
    async deleteConfig(id) {
      console.log(id);
      let confirmRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //提示用户选择并判断
      if (confirmRes == "cancel") {
        return Message.info("已取消删除");
      } else if (confirmRes == "confirm") {
        let delRes = await groupGoodsDelete(id);
        console.log(delRes);
        if (delRes.data.code == 200) {
          let { page, limit } = this.pagination;
          this.getGroupGoodsList(page, limit);
          return Message.success("删除成功");
        } else {
          return Message.error("删除失败");
        }
      }
    },
    // 条/页
    handleSizeChange(val) {
      this.pagination.limit = val;
    },
    //当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
    },
  },
};
</script>

<style lang="scss">
#groupGoods {
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
    .groupGoodsTable {
      .el-table tr {
        color: $marketing-font-color;
      }
      .cell {
        font-size: 12px;
        text-align: center;
      }
      .goodsImg {
        img {
          width: 30px;
          height: 30px;
          margin-top: 6px;
        }
      }
      .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
      }
      .el-switch__label--right {
        text-align: left;
        z-index: 1;
        right: -13px;
        top: -1px; /*不同场景下可能不同，自行调整*/
        span {
          font-size: 12px;
        }
      }
      .el-switch__label--left {
        text-align: left;
        z-index: 1;
        left: 22px; /*不同场景下可能不同，自行调整*/
        top: -1px;
        span {
          font-size: 12px;
        }
      }
      .el-switch__label.is-active {
        display: block;
      }
      .el-switch .el-switch__core,
      .el-switch .el-switch__label {
        width: 60px !important; /*开关按钮的宽度大小*/
      }
    }
    .el-alert--success {
      width: 400px;
      height: 45px;
      position: fixed;
      top: 4%;
      left: 40%;
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
</style>