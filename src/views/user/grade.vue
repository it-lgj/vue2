<template>
  <div id="grade">
    <el-button type="primary" @click="button" class="button"
      >添加用户等级</el-button
    >

    <!-- 添加用户等级模态框 -->
    <div>
      <el-dialog
        title="用户等级"
        :visible.sync="dialogButtonVisible"
        width="600px"
      >
        <el-form :model="from">
          <el-form-item label="等级名称" :label-width="formLabelWidth">
            <el-input
              v-model="from.name"
              style="width: 450px"
              placeholder="请输入等级名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="等级" :label-width="formLabelWidth">
            <el-input
              v-model="from.grade"
              style="width: 450px"
              placeholder="请输入等级"
            ></el-input>
          </el-form-item>
          <el-form-item label="享受折扣" :label-width="formLabelWidth">
            <el-input-number
              v-model="from.discount"
              style="width: 250px"
              :min="1"
              :max="100"
              placeholder="请输入折扣"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="经验" :label-width="formLabelWidth">
            <el-input-number
              v-model="from.experience"
              style="width: 250px"
              placeholder="请输入经验"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-image
              style="width: 36px; height: 36px"
              :src="from.icon"
            ></el-image>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogButtonVisible = false">取 消</el-button>
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

    <!-- tab表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" prop="id" min-width="50"> </el-table-column>
      <el-table-column label="等级图标" min-width="80">
        <template slot-scope="scope">
          <el-popover>
            <div slot="reference">
              <el-image
                style="width: 36px; height: 36px"
                :src="scope.row.icon"
                :preview-src-list="[scope.row.icon]"
              ></el-image>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="等级名称" prop="name" min-width="100">
      </el-table-column>
      <el-table-column label="经验" prop="experience" min-width="100">
      </el-table-column>
      <el-table-column label="享受折扣(%)" prop="discount" min-width="100">
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template slot-scope="scope">
            <div slot="reference">
              <el-switch
                v-model="scope.row.isShow"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                disabled
                @click.native="onchangeIsShow(scope.row)"
              />
            </div>
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
    <div>
      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="420px">
        <div v-if="!sex">
          <span class="el-icon-warning"></span>
          <span class="icon"
            >确定删除吗？删除会导致对应用户等级数据清空，请谨慎操作！</span
          >
        </div>
        <div v-else>
          <span class="el-icon-warning"></span>
          <span class="icon">确定该操作会导致对应用户等级隐藏，请谨慎操作</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              savedele();
              dialogVisible = false;
            "
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="
              delect();
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
  systemuser,
  userlever,
  levelsave,
  levelupdate,
  leveluse,
} from "@/network/api/user";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      name: "",
      id: "",
      dialogVisible: false,
      dialogButtonVisible: false,
      page: null,
      from: {
        name: "",
        grade: null,
        discount: null,
        experience: "",
        icon: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        isShow: 1,
      },
      formLabelWidth: "80px",
      sex: false,
    };
  },
  methods: {
    //编辑
    handleEdit(index, row) {
      this.dialogButtonVisible = true;
      this.from = row;
      this.id = row.id;
    },

    savedele() {
      this.taglist();
    },
    //点击确认修改标签
    async update() {
      let id = this.id;
      console.log(id);
      let levelupdateInfo = await levelupdate(id, this.from);
      console.log(levelupdateInfo);
      // this.$message.success("编辑成功");
      this.taglist();
    },
    async taglist() {
      let systemuserInfo = await systemuser();
      console.log(systemuserInfo)
      let tab = systemuserInfo.data.data;
      tab = JSON.stringify(tab);
      localStorage.setItem("levelKey", tab);
      this.tableData = systemuserInfo.data.data;
      this.page = this.tableData.length;
    },

    //点击切换状态
  async  onchangeIsShow(row) {
      console.log(row.isShow);
      this.sex = true;
      this.id = row.id;

      if (row.isShow == false) {
        row.isShow = !row.isShow;
        this.leveluse(this.id, row.isShow);
        this.taglist();
      } else {
        row.isShow = !row.isShow;
        this.from.isShow = row.isShow;
        this.dialogVisible = true
        this.delect();
       
      }
    },
    delect() {
      if (!this.sex) {
        this.tagdelect();
        this.sex = true;
      } else {
        let id = this.id;
        let isShow = this.from.isShow;
        this.leveluse(id, isShow);
         this.taglist();
      }
    },

    async leveluse(id, isShow) {
      let leveluseInfo = await leveluse({ id: id, isShow: isShow });
      console.log(leveluseInfo);
    },
    //删除
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.sex = false;
    },

    async tagdelect() {
      let id = this.id;
      let userleverInfo = await userlever(id);
      console.log(userleverInfo);
      // this.$message.success("删除成功");
      this.taglist();
    },

    // 新增用户标签
    button() {
      (this.from = {
        name: "",
        grade: null,
        discount: null,
        experience: "",
        icon: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        isShow: 1,
      }),
        (this.dialogButtonVisible = true);
    },
    savebutton() {
      if (!this.from.grade) {
        this.savetag();
      } else {
        this.update();
      }
    },
    async savetag() {
      let levelsaveInfo = await levelsave(this.from);
      console.log(levelsaveInfo);
      this.taglist();
    },
  },
  async created() {
    //获取用户标签数据
    this.taglist();
  },
};
</script>

<style scoped>
#grade {
  width: 100%;
  padding-left: 20px;
  padding-top: 1px;
  box-sizing: border-box;
  background-color: #fff;
}
.el-icon-warning {
  color: #ffba00;
  font-size: 24px !important;
}
.icon {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  margin-left: 20px;
  padding-bottom: 2px;
}
.fenye {
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  margin-top: 25px;
}
.el-switch.is-disabled {
  opacity: 1;
}
::v-deep .el-switch__label {
  cursor: pointer !important;
}
.button {
  margin: 20px;
}
</style>