<template>
  <div id="dashboard">
    <!-- header -->
    <el-row :gutter="20">
      <el-col
        :span="6"
        v-for="(item, index) in headerTitle"
        :key="index"
        v-if="headerTitle.length"
      >
        <my-card
          :title="item.title"
          :titleNum="item.titleNum + ''"
          :yesterdayNmu="item.yesterdayNmu + ''"
          :unit="item.unit"
        ></my-card>
      </el-col>
    </el-row>
    <!-- console -->
    <el-row :gutter="20">
      <el-col :span="3" v-for="(item, index) in consoleData" :key="index">
        <my-console
          :iColor="item.color"
          :iType="item.type"
          :text="item.text"
          :path="item.path"
        ></my-console>
      </el-col>
    </el-row>
    <!-- orderChart -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="order-chart-wrap">
          <!-- title -->
          <my-chartTitle title="订单管理">
            <template v-slot:buttons>
              <el-radio-group
                v-model="radioChecked"
                size="medium"
                @change="radioChecked_change"
              >
                <el-radio-button
                  :label="item"
                  v-for="(item, index) in radioText"
                  :key="index"
                ></el-radio-button>
              </el-radio-group>
            </template>
          </my-chartTitle>
          <!-- 图表 -->
          <my-eCharts
            :tooltip="{
              // 提示框组件
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
              backgroundColor: 'rgba(50,50,50,0.7)',
              borderColor: 'transparent',
              textStyle: {
                color: '#fff',
              },
            }"
            :toolbox="{
              // 工具栏
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            }"
            :legend="{
              data: orderChartData.legend,
            }"
            :xAxis="[
              {
                type: 'category',
                data: orderChartData.xAxis,
                axisPointer: {
                  type: 'line',
                },
                axisLabel: {
                  interval: 0,
                  rotate: 50,
                },
              },
            ]"
            :yAxis="[
              {
                type: 'value',
                name: '金额',
                // min: 0,
                // interval: 30000,
                // max(value) {
                //   return value.max + 30000
                // },
                // splitLine: {
                //   show: false,
                // },
              },
              {
                type: 'value',
                name: '数量',
                // min: 0,
                // max(value) {
                //   return value.max
                // },
                // interval: 1,
                // splitLine: {
                //   show: false, // 不显示Y轴
                // },
              },
            ]"
            :series="orderChartData.series"
          ></my-eCharts>
        </div>
      </el-col>
    </el-row>
    <!-- userChart -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="user-chart-wrap">
          <my-chartTitle title="用户管理"></my-chartTitle>
          <!-- 图表 -->
          <my-eCharts
            :tooltip="{
              // 提示框组件
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
              backgroundColor: 'rgba(50,50,50,0.7)',
              borderColor: 'transparent',
              textStyle: {
                color: '#fff',
              },
            }"
            :toolbox="{
              // 工具栏
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            }"
            :legend="{
              show: false,
            }"
            :xAxis="[
              {
                type: 'category',
                data: userChartData.xAxis,
                axisPointer: {
                  type: 'line',
                },
                axisLabel: {
                  interval: 0,
                  rotate: 50,
                },
              },
            ]"
            :yAxis="[
              {
                type: 'value',
                name: '人数',
                min: 0,
                // interval: 1,
                max(value) {
                  return value.max
                },
              },
            ]"
            :series="[
              {
                name: '人数',
                type: 'line',
                symbol: 'none',
                smooth: true,
                itemStyle: {
                  color: '#1495EB',
                },
                areaStyle: {
                  color: '#D0EAFB',
                },
                data: userChartData.series,
              },
            ]"
          ></my-eCharts>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '@/assets/css/reset.css'
import cardTop from './components/card-top'
import cardConsole from './components/card-console.vue'
import chartTitle from './components/chart-title.vue'
const eCharts = () => import('@/components/echarts/echarts.vue')
import {
  getHeader,
  getChartThirtyOrder,
  getChartWeekOrder,
  getChartMonthOrder,
  getChartYearOrder,
  getUserChart,
} from '@/network/api/dashboard-ml/dashboard'

