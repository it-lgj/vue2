import axios from "../request.js";

//获取文章分类数据
export const category = (params) => {
  return axios({
    method: 'get',
    url: `/api/admin/category/list`,
    params
  })
}
//新增文章分类
export const categorysave = (params) => {
  return axios({
    method: "post",
    url: "/api/admin/category/save",
    params
  })
}
//编辑文章分类
export const categoryupdate = (params) => {
  return axios({
    method: "post",
    url: "/api/admin/category/update",
    params
  })
}
//删除文章分类
export const categorydelete = (params) => {
  return axios({
    method: "get",
    url: "/api/admin/category/delete",
    params
  })
}

//状态切换
export const categoryupdateStatus = (id) => {
  return axios({
    method: "get",
    url: `/api/admin/category/updateStatus/${id}`,
  })
}

//获取文章详情
export const articlelist = (params) => {
  console.log(params)
  return axios({
    method: "get",
    url: "/api/admin/article/list",
    params
  })
}

//删除文章
export const articledelete = (params)=>{
  return axios({
    method:"get",
    url:"/api/admin/article/delete",
    params
  })
}

//新增文章
export const articlesave = (data)=>{
  return axios({
    method:"post",
    url:"/api/admin/article/save",
    data
  })
}

//编辑文章
export const articleinfo = (params)=>{
  return axios({
    method:"get",
    url:"/api/admin/article/info",
    params
  })
}

// 修改文章
export const articleupdate = (params,data)=>{
  return axios({
    method:"post",
    url:"/api/admin/article/update",
    params,
    data
  })
}