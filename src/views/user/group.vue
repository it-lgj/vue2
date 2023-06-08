<template>
  <div id="group">
    <div class="btn">
         <el-button type="primary" @click="button" class="button">添加用户分组</el-button>
    </div>
   
      <div>
        <el-dialog
        title="分组名称"
        :visible.sync="dialogButtonVisible"
        width="420px"
      >
        <el-form>
          <el-input v-model="name" value="name"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogButtonVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
             savebutton()
              dialogButtonVisible = false;
            "
            >确 定</el-button
          >
        </div>
      </el-dialog>
      </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" min-width="80">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分组名称" min-width="180">
        <template slot-scope="scope">
         
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.groupName }}</el-tag>
            </div>

        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
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
      <el-dialog
        title="分组名称"
        :visible.sync="dialogFormVisible"
        width="420px"
      >
        <el-form>
          <el-input v-model="name" value="name"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              Groupupdate(id);
              dialogFormVisible = false;
            "
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="420px"
      >
        <span class="el-icon-warning" ></span>
        <span class="icon">确定删除吗？所有用户已经关联的数据都会清除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="delect(); dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <div class="fenye">
        <el-pagination
          :page-sizes="[15, 30, 45, 60]"
          layout="total, sizes, prev, pager, next, jumper"
          :total=page
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { userLever,gruopUpdate,groupdelct,groupsave} from "@/network/api/user";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      name: "",
      formLabelWidth: "120px",
      id: "",
      dialogVisible:false,
      dialogButtonVisible:false,
      page:null
    };
  },
  methods: {
    //编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      console.log(row)
      this.name = row.groupName;
      this.id = row.id;
    },
    //点击确认修改标签
    Groupupdate(upid) {
      this.update();
    },
    async update() {
      let gruopUpdateInfo = await gruopUpdate(
        { id: this.id },
        { groupName: this.name }
      );
      console.log(gruopUpdateInfo);
      // this.$message.success("编辑成功");
      this.taglist();
    },
    async taglist() {
      let userLeverInfo = await userLever();
      this.tableData = userLeverInfo.data.data.list;
      console.log(userLeverInfo)
      this.page = this.tableData.length
    },

    //删除
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.id = row.id
    },
    
    delect(){
      this.tagdelect()
    },
    async tagdelect(){
      let groupdelctInfo = await groupdelct({id:this.id});
      console.log(groupdelctInfo,this.id)
      //  this.$message.success("删除成功");
      this.taglist();
    },

    // 新增用户标签
    button(){
      this.dialogButtonVisible = true
      
    },
    savebutton(){
        this.savetag()
    },
    async savetag(){
      let groupsaveInfo = await groupsave({groupName:this.name})
      console.log(groupsaveInfo)
      this.taglist()
    }
  },
  async created() {
    //获取用户标签数据
    this.taglist();
    //删除标签数据
  },
};
</script>

<style scoped>
#group{
    width: 100%;
  padding-left: 20px;
  padding-top: 1px;
  box-sizing: border-box;
   background-color: #fff;
}
.el-icon-warning{
 color:  #ffba00;
 font-size: 24px !important;
}
.icon{
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
.button{
  margin: 20px;
}

</style>