export default {
  name: 'Dashboard',
  components: {
    'my-card': cardTop,
    'my-console': cardConsole,
    'my-chartTitle': chartTitle,
    'my-eCharts': eCharts,
  },
  data() {
    return {
      headerTitle: [],
      consoleData: [
        {
          color: '#69C0FF',
          type: 'user',
          text: '会员管理',
          path: '/user/index',
        },
        {
          color: '#95DE64',
          type: 's-tools',
          text: '系统设置',
          path: '/operation/setting',
        },
        {
          color: '#FF9C73',
          type: 'goods',
          text: '商品',
          path: '/store/index',
        },
        {
          color: '#B37FEB',
          type: 's-order',
          text: '订单管理',
          path: '/order/index',
        },
        {
          color: '#FFD666',
          type: 'message',
          text: '短信配置',
          path: '/operation/systemSms/config',
        },
        {
          color: '#5CDBD3',
          type: 'notebook-1',
          text: '文件管理',
          path: '/content/articleManager',
        },
        {
          color: '#FF85C0',
          type: 's-finance',
          text: '分销管理',
          path: '/distribution/index',
        },
        {
          color: '#FFC069',
          type: 's-ticket',
          text: '优惠券',
          path: '/marketing/coupon/list',
        },
      ],
      radioText: ['30天', '周', '月', '年'],
      radioChecked: '30天',
      orderChartData: {}, // 订单图表数据
      userChartData: {}, // 用户图表数据
      a: 0,
    }
  },
  async created() {
    // 获取header数据
    let res = await getHeader()
    this.makeHeaderData(res)
    // 初始化订单图表数据
    this.requestThirtyData()
    // 初始化用户图表数据
    this.requestUserChartData()
  },
  computed: {},
  methods: {
    // 事件函数区----------------------------------
    // 图表30天、周、月、年切换按钮点击事件
    radioChecked_change(radioLabel) {
      switch (radioLabel) {
        case '30天':
          this.requestThirtyData()
          break
        case '周':
          this.requestChartData(getChartWeekOrder, '周')
          break
        case '月':
          this.requestChartData(getChartMonthOrder, '月')
          break
        case '年':
          this.requestChartData(getChartYearOrder, '年')
          break
      }
    },
    // 函数区-------------------------------------
    // 加工header数据为可以循环遍历的数据
    makeHeaderData(headerData) {
      let {
        newUserNum,
        orderNum,
        pageviews,
        sales,
        yesterdayNewUserNum,
        yesterdayOrderNum,
        yesterdayPageviews,
        yesterdaySales,
      } = headerData.data.data
      this.headerTitle.push({
        title: '销售额',
        titleNum: sales,
        yesterdayNmu: yesterdaySales,
        unit: '元',
      })
      this.headerTitle.push({
        title: '用户访问量',
        titleNum: pageviews,
        yesterdayNmu: yesterdayPageviews,
        unit: '',
      })
      this.headerTitle.push({
        title: '订单量',
        titleNum: orderNum,
        yesterdayNmu: yesterdayOrderNum,
        unit: '单',
      })
      this.headerTitle.push({
        title: '新增用户',
        titleNum: newUserNum,
        yesterdayNmu: yesterdayNewUserNum,
        unit: '人',
      })
    },
    // 获取图表-->三十天订单数据
    async requestThirtyData() {
      let res = await getChartThirtyOrder()
      // 修改图表展示信息
      this.orderChartData = {
        xAxis: Object.keys(res.data.data.price),
        legend: [
          {
            name: '订单金额',
            itemStyle: {
              color: '#5B8FF9',
            },
          },
          {
            name: '订单数',
            itemStyle: {
              color: '#4BCAD5',
            },
          },
        ],
        series: [
          {
            name: '订单金额',
            type: 'bar',
            itemStyle: {
              color: '#5B8FF9',
            },
            data: Object.values(res.data.data.price),
          },
          {
            name: '订单数',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            itemStyle: {
              color: '#4BCAD5',
            },
            data: Object.values(res.data.data.quality),
          },
        ],
      }
    },
    // 获取订单图表数据
    async requestChartData(method, time) {
      // console.log(time)
      // 请求数据
      let res = await method()
      // console.log(res)
      // 修改图表展示信息
      this.orderChartData = {
        xAxis: Object.keys(res.data.data.price),
        legend: [
          {
            name: `上${time}金额`,
            itemStyle: {
              color: '#5B8FF9',
            },
          },
          {
            name: `本${time}金额`,
            itemStyle: {
              color: '#4BCAD5',
            },
          },
          {
            name: `上${time}订单数`,
            itemStyle: {
              color: '#E8AA4E',
            },
          },
          {
            name: `本${time}订单数`,
            itemStyle: {
              color: '#999',
            },
          },
        ],
        series: [
          {
            name: `上${time}金额`,
            type: 'bar',
            itemStyle: {
              color: '#5B8FF9',
            },
            data: Object.values(res.data.data.prePrice),
          },
          {
            name: `本${time}金额`,
            type: 'bar',
            itemStyle: {
              color: '#4BCAD5',
            },
            data: Object.values(res.data.data.price),
          },
          {
            name: `上${time}订单数`,
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: {
              color: '#E8AA4E',
            },
            data: Object.values(res.data.data.preQuality),
          },
          {
            name: `本${time}订单数`,
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: {
              color: '#999',
            },
            data: Object.values(res.data.data.quality),
          },
        ],
      }
    },
    // 获取用户图表数据
    async requestUserChartData() {
      // 请求数据
      let res = await getUserChart()
      // console.log(res)
      // 修改图表展示信息
      this.userChartData = {
        xAxis: Object.keys(res.data.data),
        series: Object.values(res.data.data),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#dashboard {
  // border: 1px solid green;
  // width: calc(100% - 200px);
  width: 100%;
  background-color: #f5f5f5;
  // padding-left: 20px;
  // padding-top: 20px;
  // box-sizing: border-box;

  .order-chart-wrap {
    @include wrap-base-style;
  }

  .user-chart-wrap {
    @include wrap-base-style;
  }
}
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}
</style>
