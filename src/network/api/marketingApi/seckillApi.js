import axios from "@/network/request";
/**
 作用：用于秒杀管理部分api请求
 时间：2022-11-1
 作者：张晓瑜
 */
//秒杀配置列表
export const getSeckilltable = (page, limit, status, name) => {
    return axios({
        method: "get",
        url: "/api/admin/store/seckill/manger/list",
        params: {
            page,
            limit,
            status,
            name,
        }
    })
}
//秒杀配置状态（开启/关闭）
export const getSeckillStatus = (id, status) => {
    return axios({
        method: "post",
        url: "/api/admin/store/seckill/manger/update/status/" + id + "?" + `status=${status}`,
    })
}
//秒杀配置删除
export const seckillDelete = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/seckill/manger/delete",
        params: {
            id
        }
    })
}
//秒杀配置添加提交
export const seckillConfigAdd = (name, status, time, silderImgs) => {
    return axios({
        method: "post",
        url: "/api/admin/store/seckill/manger/save",
        data: {
            name,
            status,
            time,
            silderImgs
        }
    })
}
//秒杀配置添加配置--上传图片--菜单列表
export const getMenu = (type, status) => {
    return axios({
        method: 'get',
        url: "/api/admin/category/list/tree",
        params: {
            type,
            status,
        }

    })
}

//秒杀配置添加配置--上传图片--图片列表
export const getImgs = (page, limit, pid, attType) => {
    return axios({
        method: 'get',
        url: "/api/admin/system/attachment/list",
        params: {
            page,
            limit,
            pid,
            attType
        }

    })
}
//秒杀配置添加配置--本地图片上传
export const localImg = (model, pid, data) => {
    return axios({
        method: "post",
        url: "/api/admin/upload/image" + "?" + `model=${model}` + "&" + `pid=${pid}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        // files: {
        //     "pic": ("multipart.name", open("multipart.type"),"multipart.type")
        // },
        // multipart,
        data,
    })
}
//秒杀配置添加配置--删除图片
export const removeImg = (ids) => {
    return axios({
        method: "get",
        url: "/api/admin/system/attachment/delete" + `/${ids}`
    })
}
//秒杀配置添加配置--移动图片分类位置
export const moveImg = (attrId, pid) => {
    return axios({
        method: "post",
        url: "/api/admin/system/attachment/move",
        data: {
            attrId,
            pid
        }
    })
}
//秒杀配置新增
export const seckillAdd = (name, time, silderImgs, status) => {
    return axios({
        method: "post",
        url: "/api/admin/store/seckill/manger/save",
        data: {
            name,
            time,
            silderImgs,
            status
        }
    })
}
//秒杀商品列表
export const getSeckillGoods = (page, limit, status, keywords) => {
    return axios({
        method: "get",
        url: "/api/admin/store/seckill/list",
        params: {
            page,
            limit,
            status,
            keywords,
        }
    })
}
//秒杀商品状态（已关闭/已结束/。。）
export const getSeckillGoodsStatus = (id, status) => {
    return axios({
        method: "post",
        url: "/api/admin/store/seckill/update/status" + "?" + `id=${id}` + "&" + `status=${status}`,
    })
}
//秒杀商品配置下拉选项
export const seckillSelect = (page, limit) => {
    return axios({
        method: "get",
        url: "/api/admin/store/seckill/manger/list",
        params: {
            page,
            limit,
        }
    })
}
//秒杀商品删除项
export const seckillGoodsDelete = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/store/seckill/delete",
        params: {
            id
        }
    })
}
