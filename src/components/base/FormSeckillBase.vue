<template>
  <div id="formSeckillBase">
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name" size="small">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <div class="timeLimit">
          <el-form-item label="时间范围" prop="startTime">
            <el-time-select
              placeholder="起始时间"
              v-model="ruleForm.startTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00',
              }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item prop="endTime" label-width="0">
            <el-time-select
              placeholder="结束时间"
              v-model="ruleForm.endTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00',
                minTime: ruleForm.startTime,
              }"
            >
            </el-time-select>
          </el-form-item>
        </div>

        <el-form-item label="幻灯片" prop="slideImg" class="slideImg">
          <div class="wrap_upload">
            <div
              class="uploadImg"
              v-for="(item, index) in imgInfo"
              :key="item.attId"
            >
              <img :src="item.sattDir" alt="" />
              <i class="el-icon-error" @click="removeImg(index)"></i>
            </div>
            <div class="uploadIcon" @click="dialogFV = true">
              <i class="el-icon-camera"></i>
            </div>
          </div>
          <div class="slideText" v-show="slideText">请选择幻灯片</div>
          <UploadBase
            @closeVal="getClose"
            :dialogFV_p="dialogFV"
            @imgVal="getImgVal"
          ></UploadBase>
        </el-form-item>
        <el-form-item label="状态">
          <SwitchBase @statusVal="getStatusVal"></SwitchBase>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('ruleForm')"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
const UploadBase = () => import("./UploadBase.vue");
const SwitchBase = () => import("./SwitchBase.vue");
import { seckillAdd } from "@/network/api/marketingApi/seckillApi";
export default {
  name: "FormSeckillBase",
  components: {
    SwitchBase,
    UploadBase,
  },
  props: {
    dialogFormVisible_p: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    title: {
      type: String,
      default: "请填写",
    },
  },
  data() {
    return {
      //添加秒杀配置模态框显示/隐藏
      dialogFormVisible: false,
      //上传图片模态框显示/隐藏
      dialogFV: false,
      value: "",
      status: 1,
      imgInfo: [], //需要上传图片的信息
      slideText: false, //幻灯片验证提示
      addCode: "", //添加秒杀配置
      ruleForm: {
        name: "",
        slideImg: "",
        startTime: "",
        endTime: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, message: "至少1个字符", trigger: "blur" },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur",
          },
        ],
        slideImg: [{ message: "请选择幻灯片", trigger: "blur" }],
      },
    };
  },
  methods: {
    //关闭模态框并传值
    handleClose() {
      this.dialogVisible = false;
      this.$emit("closeVal", false);
    },
    //表单验证
    requireName(val) {
      console.log(val);
    },
    //获取关闭模态框时DFV的值
    getClose(val) {
      this.dialogFV = val;
    },
    //获取img的信息
    getImgVal(val) {
      this.imgInfo = val;
      console.log(val);
    },
    //移除图片
    removeImg(index) {
      this.imgInfo.splice(index, 1);
    },
    //获取状态值
    getStatusVal(val) {
      console.log(val);
      this.status = val;
    },
    //表单提交
    submitForm(formName) {
      let num = this.imgInfo.length;
      //表单验证
      this.$refs[formName].validate((valid) => {
        let { name, startTime, endTime } = this.ruleForm;
        let { status } = this;
        let imgInfo = JSON.stringify(this.imgInfo);
        let time = startTime + "," + endTime;
        if (valid && num > 0) {
          // this.dialogFormVisible = false;
          this.slideText = false;
          this.seckillConfigAdd(name, time, imgInfo, status);
          // console.log(this.addCode);
        } else {
          console.log("error submit!!");
          this.slideText = true;
          return Message.warning("请选择幻灯片");
        }
      });
    },
    //秒杀配置新增
    async seckillConfigAdd(name, time, imgInfo, status) {
      let figRes = await seckillAdd(name, time, imgInfo, status);
      let code = figRes.data.code;
      if (code == 200) {
        this.dialogFormVisible = false;
        //调用父组件方法，重新渲染页面
        this.$parent.getSeckillList();
        return Message.success("上传成功");
      } else if (code == 500) {
        return Message.info("当前时间段的秒杀配置已存在");
      } else {
        return Message.error("上传失败");
      }
    },
  },

  watch: {
    "$props.dialogFormVisible_p"(newValue) {
      this.dialogFormVisible = newValue;
    },
    imgInfo() {
      this.slideText = false;
    },
  },
};
</script>
<style lang="scss">
#formSeckillBase {
  .el-dialog__header {
    border-bottom: 1px solid $marketing-border-color;
  }
  .el-form-item__label {
    color: $marketing-font-color;
    font-weight: 700;
  }
  .el-date-editor--time-select {
    margin-right: 10px;
  }
  .slideImg {
    .slideText {
      font-size: 12px;
      color: red;
    }
  }
  .wrap_upload {
    display: flex;
    align-items: center;
    .uploadIcon,
    .uploadImg {
      width: 60px;
      height: 60px;
      border-radius: 5px;
      background-color: #f4f4f4;
      margin-right: 10px;
      position: relative;
      img {
        width: 60px;
        height: 60px;
      }
    }
    .el-icon-error {
      position: absolute;
      top: 0;
      right: 0;
    }
    .el-icon-camera {
      font-size: 22px;
      position: absolute;
      top: 35%;
      left: 32%;
    }
  }
  .timeLimit {
    display: flex;
  }
}
</style>