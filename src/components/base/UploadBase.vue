<template>
  <div id="uploadBase">
    <el-dialog
      title="上传图片"
      :visible.sync="dialogFV"
      :modal="false"
      @close="handleClose"
    >
      <div class="down">
        <div class="left">
          <div class="search">
            <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="input1"
            >
            </el-input>
          </div>
          <ul class="menu">
            <li @click="menuSelect(0)">
              <span>全部图片</span><i class="el-icon-circle-plus-outline"></i>
            </li>
            <li
              v-for="item in menu"
              :key="item.id"
              @click="menuSelect(item.id)"
            >
              <span>{{ item.name }}</span
              ><i class="el-icon-circle-plus-outline"></i>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="header">
            <el-button type="primary" size="small" @click="uploadImg"
              >使用选中的图片</el-button
            >
            <form enctype="multipart/form-data" method="post">
              <input
                type="file"
                v-show="false"
                ref="fileRef"
                multiple
                @change="fileChange"
              />
            </form>
            <el-button
              @click="uploadFile"
              class="el-icon-upload2"
              size="small"
            ></el-button>
            <el-button
              type="danger"
              class="el-icon-delete"
              size="small"
              @click="deleteImg"
            ></el-button>
            <SelectBoxBase
              :optionsData="selectMenu"
              placeholder="图片移动至"
              @getVal="getMoveVal"
            ></SelectBoxBase>
            <el-button-group>
              <el-button
                :type="type ? 'primary' : ''"
                size="small"
                @click="showImg"
                >图片</el-button
              >
              <el-button
                :type="!type ? 'primary' : ''"
                size="small"
                @click="showVideo"
                >视频</el-button
              >
            </el-button-group>
          </div>
          <div class="photo" v-show="isShow">
            <template v-for="(item, index) in imgs">
              <div
                :key="item.attId"
                :class="[
                  'wrap_img',
                  { wrap_imgActive: clickArr.some((item) => item == index) },
                ]"
                @click.prevent="pitchOn(index, item)"
              >
                <el-image :src="item.sattDir">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span
                  :class="[
                    'dot',
                    { dotActive: clickArr.some((item) => item == index) },
                  ]"
                >
                  {{ clickArr.findIndex((item) => item == index) + 1 }}</span
                >
              </div>
            </template>
          </div>
          <div class="video" v-show="!isShow">
            <template v-for="item in videos">
              <div :key="item.id">
                <a :href="item.href"></a>
              </div>
            </template>
            <div v-show="videos.length == 0" class="empty">
              <el-image>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                  <div class="text">图片库为空</div>
                </div>
              </el-image>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.page"
              :page-sizes="[10, 15]"
              :page-size="pagination.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenu,
  getImgs,
  localImg,
  removeImg,
  moveImg,
} from "@/network/api/marketingApi/seckillApi";
const SearchBoxBase = () => import("./SearchBoxBase.vue");
const SelectBoxBase = () => import("./SelectBoxBase.vue");
import { Message } from "element-ui";
export default {
  name: "UploadBase",
  components: {
    SearchBoxBase,
    SelectBoxBase,
  },
  props: {
    dialogFV_p: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      dialogFV: false,
      modal: "",
      input1: "",
      menu: [], //右侧菜单
      selectMenu: [], //下拉选项
      imgs: [], //渲染图片显示分页
      clickArr: [], //图片选中状态
      imgInfo: [], //选中图片的信息
      videos: [], //渲染视频显示分页
      isShow: true, //切换图片/视频按钮
      type: "primary", //切换按钮类型
      pagination: {
        page: 1, //当前页
        limit: 10, // 条/页
        total: 50, //总条数
      },
    };
  },
  created() {
    let { page, limit } = this.pagination;
    this.getMenuList(2, -1);
    this.getImgList(page, limit, 0);
  },
  methods: {
    //获取分类菜单
    async getMenuList(type, status) {
      let menuRes = await getMenu(type, status);
      this.menu = menuRes.data.data;
      let res = menuRes.data.data;
      res.forEach((item) => {
        let obj = {
          value: item.id, //分类的编号
          label: item.name,
        };
        this.selectMenu.push(obj);
      });
    },
    //点击菜单分类选项
    async menuSelect(pid) {
      let { page, limit } = this.pagination;
      this.getImgList(page, limit, pid);
    },
    //获取图片列表
    async getImgList(page, limit, pid, attType) {
      let imgRes = await getImgs(page, limit, pid, attType);
      this.imgs = imgRes.data.data.list;
      this.pagination.total = imgRes.data.data.total;
    },
    //关闭模态框并传值
    handleClose() {
      this.dialogFV = false;
      this.$emit("closeVal", false);
    },
    //选中图片
    pitchOn(index, item) {
      let res = this.clickArr.findIndex((item) => item == index);
      if (res == -1) {
        this.clickArr.push(index);
        this.imgInfo.push(item);
      } else {
        this.clickArr.splice(res, 1);
        this.imgInfo.splice(res, 1);
      }
      // console.log(this.clickArr);
      // console.log(this.imgInfo);
    },
    //点击上传图片按钮
    uploadImg() {
      if (this.clickArr.length > 0) {
        this.dialogFV = false;
        this.$emit("imgVal", this.imgInfo);
      } else {
        return Message.warning("请选择图片");
      }
    },
    //打开本地目录
    uploadFile() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
    },
    //上传本地文件
    async fileChange(e) {
      let files = e.target.files;
      let fileRes;
      //循环上传多张图片
      for (let i = 0; i < files.length; i++) {
        let formData = new FormData();
        formData.append("multipart", files[i]);
        fileRes = await localImg("marking", 0, formData);
      }
      if (fileRes.data.code == 200) {
        let { page, limit } = this.pagination;
        this.getImgList(page, limit, 0);
        return Message.success("上传成功");
      } else {
        return Message.error("上传失败");
      }
    },
    //删除所选图片
    async deleteImg() {
      if (this.clickArr.length > 0) {
        let confirmRes = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);

        if (confirmRes == "cancel") {
          return Message.info("已取消删除");
        } else if (confirmRes == "confirm") {
          //拼接参数
          let res = "";
          this.imgInfo.forEach((item) => {
            res += item.attId + ",";
          });
          //请求删除
          let deletRes = await removeImg(res);
          if (deletRes.data.code == 200) {
            let { page, limit } = this.pagination;
            this.clickArr = [];
            this.imgInfo = [];
            //重新渲染
            this.getImgList(page, limit, 0);
            return Message.success("删除成功");
          } else {
            return Message.error("删除失败");
          }
        }
      } else {
        return Message.warning("请选择图片");
      }
    },
    //移动图片至分类位置
    async getMoveVal(val) {
      if (this.clickArr.length > 0) {
        //拼接参数
        let res = "";
        this.imgInfo.forEach((item) => {
          res += item.attId + ",";
        });
        let moveRes = await moveImg(res, val);
        if (moveRes.data.code == 200) {
          let { page, limit } = this.pagination;
          this.clickArr = [];
          this.imgInfo = [];
          //重新渲染
          this.getImgList(page, limit, 0);
          return Message.success("移动成功");
        } else {
          return Message.error("移动失败");
        }
      } else {
        return Message.warning("请选择图片");
      }
    },
    //切换视频分页
    async showVideo() {
      this.isShow = !this.isShow;
      this.type = "";
      let { page, limit } = this.pagination;
      // this.getImgList(page, limit, 0,"video/mp4");
      let resVideo = await getImgs(page, limit, 0, "video/mp4");
      console.log(resVideo);
      this.videos = resVideo.data.data.list;
    },
    //切换图片分页
    showImg() {
      this.isShow = !this.isShow;
      this.type = "primary";
    },
    //获取条/页
    handleSizeChange(val) {
      this.pagination.limit = val;
      let { page, limit } = this.pagination;
      this.getImgList(page, limit, 0);
    },
    //获取当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      let { page, limit } = this.pagination;
      this.getImgList(page, limit, 0);
    },
  },
  watch: {
    "$props.dialogFV_p"(newValue) {
      this.dialogFV = newValue;
    },
  },
};
</script>

