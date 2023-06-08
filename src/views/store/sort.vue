<template>
  <div class="sort">
    <!-- 上方功能区 -->
    <div class="store-top">
      <div class="top1">
        <!-- 选择器 -->
        <span>状态: </span>
        <el-select
          v-model="nowStatus"
          placeholder="请选择"
          @change="categoryTree"
        >
          <el-option
            v-for="(item, index) in statusTree"
            :key="index"
            :label="item.name"
            :value="item.status"
          >
          </el-option>
        </el-select>
        <!-- 搜索框 -->
        <span>名称: </span>
        <el-input
          placeholder="请输入名称"
          v-model="nowName"
          clearable
          @change="searchTree"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchTree"
          ></el-button>
        </el-input>
      </div>
      <div class="top2">
        <el-button size="medium" type="primary" plain @click="addnew"
          >新增产品分类</el-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="store-table">
      <el-table
        :data="listTree"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :tree-props="{ children: 'child', hasChildren: 'pid' }"
        highlight-current-row
      >
        <el-table-column
          prop="name"
          label="分类名称"
          min-width="250"
          align="left"
        >
          <template slot-scope="props">
            <span>{{ props.row.name }}</span>
            <span> | {{ props.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          min-width="150"
          align="center"
        >
          <template slot-scope="props">
            <span>{{
              props.row.type && !props.row.pid ? "产品分类" : "产品子分类"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="extra"
          label="类型图标"
          min-width="150"
          align="center"
        >
          <template slot-scope="props">
            <img :src="props.row.extra" class="table-img" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="150"
          align="center"
        >
          <template slot-scope="props">
            <el-switch
              v-model="props.row.status"
              active-color="#1890ff"
              inactive-color="#dcdfe6"
              @change="updateStatus(props.row.id)"
            >
            </el-switch>
            <span class="switch-span">
              {{ props.row.status ? "显示" : "隐藏" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" min-width="200" align="center">
          <template slot-scope="props">
            <span
              class="infoSpan"
              v-if="!props.row.pid"
              @click="addID(props.row.id)"
            >
              添加子目录
            </span>
            <span class="infoSpan" @click="changeID(props.row.id)">编辑</span>
            <span class="infoSpan" @click="deleteID(props.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框 -->
    <el-dialog title="编辑产品分类" :visible.sync="dialogShow">
      <div class="box">
        <el-form
          ref="getcategoryinfo"
          :model="getcategoryinfo"
          label-width="80px"
        >
          <el-form-item label="分类名称">
            <el-input v-model="getcategoryinfo.name"></el-input>
          </el-form-item>
          <el-form-item label="分类父级">
            <el-input v-model="getcategoryinfo.pidname" disabled></el-input>
          </el-form-item>
          <el-form-item label="分类图标">
            <el-image
              style="width: 30px; height: 30px"
              :src="getcategoryinfo.extra"
              fit="fill"
            ></el-image>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input-number
              v-model="getcategoryinfo.sort"
              :min="0"
              :max="100000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-switch
              v-model="getcategoryinfo.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="Update"> 确 认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getshopTree,
  getStatus,
  getcategoryTree,
  getcategoryinfo,
  postCategoryUpdate,
  postCategorySave,
  getCategorydelete,
} from "@/network/api/shop";
import { MessageBox, Message } from "element-ui";
export default {
  name: "store_sort",
  data() {
    return {
      listP: [],
      dialogShow: false,
      isnothing: false,
      listTree: [], // 分类列表
      nowStatus: -1,
      nowName: null,
      statusTree: [
        { name: "全部", status: -1 },
        { name: "显示", status: 1 },
        { name: "未显示", status: 0 },
      ],
      getcategoryinfo: {},
      addcategory: {},
    };
  },
  async created() {
    // 初次加载商品分类列表
    let resgetshopTree = await getshopTree();
    this.listTree = resgetshopTree.data.data;
    this.listP = resgetshopTree.data.data;
  },
  methods: {
    // 修改分类状态
    async updateStatus(id) {
      console.log(id);
      await getStatus(id).then(() => {
        Message({
          type: "success",
          message: "修改成功!",
        });
      });
    },

    // 删除分类
    async deleteID(id) {
      await getCategorydelete(id).then(() => {
        Message({
          type: "success",
          message: "删除成功!",
        });
      });
      let resgetshopTree = await getshopTree();
      this.listTree = resgetshopTree.data.data;
    },

    // 切换状态列表
    async categoryTree(arr) {
      let resgetcategoryTree = await getcategoryTree(
        this.nowStatus,
        this.nowName
      );
      this.listTree = resgetcategoryTree.data.data;
    },

    // 搜索名称
    async searchTree() {
      let resgetcategoryTree = await getcategoryTree(
        this.nowStatus,
        this.nowName
      );
      this.listTree = resgetcategoryTree.data.data;
    },

    // 新增产品分类
    addnew() {
      this.dialogShow = !this.dialogShow;
      this.isnothing = !this.isnothing;
      this.getcategoryinfo = { sort: 0, type: 1, pid: 0, status: false };
    },

    // 编辑商品分类(打开模态框)
    async changeID(id) {
      let resgetcategoryinfo = await getcategoryinfo(id);
      this.dialogShow = !this.dialogShow;
      this.getcategoryinfo = resgetcategoryinfo.data.data;
    },

    // 添加子分类(打开模态框)
    async addID(pid) {
      this.getcategoryinfo = { sort: 0, type: 1, pid: pid, status: false };
      let resgetcategoryinfo = await getcategoryinfo(pid);
      this.getcategoryinfo.pidname = resgetcategoryinfo.data.data.name;
      this.dialogShow = !this.dialogShow;
    },

    // 编辑商品分类(提交)
    async Update() {
      if (this.getcategoryinfo.id) {
        await postCategoryUpdate(this.getcategoryinfo);
      } else {
        await postCategorySave(this.getcategoryinfo);
      }
      this.dialogShow = !this.dialogShow;
      let resgetshopTree = await getshopTree();
      this.listTree = resgetshopTree.data.data;
    },
  },
};
</script>

<style scoped lang="scss">
.sort {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  transition: width 0.3s ease-in-out;
}
.store-top {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6ebf5;
  .top1 > div {
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
.table-img {
  width: 30px;
  height: 30px;
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
</style>