<template>
  <div class="divBox">
    <el-card class="box-card">
      <div class="components-container">
        <el-form ref="pram" label-width="150px" :model="userForm">
          <el-form-item
            label="标题"
            prop="title"
            :rules="[
              {
                required: true,
                message: '请填写标题',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="userForm.title"
              placeholder="标题"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item
            label="作者"
            prop="author"
            :rules="[
              {
                required: true,
                message: '请填作者',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="userForm.author"
              placeholder="作者"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item
            label="文章分类"
            :rules="[
              {
                required: true,
                message: '请选择分类',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-select
              v-model="userForm.cid"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in categoryTreeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="图文封面"
            prop="imageInput"
            :rules="[
              { required: true, message: '请上传图文封面', trigger: 'change' },
            ]"
          >
           
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="文章简介"
            prop="synopsis"
            :rules="[
              {
                required: true,
                message: '请填写文章简介',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="userForm.synopsis"
              maxlength="100"
              type="textarea"
              :rows="2"
              resize="none"
              placeholder="文章简介"
            />
          </el-form-item>
          <el-form-item
            label="文章内容"
            prop="content"
            :rules="[
              {
                required: true,
                message: '请填写文章内容',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-tinymce v-model="userForm.content"></el-tinymce>
          </el-form-item>
          <el-form-item label="是否Banner">
            <el-switch v-model="userForm.isBanner" />
          </el-form-item>
          <el-form-item label="是否热门">
            <el-switch v-model="userForm.isHot" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handerSubmit('userForm')"
            >
             保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { category, articleinfo ,articleupdate,articlesave,articlelist} from "@/network/api/content";
import tinymce from "./tinymce.vue";
export default {
  // name: "edit",
  components: {
    "el-tinymce": tinymce,
  },
  data() {
    return {
        imageUrl: '',
      loading: false,
      constants: this.$constants,
      categoryTreeData: [],
      categoryProps: {
        value: "id",
        label: "name",
        children: "child",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false,
      },
      userForm: {
        author: null,
        cid: null,
        content: "",
        imageInput: "",
        isBanner: false,
        isHot: null,
        shareSynopsis: null,
        shareTitle: null,
        sort: 0,
        synopsis: null,
        title: null,
        url: null,
        id: null,
      },
      usertab: {
        name: "",
        pid: 0,
        status: -1,
        type: 3,
      },
      editData: {},
      editorContentLaebl: "",
      user:"",
      tableData:[],
      show:false
    };
  },
  methods: {
     handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      } ,

    
      //保存
   async handerSubmit() {
    if(!this.$route.query.id){
      //发布
       this.userForm.imageInput = this.imageUrl
      this.userForm.shareSynopsis = this.userForm.synopsis;
      this.userForm.shareTitle = this.userForm.title
      let articlesaveInfo = await articlesave(this.userForm);
      console.log(articlesaveInfo);
      this.category();
    }else{
      //编辑
         let articleupdateInfo = await articleupdate({id:this.userForm.id},this.userForm)
    }
      

      this.$router.push({
        path: "/content/articleManager",
      });
    },

    
    //获取分类
    async category() {
      let categoryInfo = await category(this.usertab);
      console.log(categoryInfo)
      this.categoryTreeData = categoryInfo.data.data.list;
    },
    // 编辑传过来的数据
   async catetable(){
      let {id} = this.$route.query
      let articleinfoInfo = await articleinfo({id:id})
       console.log(articleinfoInfo)
       this.userForm = articleinfoInfo.data.data
       console.log(this.userForm.cid)
       for(let item in this.categoryTreeData){
        if(this.categoryTreeData[item].id ==Number(this.userForm.cid) ){
            this.userForm.cid = this.categoryTreeData[item].name

            console.log(this.userForm.cid)
             console.log(111)
        }
       
       }
    },

  },
  async created() {
    this.category();
    let {id} = this.$route.query
    this.user = id
    console.log(id)
    if(id){
         this.catetable()
    }
  
  },
  beforeDestroy(){
  //  this.userinfo()
  }

 
};
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
