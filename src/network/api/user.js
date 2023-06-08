import axios from "../request.js";

//用户等级
export const systemuser = ()=>{
  return axios({
    method:"get",
    url:"/api/admin/system/user/level/list"
  })
}

// 新增用户等级
export const levelsave = (data)=>{
  console.log(data)
  return axios({
    method:"post",
    url:"/api/admin/system/user/level/save",
    data
  })
}

//编辑用户等级
export const levelupdate = (id,data)=>{
  console.log(id)
  return axios({
    method:"post",
    url:`/api/admin/system/user/level/update/${id}`,
    data
  })
}
//删除用户等级
export const userlever = (id)=>{
  console.log(id)
  return axios({
    method:"post",
    url:`/api/admin/system/user/level/delete/${id}`,
  
  })
}

//用户分组
let lever = "/api/admin/user/group/list"
export const userLever = (params)=>{
  return axios ({
    method:"get",
    url:lever, 
    params

  })
}

//编辑用户分组
export const gruopUpdate = (params,data)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/group/update",
    params,
    data
  })
}

//删除用户分组
export const groupdelct = (params)=>{
  return axios({
    method:"get",
    url:"/api/admin/user/group/delete",
    params
  })
}
//新增用户分组
export const groupsave = (data)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/group/save",
    data
  })
}
//用户地址
export const systemcity = ()=>{
  return axios({
    method:"get",
    url:"/api/admin/system/city/list/tree"
  })
}

//用户列表
export const userList = (params)=>{
  return axios ({
    method:"get",
    url:"/api/admin/user/list",
    params
  })
}


//用户标签
export const usertagList = ()=>{
  return axios ({
    method:"get",
    url:"/api/admin/user/tag/list",
    params:{
      page:1,
      limit:15,
      
    }
  })
}
//编辑用户标签
export const userGroupUpdate = (params,data)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/tag/update",
    params,
    data
  })
}
//删除用户标签
export const usertagDelece = (params)=>{
  return axios({
    method:"get",
    url:"/api/admin/user/tag/delete",
    params
  })
}
//新增用户标签
export const tagsave = (data)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/tag/save",
    data
  })
}

//用户等级状态切换
export const leveluse = (data)=>{
  console.log(data)
  return axios({
    method:"post",
    url:"/api/admin/system/user/level/use",
    data
  })
}

//批量设置分组
export const usergroup = (params)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/group",
    params
  })
}

//编辑
export const userdate = (params,data)=>{
  return axios({
    method:"post",
    url:"/api/admin/user/update",
    params,
    data
  })
}

//获取优惠卷数据
export const couponsend = (params)=>{
  return axios ({
    method:"get",
    url:"/api/admin/marketing/coupon/send/list",
    params
  })
}
//发送优惠卷
export const couponreceive = (params)=>{
  console.log(params)
  return axios ({
    method:"post",
    url:"/api/admin/marketing/coupon/user/receive",
    params
  })
}


//用户详情
export const infobyconditionApi=(params)=> {
  return axios({
    url: `/api/admin/user/infobycondition`,
    method: 'get',
    params
  })
}
export const topdetailApi =(params)=> {
  return axios({
    url: `/api/admin/user/topdetail`,
    method: 'get',
    params
  })
}

//积分
export const integralListApi=(params, data)=> {
  return axios({
    url: '/api/admin/user/integral/list',
    method: 'post',
    params,
    data
  })
}

//修改用户等级
export const userLevelUpdateApi=( data)=> {
  return axios({
    url: `/api/admin/user/update/level`,
    method: 'post',
    data
  })
}

//修改积分
export const foundsApi=(params)=> {
  return axios({
    url: `/api/admin/user/operate/founds`,
    method: 'get',
    params
  })
}

//修改上级推广
export const updateSpread=(data)=> {
  return axios({
    url: `/api/admin/user/update/spread`,
    method: 'post',
    data
  })
}

//清除上级推广人
export const spreadDelete=(id)=>{
  return axios({
    method:"get",
    url:`/api/admin/store/retail/spread/clean/${id}`
  })
}