<style lang="scss">
#uploadBase {
  .el-dialog {
    width: 900px;
  }
  .down {
    display: flex;
    justify-content: space-between;
    padding: 0;
    .left {
      width: 220px;
      box-sizing: border-box;
      padding: 0 15px;
      .search {
        margin-bottom: 10px;
        input {
          height: 35px;
        }
      }
      .menu {
        font-size: 12px;
        color: #409eff;
        li {
          height: 23px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 3px;
          box-sizing: border-box;
          padding: 0 20px;
          .el-icon-circle-plus-outline {
            font-size: 12px;
            font-weight: 700;
            opacity: 0;
            color: #409eff;
          }
        }
        li:hover {
          cursor: pointer;
          background-color: #eef5f7;
        }
        li:hover .el-icon-circle-plus-outline {
          opacity: 1;
        }
      }
    }
    .right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 10px;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button {
          height: 35px;
        }
      }
      .photo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 15px 0;
        height: 400px;
        .wrap_imgActive {
          outline: 2px solid #409eff;
        }
        .wrap_img {
          position: relative;
          // border: 2px solid #409eff;
          border-radius: 5px;
          height: 104px;
          .dot {
            width: 20px;
            height: 20px;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
            background-color: #409eff;
            border-radius: 10px;
            color: white;
            position: absolute;
            right: 2%;
            bottom: 2%;
            opacity: 0;
          }
          .dotActive {
            opacity: 1;
          }
          .el-image {
            img {
              width: 104px;
              height: 104px;
              border-radius: 5px;
            }
            .image-slot {
              width: 104px;
              height: 104px;
              background-color: rgb(251, 248, 248);
              border-radius: 5px;
              position: relative;
              i {
                font-size: 30px;
                color: #ddd;
                position: absolute;
                top: 40%;
                left: 35%;
              }
            }
          }
        }
      }
      .video {
        .empty {
          height: 400px;
          border-radius: 5px;
          background-color: #eef5f7;
          position: relative;
          .el-image {
            position: absolute;
            top: 40%;
            left: 45%;
            text-align: center;
            .el-icon-picture-outline {
              font-size: 40px;
              color: #ccc;
            }
            .text {
              font-size: 16px;
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
</style>