// 沐斓的 订单页面请求api

import axios from '@/network/request'

// 获取订单列表
let getOrderListApi = '/api/admin/store/order/list'
// 获取订单列表
let getOrderNumApi = 'api/admin/store/order/status/num'
// 获取订单详情
let getOrderInfoApi = '/api/admin/store/order/info'
// 获取订单记录
let getOrderNotesApi = '/api/admin/store/order/status/list'
// 添加订单备注
let addOrderMarkApi = '/api/admin/store/order/mark'
// 拿到快递公司列表
let getCompanyListApi = '/api/admin/express/all'
// 拿到发货人信息
let getSendPersonApi = '/api/admin/store/order/sheet/info'
// 提交发货信息
let sendApi = '/api/admin/store/order/send'

export const getOrderList = (params) => {
  return axios({
    method: 'get',
    url: getOrderListApi,
    params,
  })
}
export const getOrderNum = (params) => {
  return axios({
    method: 'get',
    url: getOrderNumApi,
    params,
  })
}
export const getOrderInfo = (params) => {
  return axios({
    method: 'get',
    url: getOrderInfoApi,
    params,
  })
}
export const getOrderNotes = (orderNo) => {
  return axios({
    method: 'get',
    url: getOrderNotesApi,
    params: {
      page: 1,
      limit: 10,
      orderNo,
    },
  })
}
export const addOrderMark = (data) => {
  return axios({
    method: 'post',
    url: addOrderMarkApi + `?mark=${data.mark}&orderNo=${data.orderNo}`,
  })
}
export const getCompanyList = (params) => {
  return axios({
    method: 'get',
    url: getCompanyListApi,
    params,
  })
}
export const getSendPerson = () => {
  return axios({
    method: 'get',
    url: getSendPersonApi,
  })
}
export const send = (data) => {
  return axios({
    method: 'post',
    url: sendApi,
    data,
  })
}
