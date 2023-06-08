<template>
  <div id="Mama">
    <div class="title">
      <el-row>
        <el-form label-width="100px" :model="userFrom">
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
              <el-form-item label="状态">
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
            <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
              <el-form-item label="名称:">
                <el-input
                  v-model="userFrom.name"
                  placeholder="请输入名称"
                  class="selWidth"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
              <el-button type="primary" @click="savesearch(userFrom.name)"
                >搜索</el-button
              >
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="seation">
      <el-button type="primary" class="button" @click="button"
        >新增文章分类</el-button
      >
    </div>

    <div>
      <el-dialog
        title="创建文章分类"
        :visible.sync="dialogButtonVisible"
        width="800px"
      >
        <el-form :model="from">
          <el-form-item label="分类名称" :label-width="formLabelWidth">
            <el-input
              v-model="from.name"
              style="width: 450px"
              placeholder="分类名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类图标" :label-width="formLabelWidth">
            <el-image
              style="width: 36px; height: 36px"
              :src="from.extra"
            ></el-image>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input-number
              v-model="from.sort"
              style="width: 250px"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-switch
              v-model="from.status"
              :active-value="true"
              :inactive-value="false"
              active-text="显示"
              inactive-text="隐藏"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="
              saveclick();
              dialogButtonVisible = false;
            "
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="
              savebutton();
              dialogButtonVisible = false;
            "
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <div class="footer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="名称" min-width="80">
          <template slot-scope="scope">
            <el-popover>
              <div slot="reference">
                <el-tag>{{ scope.row.name }}|{{ scope.row.id }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="100">
          <template slot-scope="scope">
            <el-popover>
              <div slot="reference">
                <el-tag>{{ scope.row.type }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分类图标" min-width="100">
          <template slot-scope="scope">
            <el-popover>
              <div slot="reference">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="scope.row.extra"
                  :preview-src-list="[scope.row.extra]"
                >
                </el-image>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="100">
          <template slot-scope="scope">
            <el-popover>
              <div slot="reference">
                <el-tag>{{ scope.row.sort }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-popover>
              <div
                slot="reference"
                @click="handStatus(scope.$index, scope.row)"
              >
                <el-switch
                  v-model="scope.row.status"
                  :active-value="true"
                  :inactive-value="false"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
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
  categorysave,
  categoryupdate,
  categorydelete,
  categoryupdateStatus,
} from "@/network/api/content";
export default {
  data() {
    return {
      userFrom: {
        state: "",
        name: "",
      },

      grouplist: [
        { name: "全部", id: -1 },
        { name: "显示", id: 1 },
        { name: "不显示", id: 0 },
      ],
      tableData: [],
      dialogButtonVisible: false,
      dialogVisible: false,
      formLabelWidth: "120px",
      from: {
        name: "",
        extra:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        sort: "",
        status: true,
        pid: 0,
        type: 3,
      },
      id: "",
      status: "",
      usertab: {
        name: "",
        pid: 0,
        status: -1,
        type: 3,
      },
      isShow: false,
    };
  },
  methods: {
    //点击状态切换数据
    saveList(value) {
      this.usertab.status = value;
      this.category();
    },

    //搜索
    savesearch(name) {
      this.usertab.name = name;
      this.category();
    },

    //新增文章
    button() {
      this.dialogButtonVisible = true;
      this.from = {
        name: "",
        extra:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        sort: "",
        status: true,
        pid: 0,
        type: 3,
      };
    },
    savebutton() {
      if (!this.isShow) {
        this.categorysave();
        this.isShow = true;
      } else {
        this.categoryupdate();
      }
    },
    async categorysave() {
      let categorysaveInfo = await categorysave(this.from);
      console.log(categorysaveInfo);
      this.category();
    },

    //编辑
    handleEdit(index, row) {
      this.dialogButtonVisible = true;
      this.from = row;
    },
    async categoryupdate() {
      let categoryupdateInfo = await categoryupdate(this.from);
      console.log(categoryupdateInfo);
    },

    //删除
    handleDelete(index, row) {
      console.log(row);
      this.id = row.id;

      this.dialogVisible = true;
    },
    savedele() {
      this.categorydelete();
    },

    async categorydelete() {
      let categorydeleteInfo = await categorydelete({ id: this.id });
      console.log(categorydeleteInfo);
      this.category();
    },

    //状态切换
    handStatus(index, row) {
      this.status = row.status;
      let id = row.id;
      this.categoryupdateStatus(id);
    },
    async categoryupdateStatus(id) {
      let categoryupdateStatusInfo = await categoryupdateStatus(id);
      console.log(categoryupdateStatusInfo);
    },
    //获取表格数据
    async category() {
      let categoryInfo = await category(this.usertab);
      this.tableData = categoryInfo.data.data.list;
      console.log(this.tableData);
      for (let item in this.tableData) {
        if (this.tableData[item].type == 3) {
          this.tableData[item].type = "文章分类";
        }
      }
    },
    saveclick() {
      this.category();
    },
  },
  async created() {
    this.category();
  },
};
</script>

<style scoped lang="scss">
#Mama {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}

.title {
  margin-left: -60px;
}
.selWidth {
  width: 100% !important;
}
.button {
  margin-bottom: 20px;
}
.el-form-item__content {
  margin-left: 20px;
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
</style>