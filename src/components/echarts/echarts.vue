<!-- 沐斓的 echarts二次封装文件 可公用 -->

<template>
  <div ref="homeEChart" id="echarts"></div>
</template>

<script>
//引入按需文件
import echarts from './index'

export default {
  name: 'echarts',
  props: {
    title: {
      type: Object,
      default: function () {
        return {}
      },
    },
    tooltip: {
      type: Object,
      default: function () {
        return {}
      },
    },
    toolbox: {
      type: Object,
      default: function () {
        return {}
      },
    },
    legend: {
      type: Object,
      default: function () {
        return {}
      },
    },
    xAxis: {
      type: Array,
      default: function () {
        return []
      },
    },
    yAxis: {
      type: Array,
      default: function () {
        return []
      },
    },
    series: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    let { title, tooltip, legend, xAxis, yAxis, series } = this.$props
    return {
      title_self: title,
      tooltip_self: tooltip,
      legend_self: legend,
      xAxis_self: xAxis,
      yAxis_self: yAxis,
      series_self: series,
    }
  },
  methods: {
    createEcharts() {
      let {
        title_self,
        tooltip_self,
        legend_self,
        xAxis_self,
        yAxis_self,
        series_self,
      } = this
      //初始化echarts实例
      let myEcharts = echarts.init(this.$refs.homeEChart)
      let option = {
        title: title_self,
        tooltip: tooltip_self,
        legend: legend_self,
        series: series_self,
      }
      Object.keys(xAxis_self).length ? (option.xAxis = xAxis_self) : null
      Object.keys(yAxis_self).length ? (option.yAxis = yAxis_self) : null
      myEcharts.setOption(option, true)
    },
  },
  watch: {
    '$props.legend'(legend) {
      this.legend_self = legend
      this.createEcharts()
    },
    '$props.xAxis'(xAxis) {
      this.xAxis_self = xAxis
      this.createEcharts()
    },
    '$props.series'(series) {
      this.series_self = series
      this.createEcharts()
    },
  },
  // 解决刷新以后，图表消失问题
  mounted() {
    // 让  指定id 的 div 的_echarts_instance_属性值 为 空状态
    document.getElementById('echarts').removeAttribute('_echarts_instance_')
    let aaa = echarts.init(document.getElementById('echarts'))
    // let option = {......};
    // 让 配置数据 生效
    // aaa.setOption(option)
    this.createEcharts()
    //响应 元素宽度 的实时变化
    top.addEventListener('resize', () => {
      aaa.resize()
    })
  },
}
</script>

<style>
#echarts {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
</style>
