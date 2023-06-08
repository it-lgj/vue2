// 沐斓的 优惠券页面请求api

import axios from '@/network/request'

// 优惠券页面相关API：
// 获取优惠券列表
let getCouponListApi = '/api/admin/marketing/coupon/list'
// 删除优惠券
let delCouponApi = '/api/admin/marketing/coupon/delete'
// 更新优惠券开启/关闭状态
let updateCouponApi = '/api/admin/marketing/coupon/update/status'
// 获取产品分类选项
let getCouponClassApi = '/api/admin/category/list/tree'
// 获取商品信息
let getGoodsInfoApi = '/api/admin/store/product/list'
// 添加优惠券
let addCouponApi = '/api/admin/marketing/coupon/save'
// 获取领取了某优惠券的用户信息
let getHasCouponUserApi = '/api/admin/marketing/coupon/user/list'
// 获取领取了某优惠券的用户信息
let getUserNicknameApi = 'api/admin/user/list'

export const getCouponList = (params) => {
  return axios({
    method: 'get',
    url: getCouponListApi,
    params,
  })
}
export const delCoupon = (id) => {
  return axios({
    method: 'post',
    url: delCouponApi + `?id=${id}`,
  })
}
export const updateCoupon = (id, status) => {
  return axios({
    method: 'post',
    url: updateCouponApi + `?id=${id}&status=${status}`,
  })
}
export const getCouponClass = () => {
  return axios({
    method: 'get',
    url: getCouponClassApi,
    params: {
      status: -1,
      type: 1,
    },
  })
}
export const getGoodsInfo = (params) => {
  return axios({
    method: 'get',
    url: getGoodsInfoApi,
    params,
  })
}
export const addCoupon = (data) => {
  return axios({
    method: 'post',
    url: addCouponApi,
    data,
  })
}
export const getHasCouponUser = (params) => {
  return axios({
    method: 'get',
    url: getHasCouponUserApi,
    params,
  })
}
export const getUserNickname = (params) => {
  return axios({
    method: 'get',
    url: getUserNicknameApi,
    params,
  })
}
