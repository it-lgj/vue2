<template>
  <div id="seckillSeting">
    <div class="up">
      <!-- 秒杀配置搜索栏 -->
      <div class="option">
        <div>
          <span>是否显示:</span
          ><SelectBoxBase @getVal="getSelectVal"></SelectBoxBase>
        </div>
        <div>
          <span>秒杀名称:</span
          ><SearchBoxBase
            placeholderData="请输入秒杀名称"
            @getVal="getSearchVal"
          ></SearchBoxBase>
        </div>
      </div>
      <!-- 添加秒杀配置 -->
      <div class="btn">
        <el-button type="primary" size="small" @click="dialogFormVisible = true"
          >添加秒杀配置</el-button
        >
        <FormSeckillBase
          :dialogFormVisible_p="dialogFormVisible"
          @closeVal="getClose"
          title="添加数据"
        >
        </FormSeckillBase>
      </div>
    </div>
    <div class="down">
      <!-- 秒杀配置表格 -->
      <div class="setSeckillTable">
        <el-table
          :data="setSeckillTable"
          style="width: 100%"
          max-height="400px"
          :row-style="{ height: '40px' }"
          :cell-style="{ padding: '0px ' }"
        >
          <el-table-column
            prop="id"
            label="ID"
            min-width="60"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="秒杀名称"
            min-width="140"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="秒杀时段"
            min-width="160"
          ></el-table-column>
          <el-table-column prop="silderImgs" label="轮播图" min-width="100">
            <template slot-scope="scope">
              <span
                v-for="item in JSON.parse(scope.row.silderImgs)"
                :key="item.attId"
                class="bannerImg"
              >
                <img :src="item.sattDir" alt="" />
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                active-text="开启"
                inactive-text="关闭"
                @change="seckillState(scope.row)"
                :plain="true"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="200">
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="250" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteConfig(scope.row.id)"
                >删除</el-button
              >
              <el-button type="text" size="small">添加商品</el-button>
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
const FormSeckillBase = () => import("@/components/base/FormSeckillBase.vue");
const UploadBase = () => import("@/components/base/UploadBase.vue");
const SwitchBase = () => import("@/components/base/SwitchBase.vue");

import {
  getSeckilltable,
  getSeckillStatus,
  seckillDelete,
} from "@/network/api/marketingApi/seckillApi.js";
export default {
  name: "SeckillSeting",
  components: {
    SearchBoxBase,
    SelectBoxBase,
    FormSeckillBase,
    UploadBase,
    SwitchBase,
  },
  data() {
    return {
      setSeckillTable: [],
      pagination: {
        page: 1, //当前页
        limit: 10, // 条/页
        total: 50, //总条数
      },
      //添加秒杀配置按钮
      dialogFormVisible: false,
    };
  },
  created() {
    let { page, limit } = this.pagination;
    this.getSeckillList(page, limit);
  },
  methods: {
    //获取下拉选项值,并筛选显示项
    getSelectVal(args) {
      //执行初始化的请求
      let { page, limit } = this.pagination;
      this.getSeckillList(page, limit, args);
    },
    //获取搜索值，并筛选显示项
    getSearchVal(args) {
      let { page, limit } = this.pagination;
      this.getSeckillList(page, limit, "", args);
    },
    //获取秒杀配置列表
    async getSeckillList(page, limit, status, name) {
      let gstRes = await getSeckilltable(page, limit, status, name);
      this.setSeckillTable = gstRes.data.data.list;
      this.pagination.total = gstRes.data.data.total;
    },
    //秒杀配置表格中状态判断
    async seckillState(data) {
      let stateRes = await getSeckillStatus(data.id, data.status);
      s;
      if (stateRes.data.code == 200) {
        Message.success("修改成功");
      } else {
        Message.error("修改失败");
      }
    },
    //删除配置项
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
        let delRes = await seckillDelete(id);
        if (delRes.data.code == 200) {
          let { page, limit } = this.pagination;
          this.getSeckillList(page, limit);
          return Message.success("删除成功");
        } else {
          return Message.error("删除失败");
        }
      }
    },
    //获取条/页
    handleSizeChange(val) {
      this.pagination.limit = val;
      let { page, limit } = this.pagination;
      this.getSeckillList(page, limit);
    },
    //获取当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      let { page, limit } = this.pagination;
      this.getSeckillList(page, limit);
    },
    //获取关闭模态框时DFV的值
    getClose(val) {
      this.dialogFormVisible = val;
    },
  },
};
</script>

<style lang="scss">
#seckillSeting {
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
    .dialog-footer {
      margin-left: 82%;
    }
  }
  .down {
    box-sizing: border-box;
    padding: 10px 20px;
    .setSeckillTable {
      .el-table tr {
        color: $marketing-font-color;
      }
      .cell {
        font-size: 12px;
        text-align: center;
      }
      .bannerImg {
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