import axios from "@/network/request";
/**
 作用：用于拼团管理部分api请求
 时间：2022-11-1
 作者：张晓瑜
 */
//获取拼团商品列表
export const getGroupGoodsTable = (page, limit, isShow) => {
    return axios({
        method: "get",
        url: "/api/admin/store/combination/list",
        params: {
            page,
            limit,
            isShow
        }
    })
}
//修改拼团商品状态
export const reviseGroupGoodsStatus = (id, isShow) => {
    return axios({
        method: "post",
        url: "/api/admin/store/combination/update/status" + "?" + `id=${id}` + "&" + `isShow=${isShow}`
    })
}
//删除拼团商品 groupGoodsDelete
export const groupGoodsDelete = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/combination/delete",
        params: {
            id
        }
    })
}
//拼团列表
export const getGroupList = (page, limit, status, dateLimit) => {
    return axios({
        method: "get",
        url: "/api/admin/store/combination/combine/list",
        params: {
            page,
            limit,
            status,
            dateLimit
        }
    })
}
//查看拼团商品详情
export const getGroupInfo = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/combination/order_pink" + `/${id}`,
    })
}
//拼团统计
export const getGroupStatistics = () => {
    return axios({
        method: "get",
        url: "/api/admin/store/combination/statistics",
    })
}
