import axios from "@/network/request";
/**
 作用：用于砍价管理部分api请求
 时间：2022-11-1
 作者：张晓瑜
 */
//砍价商品列表
export const getBargainTable = (page, limit, status) => {
    return axios({
        method: "get",
        url: "/api/admin/store/bargain/list",
        params: {
            page,
            limit,
            status
        }
    })
}
//删除砍价商品
export const bargainGoodsDelete = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/bargain/delete",
        params: {
            id
        }
    })
}
//砍价列表
export const getBargainList = (page, limit, status, dateLimit) => {
    return axios({
        method: "get",
        url: "/api/admin/store/bargain/bargain_list",
        params: {
            page,
            limit,
            status,
            dateLimit
        }
    })
}
//查看砍价详情
export const getBargainInfo = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/bargain/bargain_list" + `/${id}`,
    })
}
//砍价商品状态修改
export const reviseBargainGoodsStatus = (id, status) => {
    return axios({
        method: "post",
        url: "/api/admin/store/bargain/update/status" + "?" + `id=${id}` + "&" + `status=${status}`
    })
}
