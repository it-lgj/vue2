// 沐斓的 dashboard页面请求接口文件

import axios from '@/network/request'

let headerApi = '/api/admin/statistics/home/index'
// 三十天订单图表数据
let chartThirtyOrderApi = '/api/admin/statistics/home/chart/order'
// 周订单图表数据
let chartWeekOrderApi = '/api/admin/statistics/home/chart/order/week'
// 月订单图表数据
let chartMonthOrderApi = '/api/admin/statistics/home/chart/order/month'
// 年订单图表数据
let chartYearOrderApi = '/api/admin/statistics/home/chart/order/year'
// 用户图表数据
let chartUserApi = '/api/admin/statistics/home/chart/user'

export const getHeader = () => {
  return axios({
    method: 'get',
    url: headerApi,
  })
}
export const getChartThirtyOrder = () => {
  return axios({
    method: 'get',
    url: chartThirtyOrderApi,
  })
}
export const getChartWeekOrder = () => {
  return axios({
    method: 'get',
    url: chartWeekOrderApi,
  })
}
export const getChartMonthOrder = () => {
  return axios({
    method: 'get',
    url: chartMonthOrderApi,
  })
}
export const getChartYearOrder = () => {
  return axios({
    method: 'get',
    url: chartYearOrderApi,
  })
}
export const getUserChart = () => {
  return axios({
    method: 'get',
    url: chartUserApi,
  })
}
