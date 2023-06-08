<template>
  <!-- 商品规格页面 -->
  <div class="attr">
    <!-- top -->
    <div class="store-top">
      <div class="top1">
        <!-- 规格搜索 -->
        <span>规格搜索 : </span>
        <el-input
          placeholder="请输入商品规格"
          v-model="nowRuleName"
          clearable
          @change="searchAttr"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchAttr"
          ></el-button>
        </el-input>
      </div>
      <div class="top2">
        <el-button size="medium" type="primary" plain @click="changeAttrID()"
          >添加商品规格</el-button
        >
        <el-button size="medium" type="nomal" plain>批量删除</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="store-table">
      <el-table
        :data="ruleList"
        style="width: 100%; margin-bottom: 20px"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="50"> </el-table-column>
        <el-table-column label="ID" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规格名称" min-width="70">
        </el-table-column>
        <el-table-column label="商品规格" min-width="200">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.ruleValue" :key="index">
              {{ item.value }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="商品属性" min-width="250">
          <template slot-scope="scope">
            <div :key="index" v-for="(item, index) in scope.row.ruleValue">
              <span v-for="(i, x) in item.detail" :key="x"> {{ i }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <span class="infoSpan" @click="changeAttrID(scope.row.id)"
              >编辑</span
            >
            <span class="deleteSpan" @click="deleteAttr(scope.row.id)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 模态框 -->
    <el-dialog title="编辑商品规格" :visible.sync="dialogShow">
      <div class="box">
        <el-form ref="ruleListData" :model="ruleListData" label-width="80px">
          <el-form-item label="规格名称">
            <el-input v-model="ruleListData.ruleName"></el-input>
          </el-form-item>
          <el-form-item
            :label="item.value"
            v-for="(item, index) in ruleListData.ruleValue"
            :key="index"
          >
            <el-tag
              :key="tag"
              v-for="tag in item.detail"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ 添加</el-button
            >
            <el-button
              v-if="!inputVisible"
              type="danger"
              @click="deleteRuleinfo(item.value)"
              size="small"
            >
              删除
            </el-button>
          </el-form-item>
          <el-button type="primary" v-if="!addrule" @click="addrule = !addrule">
            添加新规格
          </el-button>
          <el-form inline v-if="addrule">
            <el-form-item label="规格">
              <el-input v-model="newvalue.value"></el-input>
            </el-form-item>
            <el-form-item label="规格值">
              <el-input v-model="newvalue.detail[0]"></el-input>
            </el-form-item>
            <el-button @click="addrule = !addrule"> 取消 </el-button>
            <el-button type="primary" @click="addnewvalue"> 确认 </el-button>
          </el-form>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRule"> 确 认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRuleList,
  getRuleInfo,
  postRuleupdate,
  postRuleupsave,
  postRuleupdelete,
} from "@/network/api/shop";
import { MessageBox, Message } from "element-ui";

export default {
  name: "store_attr",
  data() {
    return {
      dialogShow: false,
      nowRuleName: "",
      ruleList: [],
      multipleSelection: [],
      ruleListData: {},
      inputVisible: false,
      inputValue: "",
      newvalue: {
        value: "",
        detail: [""],
      },
      addrule: false,
    };
  },
  async created() {
    // 初次获取规格表格
    let resRuleList = await getRuleList();
    this.ruleList = resRuleList.data.data.list;
    this.ruleList.forEach((index) => {
      index.ruleValue = JSON.parse(index.ruleValue);
    });
    console.log(this.ruleList);

    let resgetRuleInfo = await getRuleInfo(2);
  },
  methods: {
    // 复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 搜索关键字
    async searchAttr() {
      let resRuleList = await getRuleList(this.nowRuleName);
      this.ruleList = resRuleList.data.data.list;
      this.ruleList.forEach((index) => {
        index.ruleValue = JSON.parse(index.ruleValue);
      });
    },

    // 编辑具体规格(打开模态框)
    async changeAttrID(id) {
      this.dialogShow = !this.dialogShow;
      if (id) {
        let res = await getRuleInfo(id);
        this.ruleListData = res.data.data;
        this.ruleListData.ruleValue = JSON.parse(this.ruleListData.ruleValue);
        console.log(this.ruleListData);
      } else {
        this.ruleListData = {
          ruleName: "",
          ruleValue: [],
        };
      }
    },

    // 修改规格(提交)
    async updateRule() {
      if (this.ruleListData.id) {
        this.ruleListData.ruleValue = JSON.stringify(
          this.ruleListData.ruleValue
        );
        await postRuleupdate(this.ruleListData);
      } else {
        this.ruleListData.ruleValue = JSON.stringify(
          this.ruleListData.ruleValue
        );
        await postRuleupsave(this.ruleListData);
      }
      this.dialogShow = !this.dialogShow;
      let resRuleList = await getRuleList();
      this.ruleList = resRuleList.data.data.list;
      this.ruleList.forEach((index) => {
        index.ruleValue = JSON.parse(index.ruleValue);
      });
    },

    // 添加新的规格和规格值在模态框中
    addnewvalue() {
      this.ruleListData.ruleValue.push(this.newvalue);
      this.newvalue = {
        value: "",
        detail: [""],
      };
      this.addrule = !this.addrule;
    },

    // 删除一行规格在模态框
    deleteRuleinfo(value) {
      console.log(value);
      this.ruleListData.ruleValue.splice(
        this.ruleListData.ruleValue.indexOf(this.ruleListData.ruleValue.value),
        1
      );
    },

    async deleteAttr(id) {
      await postRuleupdelete(id);
      let resRuleList = await getRuleList();
      this.ruleList = resRuleList.data.data.list;
      this.ruleList.forEach((index) => {
        index.ruleValue = JSON.parse(index.ruleValue);
      });
    },

    handleClose(tag) {
      console.log(this.ruleListData);
      this.ruleListData.ruleValue.forEach((index) => {
        index.detail.splice(index.detail.indexOf(tag), 1);
      });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.ruleListData.ruleValue.forEach((index) => {
          index.detail.push(inputValue);
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.attr {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  transition: width 0.3s ease-in-out;

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

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>