0<template>
  <!-- 商品管理 -->
  <div class="pageView">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 标签卡 -->
      <el-tab-pane
        :label="item.name + '(' + item.count + ')'"
        :name="item.name"
        v-for="(item, index) in shopTab"
        :key="index"
      >
        <!-- 上方功能区 -->
        <div class="store-top">
          <div class="top1">
            <!-- 选择器 -->
            <span>商品分类: </span>
            <el-cascader
              :options="shopTree"
              clearable
              :value="nowTree"
              :props="{ expandTrigger: 'hover' }"
              @change="changeTree"
            ></el-cascader>
            <!-- 搜索框 -->
            <span>商品搜索: </span>
            <el-input
              placeholder="请输入商品名称、关键字、商品ID"
              v-model="search"
              clearable
              @change="searchStore"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchStore"
              ></el-button>
            </el-input>
          </div>
          <div class="top2">
            <el-button size="medium" type="primary" plain @click="gotoCreat"
              >添加商品</el-button
            >
            <el-button size="medium" type="success" plain>商品采集</el-button>
            <el-button size="medium" type="info" plain>
              <i class="el-icon-upload2"></i>导出
            </el-button>
          </div>
        </div>
        <!-- 下方表格 -->
        <div class="store-table">
          <el-table :data="shopList" style="width: 100%" v-loading="loading">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="center" class="demo-table-expand">
                  <el-form-item label="商品分类 :">
                    <span
                      class="spanbox-tree"
                      v-for="(item, index) in props.row.cateValues.split(',')"
                      :key="index"
                      >{{ item }}</span
                    >
                  </el-form-item>
                  <el-form-item label="市场价 :">
                    <span>{{ props.row.otPrice }}</span>
                  </el-form-item>
                  <el-form-item label="成本价 :">
                    <span>{{ props.row.cost }}</span>
                  </el-form-item>
                  <el-form-item label="虚拟销量 :">
                    <span>{{ props.row.ficti }}</span>
                  </el-form-item>
                  <el-form-item label="收藏 :">
                    <span>{{ props.row.collectCount }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" min-width="40">
            </el-table-column>
            <el-table-column prop="image" label="商品图片" min-width="70">
              <template slot-scope="props">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="props.row.image"
                  :preview-src-list="JSON.parse(props.row.sliderImage)"
                >
                  >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="storeName"
              label="商品名称"
              min-width="290"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品售价"
              min-width="90"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="sales"
              label="商品销量"
              min-width="90"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="stock"
              label="商品库存"
              min-width="90"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="50" align="center">
            </el-table-column>
            <el-table-column
              prop="addTime"
              label="添加时间"
              min-width="170"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="isShow"
              label="状态"
              min-width="110"
              align="center"
            >
              <template slot-scope="props">
                <el-switch
                  v-model="props.row.isShow"
                  active-color="#1890ff"
                  inactive-color="#dcdfe6"
                  @change="offOnShell(props.row.isShow, props.row.id)"
                  :disabled="tabIndex == 5"
                >
                </el-switch>
                <span class="switch-span">
                  {{
                    tabIndex == 5
                      ? "回收站"
                      : props.row.isShow
                      ? "上架"
                      : "未上架"
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="操作"
              min-width="180"
              align="center"
            >
              <template slot-scope="props">
                <!-- 点击前往详情页面 -->
                <span class="infoSpan" @click="gotoInfo(props.row.id)"
                  >详情</span
                >
                <span
                  class="infoSpan"
                  v-if="tabIndex == 2"
                  @click="gotoFix(props.row.id)"
                  >编辑</span
                >
                <!-- 点击删除至回收站 -->
                <span
                  v-if="tabIndex != 5"
                  class="deleteSpan"
                  @click="gotoDelete(props.row.id)"
                >
                  加入回收站
                </span>
                <span
                  v-if="tabIndex == 5"
                  class="deleteSpan"
                  @click="gotoRestore(props.row.id)"
                >
                  恢复商品
                </span>
                <span v-if="tabIndex == 5" class="deleteSpan"> 删除 </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getShopTab,
  getShopList,
  getshopTree,
  getDelete,
  getRestore,
  getOffShell,
  getOnShell,
} from "@/network/api/shop";
import { MessageBox, Message } from "element-ui";

export default {
  name: "store",
  components: {
    // Pages,
  },
  data() {
    return {
      search: "",
      tabIndex: 1, // 当前标签索引
      nowTree: null, // 当前分类
      activeName: "出售中商品", // 默认选中的标签页
      shopTab: [], // 标签数据
      shopList: [], // 表格数据
      shopTree: [], // 分类数据
      loading: true, // 判断加载动画

      page: 1, //当前页
      limit: 5, //显示多少条
      totle: null,
    };
  },
  async created() {
    // 获取表头数据
    let resgetShopTab = await getShopTab();
    this.shopTab = resgetShopTab.data.data;

    // 获取商品分类数据
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

    // 加载动画
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);

    // 获取商品列表数据(初次加载)
    let resgetShopList = await getShopList(
      1,
      null,
      null,
      this.page,
      this.limit
    );
    this.shopList = resgetShopList.data.data.list;
    this.totle = resgetShopList.data.data.total;
    console.log(this.shopList);

    // 转换时间戳
    this.timeLocal();
  },
  methods: {
    // 切换标签
    async handleClick(tab) {
      this.loading = !this.loading;
      this.tabIndex = 1 + +tab.index;
      this.getShopListAgain();
      setTimeout(() => {
        this.loading = !this.loading;
      }, 500);
    },

    // 选择商品分类
    async changeTree(arr) {
      this.nowTree = arr[1] || null;
      this.getShopListAgain();
    },

    // 搜索商品
    async searchStore() {
      this.getShopListAgain();
    },

    // 下架or上架商品
    async offOnShell(isShow, id) {
      if (!isShow) {
        await getOffShell(id).then(() => {
          Message({
            type: "success",
            message: "下架成功!",
          });
        });
      } else if (isShow) {
        await getOnShell(id).then(() => {
          Message({
            type: "success",
            message: "上架成功!",
          });
        });
      }
      this.getShopListAgain();
    },

    // 时间戳转换
    timeLocal() {
      this.shopList.forEach((index) => {
        let d = new Date(index.addTime * 1000);
        index.addTime = d.toLocaleString();
      });
    },

    // 点击加入回收站
    gotoDelete(id) {
      MessageBox.confirm(`是否将id为${id}的商品加入回收站`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Message({
            type: "success",
            message: "加入回收站成功!",
          });
          getDelete(id);
          this.getShopListAgain();
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 点击恢复商品
    gotoRestore(id) {
      MessageBox.confirm(`是否恢复id为${id}的商品`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Message({
            type: "success",
            message: "恢复成功!",
          });
          getRestore(id);
          this.getShopListAgain();
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 重新获取数据(用于操作后刷新表格)
    getShopListAgain() {
      this.fn();
    },
    async fn() {
      let resgetShopTab = await getShopTab();
      this.shopTab = resgetShopTab.data.data;
      let resgetShopList = await getShopList(
        this.tabIndex,
        this.nowTree,
        this.search,
        this.page,
        this.limit
      );
      this.shopList = resgetShopList.data.data.list;
      this.totle = resgetShopList.data.data.total;
      this.timeLocal();
    },

    // 跳转添加商品页面
    gotoCreat() {
      this.$router.push({
        path: "/store/creatProduct",
      });
    },

    // 跳转商品详情页
    gotoInfo(id) {
      this.$router.push({
        name: "商品详情",
        params: { id, isFix: 1 },
      });
    },

    // 跳转商品修改页
    gotoFix(id) {
      this.$router.push({
        name: "商品修改",
        params: { id },
      });
    },

    // 分页操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getShopListAgain();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getShopListAgain();
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.pageView {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  transition: width 0.3s ease-in-out;
  height: auto;
  position: relative;
}
.el-table {
  font-size: 7px;
}
.demo-table-expand {
  padding-left: 200px;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.spanbox-tree {
  border: 1px #d9ecff solid;
  background-color: #ecf5ff;
  margin-left: 4px;
  padding: 1px 5px;
  color: #409eff;
}
.table-img {
  width: 30px;
  height: 30px;
}
.store-top {
  margin-bottom: 10px;
  padding-bottom: 20px;
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
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>