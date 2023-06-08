<template>
  <!-- 商品添加页 -->
  <div class="creatProduct">
    <!-- 步骤条 -->
    <div class="top">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品详情"></el-step>
        <el-step title="其他设置"></el-step>
      </el-steps>
    </div>
    <div class="pagestep">
      <!-- 有id -->
      <el-form
        :model="productinfoData"
        :rules="rules"
        ref="productinfoData"
        label-width="100px"
        class="demo-ruleForm"
        v-if="id"
      >
        <!-- 表单1 -->
        <div class="step1" v-if="active === 0">
          <el-form-item label="商品名称" prop="storeName">
            <el-input
              v-model="productinfoData.storeName"
              :disabled="isFix"
            ></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input
              v-model="productinfoData.keyword"
              :disabled="isFix"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品简介" prop="storeInfo">
            <el-input
              type="textarea"
              v-model="productinfoData.storeInfo"
              :disabled="isFix"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品单位" prop="unitName">
            <el-input
              v-model="productinfoData.unitName"
              :disabled="isFix"
            ></el-input>
          </el-form-item>
          <el-form-item label="运费模板" prop="unitName">
            <el-select
              v-model="productinfoData.tempId"
              placeholder="请选择"
              :disabled="isFix"
            >
              <el-option
                v-for="item in shiptemplates"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-radio-group v-model="postData.specType" :disabled="isFix">
              <el-radio :label="0">单规格</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :show-all-levels="false"
              :options="shopTree"
              v-model="nowTree"
              :props="{ multiple: true }"
              clearable
              :disabled="isFix"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-image
              style="width: 58px; height: 58px"
              :src="productinfoData.image"
              fit="fill"
            ></el-image>
          </el-form-item>
          <el-form-item label="商品轮播图">
            <el-image
              v-for="(item, index) in productinfoData.sliderImage"
              :key="index"
              style="width: 58px; height: 58px"
              :src="item"
              fit="fill"
            ></el-image>
          </el-form-item>
          <el-form-item label="佣金设置">
            <el-radio-group v-model="productinfoData.isSub" :disabled="isFix">
              <el-radio :label="true">默认设置</el-radio>
              <el-radio :label="false">单独设置</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-table :data="productinfoData.attrValue" style="width: 100%">
            <el-table-column label="图片" min-width="100">
              <template slot-scope="props">
                <el-image
                  style="width: 58px; height: 58px"
                  :src="props.row.image"
                  fit="fill"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="售价" min-width="100">
              <template slot-scope="props">
                <el-input
                  v-model="props.row.price"
                  :disabled="isFix"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="成本价" min-width="100">
              <template slot-scope="props">
                <el-input v-model="props.row.cost" :disabled="isFix"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="原价" min-width="100">
              <template slot-scope="props">
                <el-input
                  v-model="props.row.otPrice"
                  :disabled="isFix"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="库存" min-width="100">
              <template slot-scope="props">
                <el-input
                  v-model="props.row.stock"
                  :disabled="isFix"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="重量" min-width="100">
              <template slot-scope="props">
                <el-input
                  v-model="props.row.weight"
                  :disabled="isFix"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="体积" min-width="100">
              <template slot-scope="props">
                <el-input
                  v-model="props.row.volume"
                  :disabled="isFix"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 表单2 -->
        <div class="step2" v-if="active === 1">
          <el-form-item label="商品详情" v-if="isFix">
            <span v-html="productinfoData.content"></span>
          </el-form-item>
          <el-form-item label="商品详情" v-if="!isFix">
            <Tinymce></Tinymce>
          </el-form-item>
        </div>

        <!-- 表单3 -->
        <div class="step3" v-if="active === 2">
          <el-form-item label="排序">
            <el-input-number
              v-model="productinfoData.sort"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="积分">
            <el-input-number
              v-model="productinfoData.giveIntegral"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="虚拟销量">
            <el-input-number
              v-model="productinfoData.ficti"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="商品推荐">
            <el-checkbox v-model="productinfoData.isHot" :disabled="isFix"
              >是否热卖</el-checkbox
            >
            <el-checkbox v-model="productinfoData.isHot" :disabled="isFix"
              >热门榜单</el-checkbox
            >
            <el-checkbox v-model="productinfoData.isBest" :disabled="isFix"
              >促销单品</el-checkbox
            >
            <el-checkbox v-model="productinfoData.isGood" :disabled="isFix"
              >精品推荐</el-checkbox
            >
            <el-checkbox v-model="productinfoData.isNew" :disabled="isFix"
              >首发新品</el-checkbox
            >
          </el-form-item>
          <el-form-item label="商品推荐" class="slick" v-if="!isFix">
            <SlickList axis="x" lockAxis="x" v-model="productinfoData.activity">
              <SlickItem
                v-for="(item, i) in productinfoData.activity"
                :key="item"
                :index="i"
              >
                <span :class="`spanbox${item}`">{{ item }}</span>
              </SlickItem>
            </SlickList>
          </el-form-item>
          <el-form-item label="商品推荐" v-if="isFix" class="slick">
            <span
              v-for="(item, i) in productinfoData.activity"
              :key="i"
              :class="`spanbox${item}`"
              >{{ item }}</span
            >
          </el-form-item>
          <el-form-item label="优惠券">
            <el-tag>{{ conponCard }}</el-tag>
          </el-form-item>
        </div>
      </el-form>

      <!-- ------------------------- -->
      <!-- 无id -->
      <el-form
        :model="postData"
        ref="postData"
        label-width="100px"
        class="demo-ruleForm"
        v-else
      >
        <!-- 表单1 -->
        <div class="step1" v-if="active === 0">
          <el-form-item label="商品名称" prop="storeName">
            <el-input v-model="postData.storeName" :disabled="isFix"></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model="postData.keyword" :disabled="isFix"></el-input>
          </el-form-item>
          <el-form-item label="商品简介" prop="storeInfo">
            <el-input
              type="textarea"
              v-model="postData.storeInfo"
              :disabled="isFix"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品单位" prop="unitName">
            <el-input v-model="postData.unitName" :disabled="isFix"></el-input>
          </el-form-item>
          <el-form-item label="运费模板" prop="unitName">
            <el-select v-model="postData.tempId" placeholder="请选择">
              <el-option
                v-for="item in shiptemplates"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 表单2 -->
        <div class="step2" v-if="active === 1">
          <el-form-item label="商品详情" v-if="isFix">
            <span v-html="postData.content"></span>
          </el-form-item>
          <el-form-item label="商品详情" v-if="!isFix">
            <Tinymce></Tinymce>
          </el-form-item>
        </div>

        <!-- 表单3 -->
        <div class="step3" v-if="active === 2">
          <el-form-item label="排序">
            <el-input-number
              v-model="postData.sort"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="积分">
            <el-input-number
              v-model="postData.giveIntegral"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="虚拟销量">
            <el-input-number
              v-model="postData.ficti"
              :min="0"
              :disabled="isFix"
            ></el-input-number
          ></el-form-item>
          <el-form-item label="商品推荐">
            <el-checkbox v-model="postData.isHot" :disabled="isFix"
              >是否热卖</el-checkbox
            >
            <el-checkbox v-model="postData.isHot" :disabled="isFix"
              >热门榜单</el-checkbox
            >
            <el-checkbox v-model="postData.isBest" :disabled="isFix"
              >促销单品</el-checkbox
            >
            <el-checkbox v-model="postData.isGood" :disabled="isFix"
              >精品推荐</el-checkbox
            >
            <el-checkbox v-model="postData.isNew" :disabled="isFix"
              >首发新品</el-checkbox
            >
          </el-form-item>
          <el-form-item label="商品推荐" class="slick" v-if="!isFix">
            <SlickList axis="x" lockAxis="x" v-model="postData.activity">
              <SlickItem
                v-for="(item, i) in postData.activity"
                :key="item"
                :index="i"
              >
                <span :class="`spanbox${item}`">{{ item }}</span>
              </SlickItem>
            </SlickList>
          </el-form-item>
          <el-form-item label="优惠券">
            <el-button>选择优惠券</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 步骤按钮 -->
    <div class="btn">
      <el-button v-if="active > 0" style="margin-top: 12px" @click="active--">
        上一步
      </el-button>
      <el-button
        v-if="active < 2"
        style="margin-top: 12px"
        @click="nextstep"
        type="primary"
      >
        下一步
      </el-button>
      <el-button
        v-if="active === 2 && !isFix"
        style="margin-top: 12px"
        type="success"
        @click="submitfix"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { SlickList, SlickItem } from "vue-slicksort";
