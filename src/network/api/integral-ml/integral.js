// 沐斓的 积分页面请求api

import axios from '@/network/request'

// 积分配置页面相关API：
// 提交积分配置
let submitIntegralConfigApi = '/api/admin/system/config/save/form'
// 拿积分配置初始值
let getIntegralConfigApi = '/api/admin/system/config/info'

export const submitIntegralConfig = (data) => {
  return axios({
    method: 'post',
    url: submitIntegralConfigApi,
    data: {
      fields: [
        {
          name: 'integral_ratio',
          title: 'integral_ratio',
          value: data.setOff,
        },
        {
          name: 'order_give_integral',
          title: 'order_give_integral',
          value: data.give,
        },
        {
          name: 'freeze_integral_day',
          title: 'freeze_integral_day',
          value: data.dueTime,
        },
      ],
      id: 109,
      sort: 0,
      status: true,
    },
  })
}
export const getIntegralConfig = () => {
  return axios({
    method: 'get',
    url: getIntegralConfigApi,
    params: {
      formId: 109,
    },
  })
}

// 积分日志页面相关API：
// 拿积分日志列表数据
let getIntegralLogApi = '/api/admin/user/integral/list'

export const getIntegralLog = (data) => {
  return axios({
    method: 'post',
    url: getIntegralLogApi + '?' + `limit=${data.limit}&page=${data.page}`,
    data: {
      dateLimit: data.dateLimit,
      keywords: data.keywords,
    },
  })
}
