<template>
  <!-- 商品评论页面 -->
  <div class="comment">
    <!-- 功能区 -->
    <div class="store-top">
      <div class="top1">
        <!-- 时间筛选 -->
        <span>时间选择: </span>
        <el-radio-group v-model="nowTime" @change="changeReplyList">
          <el-radio-button
            v-for="(item, index) in timecheckList"
            :key="index"
            :label="item.time"
            >{{ item.name }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="top2">
        <!-- 选择器 -->
        <span>评价状态: </span>
        <el-select
          v-model="nowisReply"
          placeholder="请选择"
          clearable
          @change="changeReplyList"
          style="width: 300px"
        >
          <el-option
            v-for="(item, index) in isReplylist"
            :key="index"
            :label="item.name"
            :value="item.state"
          >
          </el-option>
        </el-select>
        <!-- 搜索框 -->
        <span>商品搜索: </span>
        <el-input
          placeholder="请输入商品名称、关键字、商品ID"
          clearable
          v-model="nowProduct"
          @change="changeReplyList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeReplyList"
          ></el-button>
        </el-input>
      </div>
      <div class="top3">
        <span>用户名称: </span>
        <el-input
          placeholder="请输入用户名称"
          clearable
          v-model="nowNickname"
          @change="changeReplyList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeReplyList"
          >
          </el-button>
        </el-input>
        <el-button size="medium" type="primary" plain style="margin-left: 60px"
          >添加虚拟评论</el-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="store-table">
      <el-table :data="replyList" style="width: 100%" class="store-table">
        <el-table-column prop="id" label="ID" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="storeProduct.storeName"
          label="商品信息"
          width="400"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="nickname" label="用户名称" width="100">
        </el-table-column>
        <el-table-column
          prop="productScore"
          label="商品评分"
          width="70"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="serviceScore"
          label="服务评分"
          width="70"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="comment"
          label="评价内容"
          width="250"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="merchantReplyContent"
          label="回复内容"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="评价时间"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          fixed="right"
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="dialogBox(scope.row.id, scope.row.storeProduct.storeName)"
            >
              回复
            </el-button>

            <el-button type="text" size="small"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      >
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog title="评论回复" :visible.sync="dialogShow">
      <div>
        <div class="box">
          <div>
            <span>用户名称 :</span>
            <span>{{ replyInfoData.nickname }}</span>
          </div>
          <div>
            <span>商品名称 :</span>
            <span>{{ goodname }}</span>
          </div>
          <span>用户评论 :</span>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入回复"
            v-model="replyInfoData.comment || nullcom"
            readonly
          >
          </el-input>
        </div>
        <div class="form">
          <div>
            <span>输入回复 :</span>
          </div>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入回复"
            v-model="replydata"
          >
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="submitCom(replyInfoData.id)">
          回 复
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import {
  getReplyList,
  getreplyInfo,
  postreplycomment,
} from "@/network/api/shop";
export default {
  data() {
    return {
      timecheckList: [
        { name: "全部", time: null },
        { name: "今天", time: "today" },
        { name: "昨天", time: "yesterday" },
        { name: "最近7天", time: "lately7" },
        { name: "最近30天", time: "lately30" },
        { name: "本月", time: "month" },
        { name: "今年", time: "year" },
      ],
      isReplylist: [
        { name: "已回复", state: 1 },
        { name: "未回复", state: 0 },
      ],
      replyList: [],
      nowTime: null,
      nowisReply: null,
      nowNickname: "",
      nowProduct: "",
      dialogShow: false,
      replyInfoData: {},
      goodname: "",
      nullcom: "暂无评论",
      replydata: "",

      page: 1, //当前页
      limit: 5, //显示多少条
      totle: null,
    };
  },
  async created() {
    // 加载评论数据
    let resgetReplyList = await getReplyList(
      null,
      null,
      null,
      null,
      this.page,
      this.limit
    );
    this.replyList = resgetReplyList.data.data.list;
    this.totle = resgetReplyList.data.data.total;
  },
  methods: {
    // 列表筛选
    async changeReplyList() {
      let resgetReplyList = await getReplyList(
        this.nowTime,
        this.nowisReply,
        this.nowNickname,
        this.nowProduct,
        this.page,
        this.limit
      );
      this.replyList = resgetReplyList.data.data.list;
      this.totle = resgetReplyList.data.data.total;
      console.log(this.replyList);
    },

    // 打开弹窗
    async dialogBox(id, name) {
      this.dialogShow = !this.dialogShow;
      let resgetreplyInfo = await getreplyInfo(id);
      this.replyInfoData = resgetreplyInfo.data.data;
      this.goodname = name;
    },

    // 评论回复
    async submitCom(id) {
      if (this.replydata.trim().length) {
        await postreplycomment(this.replydata, id);
        this.dialogShow = !this.dialogShow;
        let resgetReplyList = await getReplyList(
          this.nowTime,
          this.nowisReply,
          this.nowNickname
        );
        Message({
          showClose: true,
          message: "回复成功",
          type: "success",
        });
        this.replyList = resgetReplyList.data.data.list;
      } else {
        Message({
          showClose: true,
          message: "内容不能为空",
          type: "error",
        });
      }
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.changeReplyList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.changeReplyList();
    },
  },
  watch: {
    dialogShow: function (newQuestion, oldQuestion) {
      this.replydata = "";
    },
  },
};
</script>

<style scoped lang="scss">
.comment {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  transition: width 0.3s ease-in-out;

  .store-top {
    margin-bottom: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6ebf5;
    .top1 {
      height: 40px;
      margin-bottom: 7px;
    }
    .top2 > div {
      margin: 7px 0;
      margin-right: 60px;
    }
    .top2 {
      margin: 7px 0;
    }
    .el-input {
      width: 300px;
    }
  }

  .el-table {
    font-size: 10px;
    .switch-span {
      color: #1890ff;
      margin-left: 5px;
    }
    .infoSpan,
    .deleteSpan {
      color: #46a6ff;
      margin: 0 3px;
      cursor: pointer;
    }
    .infoSpan:hover,
    .deleteSpan:hover {
      color: #f56c6ced;
    }
  }

  .pagination {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }
}
</style>