import {
  getproductinfo,
  getcouponinfo,
  getshiptemplates,
  getgroupdatalist,
  getshopTree,
  postproductsave,
} from "@/network/api/shop";
import Tinymce from "./components/tinymce.vue";
export default {
  components: {
    SlickList,
    SlickItem,
    Tinymce,
  },
  data() {
    return {
      nowTree: [], // 当前分类
      shopTree: [], // 分类数据
      id: null, // 商品id
      isFix: false, // 只读
      productinfoData: {},
      postData: {
        storeName: "",
        keyword: "",
        storeInfo: "",
        unitName: "",
        sort: 0,
        giveIntegral: 0,
        ficti: 0,
        isHot: false,
        isBest: false,
        isGood: false,
        isNew: false,
        activity: ["默认", "秒杀", "砍价", "拼团"],
        tempId: null,
        specType: 0,
      },
      shiptemplates: [],

      active: 0, // 步骤数
      conponCard: null, // 优惠券
      rules: {
        // 表单验证规则
        storeName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 50 个字符",
            trigger: "blur",
          },
        ],
        keyword: [
          { required: true, message: "请输入商品关键字", trigger: "blur" },
        ],
        storeInfo: [
          { required: true, message: "请输入商品简介", trigger: "blur" },
        ],
        unitName: [
          { required: true, message: "请输入商品单位", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    // 商品详情 & 商品修改 获得商品ID
    this.id = this.$route.params.id;
    // 不同路由但同一组件重新获取数据
    this.$watch(
      () => this.$route.params,
      async (toParams, previousParams) => {
        // 对路由变化做出响应...
        if (toParams.id || toParams.isFix) {
          this.id = toParams.id;
          if (toParams.isFix) {
            this.isFix = true;
          } else {
            this.isFix = false;
          }
          let resgetproductinfo = await getproductinfo(toParams.id);
          this.productinfoData = resgetproductinfo.data.data;

          this.productinfoData.sliderImage = JSON.parse(
            this.productinfoData.sliderImage
          );

          if (this.productinfoData.couponIds) {
            let arr = this.productinfoData.couponIds;

            let rescouponinfo = await getcouponinfo(arr[0]);
            this.conponCard = rescouponinfo.data.data.coupon.name;
          }
        } else {
          // 商品添加
          this.id = null;
          this.isFix = false;
        }
      }
    );
    if (this.$route.params.isFix) {
      this.isFix = true;
    }
    let resgetproductinfo = await getproductinfo(this.id);
    this.productinfoData = resgetproductinfo.data.data;

    // 全国包邮
    let resshiptemplates = await getshiptemplates();
    this.shiptemplates = resshiptemplates.data.data.list;

    // 商品分类
    let resgetshopTree = await getshopTree();
    resgetshopTree.data.data.forEach((item) => {
      let obj = {
        label: null,
        value: null,
        children: [],
      };
      obj.label = item.name;
      obj.value = item.id;
      item.child.forEach((index) => {
        let chi = { label: null, value: null };
        chi.label = index.name;
        chi.value = index.id;
        obj.children.push(chi);
      });
      this.shopTree.push(obj);
    });

    console.log(this.productinfoData);
    let cateidarr = this.productinfoData.cateId.split(",");
    console.log(cateidarr);

    let nowTreeArr = [];

    // 商品分类默认渲染
    this.shopTree.forEach((index) => {
      index.children.forEach((item) => {
        cateidarr.forEach((i) => {
          if (item.value == i) {
            let arr = [index.value, item.value];
            nowTreeArr.push(arr);
          }
        });
      }); 
    });
    this.nowTree = nowTreeArr;

    // 商品轮播图
    this.productinfoData.sliderImage = JSON.parse(
      this.productinfoData.sliderImage
    );
    console.log(this.productinfoData.sliderImage);
  },
  methods: {
    // 切换步骤
    nextstep() {
      if (this.active++ > 2) this.active = 2;
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitfix() {
      console.log(this.productinfoData);
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.creatProduct {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  transition: width 0.3s ease-in-out;
  height: auto;
  position: relative;
  .top {
    margin-bottom: 20px;
    border-bottom: 1px solid #e6ebf5;
  }

  .slick > div > div {
    display: flex;
    div {
      margin: 0 5px;
      span {
        padding: 2px 20px;
        color: #fff;
        border-radius: 5px;
      }
    }
    .spanbox默认 {
      background-color: #ed4014;
    }
    .spanbox秒杀 {
      background-color: #1e9fff;
    }
    .spanbox砍价 {
      background-color: #009688;
    }
    .spanbox拼团 {
      background-color: #feb900;
    }
  }
}
</style>