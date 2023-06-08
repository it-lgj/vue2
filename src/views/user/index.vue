<template>
  <div id="ent">
    <div class="title">
      <!-- 搜索表单 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="item.name"
          :name="item.type.toString()"
          v-for="(item, index) in headeNum"
          :key="index"
        />
      </el-tabs>
      <div class="search">
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="userFrom"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
              <el-col v-bind="grid">
                <el-form-item label="用户搜索:">
                  <el-input
                    v-model="userFrom.keywords"
                    placeholder="请输入姓名或手机号"
                    class="selWidth"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-col>

            <template v-if="collapse">
              <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                <el-col v-bind="grid">
                  <el-form-item label="用户等级:">
                    <el-select
                      v-model="dengji"
                      placeholder="请选择"
                      class="selWidth"
                    >
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) in savelist"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="用户分组:">
                    <el-select
                      v-model="fenzu"
                      placeholder="请选择"
                      class="selWidth"
                    >
                      <el-option
                        :label="item.groupName"
                        :value="item.id"
                        v-for="(item, index) in grouplist"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="用户标签:">
                    <el-select
                      v-model="biaoqian"
                      placeholder="请选择"
                      class="selWidth"
                    >
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) in tagLists"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                <el-col v-bind="grid">
                  <el-form-item label="国家：">
                    <el-select
                      v-model="userFrom.country"
                      placeholder="请选择"
                      class="selWidth"
                      clearable
                      @on-change="changeCountry"
                    >
                      <el-option value="" label="全部"></el-option>
                      <el-option value="CN" label="中国"></el-option>
                      <el-option value="OTHER" label="国外"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid" v-if="userFrom.country === 'CN'">
                  <el-form-item label="省份：">
                    <el-cascader
                      :options="addresData"
                      :props="propsCity"
                      filterable
                      v-model="address"
                      @change="handleChange"
                      clearable
                      class="selWidth "
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="消费情况：">
                    <el-select
                      v-model="userFrom.payCount"
                      placeholder="请选择"
                      class="selWidth"
                      clearable
                    >
                      <el-option value="" label="全部"></el-option>
                      <el-option value="0" label="0"></el-option>
                      <el-option value="1" label="1+"></el-option>
                      <el-option value="2" label="2+"></el-option>
                      <el-option value="3" label="3+"></el-option>
                      <el-option value="4" label="4+"></el-option>
                      <el-option value="5" label="5+"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="时间选择：" class="timeBox">
                    <el-date-picker
                      v-model="timeVal"
                      type="daterange"
                      class="selWidth"
                    />
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                <el-col v-bind="grid">
                  <el-form-item label="访问情况：">
                    <el-select
                      v-model="userFrom.accessType"
                      placeholder="请选择"
                      class="selWidth"
                      clearable
                    >
                      <el-option :value="0" label="全部"></el-option>
                      <el-option :value="1" label="首次访问"></el-option>
                      <el-option :value="2" label="时间段访问过"></el-option>
                      <el-option :value="3" label="时间段未访问"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="性别：">
                    <el-radio-group
                      v-model="userFrom.sex"
                      type="button"
                      class="selWidth"
                    >
                      <el-radio-button label="">
                        <span>全部</span>
                      </el-radio-button>
                      <el-radio-button label="0">
                        <span>未知</span>
                      </el-radio-button>
                      <el-radio-button label="1">
                        <span>男</span>
                      </el-radio-button>
                      <el-radio-button label="2">
                        <span>女</span>
                      </el-radio-button>
                      <el-radio-button label="3">
                        <span>保密</span>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col v-bind="grid">
                  <el-form-item label="身份：">
                    <el-radio-group
                      v-model="userFrom.isPromoter"
                      type="button"
                      class="selWidth"
                    >
                      <el-radio-button label="">
                        <span>全部</span>
                      </el-radio-button>
                      <el-radio-button label="1">
                        <span>推广员</span>
                      </el-radio-button>
                      <el-radio-button label="0">
                        <span>普通用户</span>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-col>
            </template>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="6"
              :xl="6"
              class="text-right userFrom"
            >
              <el-form-item>
                <el-button
                  type="primary"
                  icon="ios-search"
                  label="default"
                  class="mr15"
                  size="small"
                  @click="userSearchs"
                  >搜索</el-button
                >
                <el-button class="ResetSearch mr10" @click="reset" size="small"
                  >重置</el-button
                >
                <a class="ivu-ml-8" @click="collapse = !collapse">
                  <template v-if="!collapse">
                    展开 <i class="el-icon-arrow-down"></i>
                  </template>
                  <template v-else>
                    收起 <i class="el-icon-arrow-up"></i>
                  </template>
                </a>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="btn">
        <el-button type="primary" @click="setCoupons">发送优惠卷</el-button>
        <el-button @click="setFenzu('setUp')">批量设置分组</el-button>
        <el-button @click="setFenzu('biaoqian')">批量设置标签</el-button>
      </div>

      <!-- 发送优惠卷 -->
      <div>
        <el-dialog title="优惠卷" :visible.sync="coupons" width="1000px">
          <div>
            <span>优惠卷名称:</span>
            <el-input
              v-model="couponsname"
              placeholder="请输入优惠卷名称"
              style="width: 200px; margin-left: 20px"
            ></el-input>
            <el-button type="primary" @click="swit">搜索</el-button>
          </div>
          <el-table :data="couponsusername">
            <el-table-column prop="id" label="ID" width="100">
            </el-table-column>
            <el-table-column prop="name" label="优惠卷名称" width="130">
            </el-table-column>
            <el-table-column prop="money" label="优惠卷面值" width="130">
            </el-table-column>
            <el-table-column prop="minPrice" label="最低消费额" width="130">
            </el-table-column>
            <el-table-column label="有效期限" width="200">
              <template slot-scope="props">
                {{ !props.row.isFixedTime ? "不限制" : "不限制" }}
              </template>
            </el-table-column>
            <el-table-column label="剩余数量" width="120">
              <template slot-scope="props">
                <div>
                  {{ !props.row.isLimited ? "不限量" : props.row.lastTotal }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="操作" width="140">
              <template slot-scope="scope">
                <el-button type="text" @click="coursetext(scope.row.id)"
                  >发送</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination
              :page-sizes="[15, 30, 45, 60]"
              :page-size="userFrom.limit"
              :current-page="userFrom.page"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagetotal"
              @size-change="handleSizeChange"
              @current-change="pageChange"
            >
            </el-pagination>
          </div>
        </el-dialog>
        <div>
          <el-dialog title="提示" :visible.sync="savecoupon" width="30%">
            <div style="height: 30px; line-height: 30px">
              <span
                class="el-icon-warning"
                style="color: #ffba00; font-size: 24px; margin-top: 3px"
              ></span>
              <span style="height: 24px; line-height: 24px; margin-top: 15px"
                >确定发送优惠卷吗</span
              >
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="savecoupon = false">取 消</el-button>
              <el-button
                type="primary"
                @click="
                  delecoupon();
                  savecoupon = false;
                "
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>
      <div></div>
      <!-- 设置分组标签 -->
      <div>
        <el-dialog title="设置" :visible.sync="dialogFormVisible" width="500px">
          <el-form :model="form">
            <el-form-item
              label="用户分组"
              :label-width="formLabelWidth"
              v-if="fenzuName === 'setUp'"
            >
              <el-select
                v-model="form.region"
                placeholder="请选择分组"
                style="width: 300px"
                @change="cender(form.region)"
              >
                <el-option
                  :label="item.groupName"
                  :value="item.id"
                  v-for="(item, index) in grouplist"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户标签" :label-width="formLabelWidth" v-else>
              <el-select
                v-model="form.region"
                placeholder="请选择标签"
                style="width: 300px"
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) in tagLists"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="
                savetab();
                dialogFormVisible = false;
              "
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>

      <!-- 渲染表格数据 -->
      <div class="table">
        <el-table :data="tableData" style="width: 100%" ref="table">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="身份">
                  <span>{{
                    props.row.isPromoter ? "推广员" : "普通用户"
                  }}</span>
                </el-form-item>
                <el-form-item label="首次访问">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="近次访问">
                  <span>{{ props.row.lastLoginTime }}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <span>{{ props.row.phone }}</span>
                </el-form-item>
                <el-form-item label="标签">
                  <span>{{ props.row.tagName }}</span>
                </el-form-item>
                <el-form-item label="地址">
                  <span>{{ props.row.addres }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.mark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="ID" prop="uid"> </el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <div class="demo-image__preview">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="scope.row.avatar"
                  :preview-src-list="[scope.row.avatar]"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="nickname"> </el-table-column>
          <el-table-column label="用户等级">
            <template slot-scope="scope">
              <span>{{ scope.row.level | levelFilter() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分组" prop="groupName"> </el-table-column>
          <el-table-column label="推荐人" prop="spreadNickname">
          </el-table-column>
          <el-table-column label="手机号" prop="phone"> </el-table-column>
          <el-table-column label="余额" prop="nowMoney"> </el-table-column>
          <el-table-column label="积分" prop="integral"> </el-table-column>
          <el-table-column label="操作"  fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="Editor(scope.row)">编辑</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="xiangqing(scope.row.uid)"
                    >账户详情</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="integral(scope.row.uid)"
                    >积分余额</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="setFenzu('setUp', scope.row)"
                    >设置分组</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="setFenzu('biaoqian', scope.row)"
                    >设置标签</el-dropdown-item
                  >
                  <el-dropdown-item>修改手机号</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="onLevel(scope.row.uid, scope.row.level)"
                    >修改用户等级</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="setExtension(scope.row)"
                    >修改上级推广人</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="clearSpread(scope.row)"
                    v-if="scope.row.spreadUid && scope.row.spreadUid > 0"
                    >清除上级推广人</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="fenye">
        <el-pagination
          :page-sizes="[15, 30, 45, 60]"
          :page-size="userFrom.limit"
          :current-page="userFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>

      <!-- 编辑 -->
      <div>
        <el-dialog title="编辑" :visible.sync="bianji" width="600px">
          <el-form :model="ruleForm">
            <el-form-item label="用户编号" :label-width="formLabelWidth">
              <el-input
                v-model="ruleForm.id"
                autocomplete="off"
                disabled
                class="selWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户地址" :label-width="formLabelWidth">
              <el-input
                v-model="ruleForm.addres"
                autocomplete="off"
                class="selWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户备注" :label-width="formLabelWidth">
              <el-input
                v-model="ruleForm.mark"
                type="textarea"
                autocomplete="off"
                class="selWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户分组" :label-width="formLabelWidth">
              <el-select
                v-model="ruleForm.groupId"
                placeholder="请选择"
                class="selWidth"
              >
                <el-option
                  :label="item.groupName"
                  :value="item.id"
                  v-for="(item, index) in grouplist"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户标签" :label-width="formLabelWidth">
              <el-select
                v-model="ruleForm.level"
                placeholder="请选择"
                class="selWidth"
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) in tagLists"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推广员" style="margin-left: 10px">
              <el-radio-group v-model="ruleForm.isPromoter">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" style="margin-left: 10px">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="bianji = false">取 消</el-button>
            <el-button
              type="primary"
              @click="
                savechange();
                bianji = false;
              "
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>

      <!-- 用户详情 -->
      <div>
        <el-dialog
          title="用户详情"
          :visible.sync="Visible"
          width="1100px"
          v-if="uid"
          :before-close="Close"
        >
          <el-username
            ref="userDetails"
            :uid="uid"
            v-if="Visible"
          ></el-username>
        </el-dialog>
      </div>

      <!-- 用户等级 -->
      <div>
        <el-dialog
          title="设置"
          :visible.sync="levelVisible"
          width="600px"
          :before-close="Close"
        >
          <el-userlable
            :levelInfo="levelInfo"
            :levelList="levelList"
          ></el-userlable>
        </el-dialog>
      </div>

      <!-- 积分设置 -->
      <div>
        <el-dialog
          title="积分余额"
          :visible.sync="VisiblePoint"
          width="500px"
          :close-on-click-modal="false"
        >
          <el-form
            :model="PointValidateForm"
            ref="PointValidateForm"
            label-width="100px"
            class="demo-dynamic"
          >
            <el-form-item label="修改余额" required>
              <el-radio-group v-model="PointValidateForm.moneyType">
                <el-radio :label="1">增加</el-radio>
                <el-radio :label="2">减少</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="余额" required>
              <el-input-number
                type="text"
                v-model="PointValidateForm.moneyValue"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="999999"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="修改积分" required>
              <el-radio-group v-model="PointValidateForm.integralType">
                <el-radio :label="1">增加</el-radio>
                <el-radio :label="2">减少</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="积分" required>
              <el-input-number
                type="text"
                step-strictly
                v-model="PointValidateForm.integralValue"
                :min="0"
                :max="999999"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handlePointClose">取 消</el-button>
            <el-button
              type="primary"
              :loading="loadingBtn"
              @click="submitPointForm('PointValidateForm')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>

      <!-- 修改上级推广人 -->
      <el-dialog
        title="修改推广人"
        :visible.sync="extensionVisible"
        width="500px"
        :before-close="handleCloseExtension"
      >
        <el-form
          class="formExtension mt20"
          ref="formExtension"
          :model="formExtension"
          :rules="ruleInline"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="用户头像：" prop="image">
            <div class="images" @click="modalPicTap">
              <div v-if="formExtension.image" class="pictrue">
                <img :src="formExtension.image" />
              </div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm('formExtension')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog title="用户列表" :visible.sync="userVisible" width="900px">
        <el-userfood
          v-if="userVisible"
          @getTemplateRow="getTemplateRow"
        ></el-userfood>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userVisible = false">取 消</el-button>
          <el-button type="primary" @click="userVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  userLever,
  userList,
  systemuser,
  usertagList,
  systemcity,
  usergroup,
  userdate,
  couponsend,
  couponreceive,
  foundsApi,
  updateSpread,
  spreadDelete,
} from "@/network/api/user";
import username from "./username.vue";
import userlable from "./userLevel.vue";
import userfood from "./userfood.vue";
export default {
  components: {
    "el-username": username,
    "el-userlable": userlable,
    "el-userfood": userfood,
  },
  data() {
    return {
      levelInfo: "",
      levelList: [],
      labelData: [],
      headeNum: [
        { type: "", name: "全部用户" },
        { type: "wechat", name: "微信公众号用户" },
        { type: "routine", name: "微信小程序用户" },
        { type: "h5", name: "H5用户" },
      ],
      PointValidateForm: {
        integralType: 2,
        integralValue: 0,
        moneyType: 2,
        moneyValue: 0,
        uid: "",
      },
      loadingBtn: false,
      ruleForm: {
        id: null,
        mark: "",
        addres: "",
        groupId: "",
        level: "",
        isPromoter: false,
        status: false,
      },
      propsCity: {
        children: "child",
        label: "name",
        value: "name",
      },
      collapse: false,
      page: null,
      savelist: [],
      grouplist: [],
      taglists: [],
      addresData: [],
      propsCity: {
        children: "child",
        label: "name",
        value: "name",
      },
      activeName: "",
      userFrom: {
        labelId: "",
        userType: "",
        sex: "",
        isPromoter: "",
        country: "",
        payCount: "",
        accessType: 0,
        dateLimit: "",
        keywords: "",
        province: "",
        city: "",
        page: 1,
        limit: 15,
        level: "",
        groupId: "",
      },
      formExtension: {
        image: "",
        spreadUid: "",
        userId: "",
      },
      ruleInline: {},
      dengji: "",
      fenzu: "",
      biaoqian: "",
      liverList: [],
      labelPosition: "right",
      grid: {
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      },
      timeVal: "",
      selectedData: [],
      address: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogForm: false,
      bianji: false,
      coupons: false,
      savecoupon: false,
      Visible: false,
      levelVisible: false,
      VisiblePoint: false,
      extensionVisible: false,
      userVisible: false,
      couponsusername: "",
      couponsname: "",
      pagetotal: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "80px",
      fenzuName: "",
      tableData: [],
      bianji: false,
      radio: "1",
      groupId: "",
      x: [],
      row: "",
      uid: 0,
      unid: "",
      couponsendin: {
        page: 1,
        limit: 10,
        type: 1,
        keywords: "",
      },
    };
  },
  // mounted(){
  //     this.getCityList();
  // },
  methods: {
    //  async getCityList() {
    //   let res = await logistics.cityListTree();
    //   this.addresData = res;
    // },

    // 用户详情
    xiangqing(id) {
      this.uid = id;
      this.Visible = true;
    },
    Close() {
      this.Visible = false;
      this.levelVisible = false;
    },

    // 修改用户等级
    onLevel(id, level) {
      console.log(this.tableData);
      console.log(id, level);
      var userLevel = new Object();
      let sex = JSON.parse(localStorage.getItem("levelKey"));
      this.levelList = sex;
      this.levelList.forEach((item) => {
        if (item.id == level) {
          userLevel.gradeLevel = item.grade;
        }
      });
      userLevel.uid = id;
      userLevel.level = level;
      this.levelInfo = userLevel;
      this.levelVisible = true;
    },

    //修改用户分组
    grouping(row) {
      console.log(row);
      this.dialogFormVisible = true;
    },

    //修改用户标签
    theLabel(row) {
      console.log(row);
      this.dialogFormVisible = true;
    },

    //修改积分
    integral(row) {
      console.log(row);
      this.VisiblePoint = true;
      this.unid = row;
    },

    //清除推广人
    clearSpread(row) {
      this.$confirm("解除【" + row.nickname + "】的上级推广人吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row.uid);
          spreadDelete(row.uid).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.username();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改推广人
    setExtension(row) {
      this.formExtension = {
        image: "",
        spreadUid: "",
        userId: row.uid,
      };
      this.extensionVisible = true;
    },
    modalPicTap() {
      this.userVisible = true;
    },
    handleCloseExtension() {
      this.extensionVisible = false;
    },

    getTemplateRow(row) {
      this.formExtension.image = row.avatar;
      this.formExtension.spreadUid = row.uid;
    },
    updateSpread() {},
    async confirm() {
      let updateSpreadInfo = await updateSpread(this.formExtension);
      console.log(updateSpreadInfo);
      this.username();
      this.extensionVisible = false;
    },
    async submitPointForm(row) {
      console.log(row);
      this.PointValidateForm.uid = this.unid;
      this.loadingBtn = true;
      foundsApi(this.PointValidateForm).then((res) => {
        this.loadingBtn = false;
        this.handlePointClose();
        this.username();
      });
    },
    handlePointClose() {
      this.VisiblePoint = false;
      this.PointValidateForm = {
        integralType: 2,
        integralValue: 0,
        moneyType: 2,
        moneyValue: 0,
        uid: "",
      };
    },

    handleClick() {
      this.userFrom.userType = this.activeName;
      this.username();
    },
    //国家省市
    changeCountry() {
      if (this.userFrom.country === "OTHER" || !this.userFrom.country) {
        this.selectedData = [];
        this.userFrom.province = "";
        this.userFrom.city = "";
        this.address = [];
      }
    },
    handleChange(value) {
      this.userFrom.province = value[0];
      this.userFrom.city = value[1];
    },
    //搜索
    userSearchs() {
      this.userFrom.level = this.dengji;
      this.userFrom.groupId = this.fenzu;
      this.userFrom.labelId = this.biaoqian;
      this.username();
    },
    //重置
    reset() {
      (this.userFrom = {
        labelId: "",
        userType: "",
        sex: "",
        isPromoter: "",
        country: "",
        payCount: "",
        accessType: 0,
        dateLimit: "",
        keywords: "",
        province: "",
        city: "",
        page: 1,
        limit: 15,
        level: "",
        groupId: "",
      }),
        (this.dengji = []),
        (this.biaoqian = []),
        (this.fenzu = []),
        (this.timeVal = []);
      this.username();
    },
    //发送优惠卷
    setCoupons() {
      this.x = [];
      let currentSelect = this.$refs.table.selection;
      if (currentSelect.length != 0) {
        this.coupons = true;
        for (let item in currentSelect) {
          this.x.push(currentSelect[item].uid);
        }
      } else {
        this.$message("请选择要设置的用户");
      }
    },

    //搜索优惠卷
    swit() {
      console.log(this.couponsname);
      this.couponsendin.keywords = this.couponsname;
      this.couponsend();
    },

    //获取优惠卷数据
    async couponsend() {
      let couponsendInfo = await couponsend(this.couponsendin);
      this.couponsusername = couponsendInfo.data.data.list;
      this.pagetotal = couponsendInfo.data.data.total;
    },

    async coursetext(row) {
      this.savecoupon = true;
      this.row = row;
    },
    async delecoupon() {
      let couponreceiveInfo = await couponreceive({
        couponId: this.row,
        uid: this.x.join(","),
      });
      console.log(couponreceiveInfo.data.code);
      if (couponreceiveInfo.data.code == 500) {
        this.$message(couponreceiveInfo.data.message);
      } else if (couponreceiveInfo.data.code == 200) {
        this.$message.success(couponreceiveInfo.data.message);
      }
      this.couponsend();
    },
    //批量设置分组
    cender(value) {
      this.groupId = value;
    },
    setFenzu(name, row) {
      if (!row) {
        this.fenzuName = name;
        let currentSelect = this.$refs.table.selection;
        if (currentSelect.length != 0) {
          this.dialogFormVisible = true;
          for (let item in currentSelect) {
            this.x.push(currentSelect[item].uid);
          }
        } else {
          this.$message("请选择要设置的用户");
        }
      } else {
        this.fenzuName = name;
        this.dialogFormVisible = true;
        this.x.push(row.uid);
        console.log(row);
      }
    },
    savetab() {
      this.usergroup();
    },
    async usergroup() {
      console.log(this.groupId, this.x);
      let usergroupInfo = await usergroup({
        groupId: this.groupId,
        id: this.x.join(","),
      });
      console.log(usergroupInfo);
      this.username();
    },
    //编辑

    Editor(scope) {
      this.ruleForm.id = scope.uid;
      this.ruleForm.mark = scope.mark;
      this.ruleForm.addres = scope.addres;
      this.ruleForm.isPromoter = scope.isPromoter;
      this.ruleForm.status = scope.status;
      this.ruleForm.groupId = scope.groupId;
      this.ruleForm.level = scope.tagId;
      this.bianji = true;
      console.log(scope);
    },
    savechange() {
      this.userdate();

      // this.ruleForm = {
      //   id: null,
      //   mark: "",
      //   addres: "",
      //   groupId: "",
      //   level: "",
      //   isPromoter: false,
      //   status: false,
      // };
    },
    async userdate() {
      console.log(this.ruleForm);
      let userdateInfo = await userdate(
        { id: this.ruleForm.id },
        this.ruleForm
      );
      this.username();
      console.log(userdateInfo);
    },

    handleChange(value) {
      this.userFrom.province = value[0];
      this.userFrom.city = value[1];
    },

    //分页
    handleSizeChange(val) {
      this.userFrom.limit = val;
      this.username();
    },
    pageChange(page) {
      this.userFrom.page = page;
      this.username();
    },

    async username() {
      this.listLoading = true;
      let userListInfo = await userList(this.userFrom);
      this.tableData = userListInfo.data.data.list;
      this.page = userListInfo.data.data.total;
    },
  },
  async created() {
    //用户等级
    let systemuserInfo = await systemuser();
    this.savelist = systemuserInfo.data.data;

    //用户分组
    let userLeverInfo = await userLever({ page: 1, limit: 9999 });
    this.grouplist = userLeverInfo.data.data.list;
    console.log(this.grouplist);

    //用户标签
    let usertagListInfo = await usertagList();
    this.tagLists = usertagListInfo.data.data.list;

    //用户地址
    let systemcityInfo = await systemcity();
    this.addresData = systemcityInfo.data.data;

    //用户信息
    this.username();
    //优惠卷信息
    this.couponsend();
  },
  filters: {
    levelFilter(status) {
      if (!status) {
        return "";
      }
      let arrayList = JSON.parse(localStorage.getItem("levelKey"));
      let array = arrayList.filter((item) => status === item.id);
      if (array.length) {
        return array[0].name;
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped>
#ent {
  width: 100%;
  padding-left: 20px;
  padding-top: 1px;
  box-sizing: border-box;
  background-color: #fff;
}
.selWidth {
  width: 100% !important;
}
.btn {
  border-top: 1px dashed #ccc;
  padding-top: 20px;
}
.el-dialog {
  width: 30%;
}
.demo-table-expand {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 20px 50px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 10px;
  margin-bottom: 0;
  width: 30%;
}
.fenye {
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  margin-top: 25px;
}
.table {
  margin-top: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
::v-deep .el-scrollbar__wrap {
  height: 150px;
}
</style>