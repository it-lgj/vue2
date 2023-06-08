<template>
  <div id="articleManager">
    <div class="title">
      <el-row>
        <el-form label-width="100px" :model="userFrom">
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
              <el-form-item label="文章分类">
                <el-select
                  v-model="userFrom.state"
                  class="selWidth"
                  @change="saveList(userFrom.state)"
                >
                  <el-option
                    v-for="(item, index) in grouplist"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="关键词:">
                <el-input
                  v-model="userFrom.name"
                  placeholder="请输入关键词"
                  class="selWidth"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3">
              <el-button type="primary" @click="savesearch(userFrom.name)"
                >搜索</el-button
              >
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="seation">
      <el-button type="primary" class="button" @click="button">
        <router-link to="/content/userForm" style="color: #fff"
          >添加文章</router-link
        >
      </el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="id" label="ID" width="150">
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 36px; height: 36px"
                :src="scope.row.imageInput"
                :preview-src-list="[scope.row.imageInput]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="120">
        </el-table-column>
        <el-table-column prop="cid" label="文章分类" width="120">
        </el-table-column>
        <el-table-column prop="visit" label="浏览量" width="100">
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120">
        </el-table-column>
        <el-table-column prop="synopsis" label="文章简介" width="300">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="handledelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确定删除当前数据</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              savedele();
              dialogVisible = false;
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  category,
  articlelist,
  articledelete,
  articlesave,
} from "@/network/api/content";
export default {
  data() {
    return {
      userFrom: {
        state: "",
        name: "",
      },
      grouplist: [],
      tableData: [],
      classification: [],
      keywords: "",
      cid: "",
      dialogVisible: false,
      usertab: {
        name: "",
        pid: 0,
        status: -1,
        type: 3,
      },
      usettext: {},
      id: "",
    };
  },
  methods: {
    //搜索文章
    savesearch(row) {
      this.keywords = row;
      this.articlelist();
    },
    //获取分类数据
    async category() {
      let categoryInfo = await category(this.usertab);
      console.log(categoryInfo);
      this.grouplist = categoryInfo.data.data.list;
      this.conversion();
    },

    //获取文章数据
    async articlelist() {
      let articlelistInfo = await articlelist({
        cid: this.cid,
        keywords: this.keywords,
      });
      this.tableData = articlelistInfo.data.data.list;
    },
    //

    //转换文章分类
    conversion() {
      // console.log(this.grouplist)
      for (let item in this.grouplist) {
        for (let ite in this.tableData) {
          if (this.grouplist[item].id == this.tableData[ite].cid) {
            this.tableData[ite].cid = this.grouplist[item].name;
          }
        }
      }
    },

    button() {},

    //编辑文章
    handleClick(row) {
      let id = row.id;
      this.$router.push({
        path: "/content/userForm",
        query: { id: id },
      });
    },

    //删除文章
    handledelete(row) {
      this.dialogVisible = true;
      this.id = row.id;
    },
    savedele() {
      this.articledelete();
    },
    async articledelete() {
      let articledeleteInfo = await articledelete({ id: this.id });
      this.articlelist();
    },

    //切换文章分类
    saveList(row) {
      this.cid = row;

      this.articlelist();
    },
  },

  async created() {
    console.log(this.cid);
    
    this.category();
    this.articlelist();
    console.log(this.$route, 7777);
  },
  watch: {
    "this.$router": {
      handler(val) {
        console.log(val, 777777);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#articleManager {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>