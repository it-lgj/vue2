<template>
  <div id="seckillGoods">
    <div class="up">
      <div class="option">
        <div>
          <span>是否显示:</span
          ><SelectBoxBase @getVal="getSelectVal"></SelectBoxBase>
        </div>
        <div>
          <span>配置名称:</span
          ><SelectBoxBase :optionsData="configData"></SelectBoxBase>
        </div>
        <div>
          <span>商品搜索:</span
          ><SearchBoxBase
            placeholderData="请输入商品ID/名称"
            @getVal="getSearchVal"
          ></SearchBoxBase>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" size="small">添加秒杀配置</el-button>
      </div>
    </div>
    <div class="down">
      <div class="goodsSeckillTable">
        <el-table
          :data="goodsSeckillTable"
          style="width: 100%"
          max-height="400px"
          :row-style="{ height: '40px' }"
          :cell-style="{ padding: '0px ' }"
        >
          <el-table-column prop="id" label="ID" width="40"></el-table-column>
          <el-table-column label="配置" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.storeSeckillManagerResponse.name }}</div>
              <div>{{ scope.row.startTime }}-{{ scope.row.stopTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentTime"
            label="秒杀时段"
            width="100"
          ></el-table-column>
          <el-table-column prop="image" label="商品图片" width="70">
            <template slot-scope="scope">
              <div class="goodsImg">
                <img :src="scope.row.image" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="title"
            label="商品标题"
            width="260"
          >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="info"
            label="活动简介"
            width="260"
          ></el-table-column>
          <el-table-column
            prop="otPrice"
            label="原件"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="秒杀价"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="quota"
            label="限量"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="quotaShow"
            label="限量剩余"
            width="70"
          ></el-table-column>
          <el-table-column prop="statusName" label="秒杀状态" width="70">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="150">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
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
  getSeckillGoods,
  getSeckillGoodsStatus,
  seckillSelect,
  seckillGoodsDelete,
} from "@/network/api/marketingApi/seckillApi.js";
export default {
  name: "SeckillGoods",
  components: {
    SearchBoxBase,
    SelectBoxBase,
  },
  data() {
    return {
      goodsSeckillTable: [], //表格数据
      pagination: {
        page: 1, //当前页
        limit: 10, // 条/页
        total: 50, //总条数
      },
      test:2,
      configData: [], //配置下拉选项数据
    };
  },
  created() {
    let { page, limit } = this.pagination;
    this.getSeckillGoodsList(page, limit);
    this.getseckillSelect(page, limit);
  },
  methods: {
    //获取下拉选项值,并筛选显示项
    getSelectVal(args) {
      //执行初始化的请求
      let { page, limit } = this.pagination;
      this.getSeckillGoodsList(page, limit, args);
    },
    //获取搜索值，并筛选显示项
    getSearchVal(args) {
      let { page, limit } = this.pagination;
      this.getSeckillGoodsList(page, limit, "", args);
    },
    //获取秒杀商品列表
    async getSeckillGoodsList(page, limit, status, keywords) {
      let goodsRes = await getSeckillGoods(page, limit, status, keywords);
      // console.log(listRes);
      this.goodsSeckillTable = goodsRes.data.data.list;
      this.pagination.total = goodsRes.data.data.total;
    },
    //获取配置名称下拉选项
    async getseckillSelect(page, limit) {
      let selRes = await seckillSelect(page, limit);
      let selList = selRes.data.data.list;
      selList.forEach((item) => {
        let obj = {
          value: item.time,
          label: `${item.name}-${item.time}`,
        };
        this.configData.push(obj);
      });
    },
    //商品秒杀状态判断
    async seckillState(data) {
      let stateRes = await getSeckillGoodsStatus(data.id, data.status);
      // console.log(stateRes);
      if (stateRes.data.code == 200) {
        Message.success("修改成功");
      } else {
        Message.error("修改失败");
      }
    },
    //删除秒杀项
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
        let delRes = await seckillGoodsDelete(id);
        console.log(delRes);
        if (delRes.data.code == 200) {
          let { page, limit } = this.pagination;
          this.getSeckillGoodsList(page, limit);
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
      this.getSeckillGoodsList(page, limit);
    },
    //获取当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      let { page, limit } = this.pagination;
      this.getSeckillGoodsList(page, limit);
    },
  },
};
</script>

<style lang="scss">
#seckillGoods {
  @include fullscreen;
  width: 1120px;
  border: 1px solid $marketing-border-color;
  background-color: white;
  border-radius: 5px;
  .up {
    height: 190px;
    border-bottom: 1px solid $marketing-border-color;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .option {
      height: 110px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
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
    .goodsSeckillTable {
      .goodsImg {
        img {
          width: 40px;
          height: 40px;
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
