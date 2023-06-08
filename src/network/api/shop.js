// 商品模块相关接口
import axios from '@/network/request'

let shopListUrl = '/api/admin/store/product/list';
let shopTabsUrl = '/api/admin/store/product/tabs/headers';
let shopTreeUrl = "/api/admin/category/list/tree";
let shopRulelistUrl = "api/admin/store/product/rule/list";
let shopreplylistUrl = "/api/admin/store/product/reply/list";
let asreplycommentUrl = "/api/admin/store/product/reply/comment";
let shoptemplatesUrl = "api/admin/express/shipping/templates/list";


// 修改商品
export const postproductsave = () => {
    return axios({
        method: "post",
        url: "/api/admin/store/product/save",
        data: {
            
        }
    });
};

// 全国包邮
export const getshiptemplates = () => {
    return axios({
        method: "get",
        url: shoptemplatesUrl,
    });
};

// 分类id获取分类
export const getgroupdatalist = (gid) => {
    return axios({
        method: "get",
        url: "/api/admin/system/group/data/list",
        params: {
            gid
        }
    });
};




// 获取商品详情
export const getproductinfo = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/info/${id}`,
    });
};

// 查找优惠券
export const getcouponinfo = (id) => {
    return axios({
        method: "post",
        url: `/api/admin/marketing/coupon/info`,
        params: {
            id
        }
    });
};



// 商品列表数据
export const getShopList = (type, cateId, keywords, page, limit) => {
    return axios({
        method: "get",
        url: shopListUrl,
        params: {
            type,
            cateId,
            keywords,
            page,
            limit,
        }
    });
};

// 商品表头数据
export const getShopTab = () => {
    return axios({
        method: "get",
        url: shopTabsUrl,
    });
};


// 下架商品
export const getOffShell = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/offShell/${id}`,
    });
};

// 上架商品
export const getOnShell = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/putOnShell/${id}`,
    });
};


// 删除商品
export const getDelete = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/delete/${id}`,
    });
};

// 恢复商品
export const getRestore = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/restore/${id}`,
    });
};

// 商品分类列表
export const getshopTree = () => {
    return axios({
        method: "get",
        url: shopTreeUrl,
        params: {
            status: -1,
            type: 1
        }
    });
};

// 修改分类状态
export const getStatus = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/category/updateStatus/${id}`,
    });
};

// 获取分类列表(筛选)
export const getcategoryTree = (status, name) => {
    return axios({
        method: "get",
        url: shopTreeUrl,
        params: {
            status,
            name,
            type: 1,
        }
    });
};

// 获取规格列表
export const getRuleList = (keywords) => {
    return axios({
        method: "get",
        url: shopRulelistUrl,
        params: {
            keywords
        }
    });
};

// 获取分类详情
export const getcategoryinfo = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/category/info",
        params: {
            id
        }
    });
};

// 修改分类
export const postCategoryUpdate = (data) => {
    return axios({
        method: "post",
        url: "/api/admin/category/update",
        params: {
            ...data
        }
    });
};

// 添加子分类
export const postCategorySave = (data) => {
    return axios({
        method: "post",
        url: "/api/admin/category/save",
        params: {
            ...data
        }
    });
};

// 删除分类
export const getCategorydelete = (id) => {
    return axios({
        method: "get",
        url: "/api/admin/category/delete",
        params: {
            id
        }
    });
};


// 获取规格详情
export const getRuleInfo = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/rule/info/${id}`,
    });
};

// 修改规格
export const postRuleupdate = (data) => {
    return axios({
        method: "post",
        url: `/api/admin/store/product/rule/update`,
        data: {
            ...data
        }
    });
};

// 新增规格
export const postRuleupsave = (data) => {
    return axios({
        method: "post",
        url: `/api/admin/store/product/rule/save`,
        data: {
            ...data
        }
    });
};

// 删除规格
export const postRuleupdelete = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/rule/delete/${id}`,
    });
};

// 获取商品评论
export const getReplyList = (dateLimit, isReply, nickname, productSearch, page, limit,) => {
    return axios({
        method: "get",
        url: shopreplylistUrl,
        params: {
            dateLimit,
            isReply,
            nickname,
            productSearch,
            page,
            limit,
        }
    });
};

// 评论详情
export const getreplyInfo = (id) => {
    return axios({
        method: "get",
        url: `/api/admin/store/product/reply/info/${id}`,
    });
};


// 评论回复
export const postreplycomment = (merchantReplyContent, ids) => {
    return axios({
        method: "post",
        url: asreplycommentUrl,
        data: {
            merchantReplyContent,
            ids
        }
    });
};