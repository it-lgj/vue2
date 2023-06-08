// 路由导航配置

export default [
    {
        path: '/',
        redirect: "/dashboard",
        component: () => import("@/views/Index.vue"),
        children: [
            {
                path: "dashboard",
                name: '主页',
                meta: {
                    parent: "主页"
                },
                component: () => import("@/views/dashboard/dashboard.vue"),
            },
            {
                path: "/store/index",
                name: "商品管理",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/index.vue"),
            },
            {
                path: "store/creatProduct",
                name: "商品添加",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/creatProduct.vue"),
            },
            {
                path: "store/creatProduct/:id?/:isFix?",
                name: "商品详情",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/creatProduct.vue"),
            },
            {
                path: "store/creatProduct/:id?",
                name: "商品修改",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/creatProduct.vue"),
            },
            {
                path: "/store/sort",
                name: "商品分类",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/sort.vue"),
            },
            {
                path: "/store/attr",
                name: "商品规格",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/attr.vue"),
            },
            {
                path: "/store/comment",
                name: "商品评论",
                meta: {
                    parent: "商品"
                },
                component: () => import("@/views/store/comment.vue"),

            },
            {
                path: "/order/index",
                name: "订单",
                meta: {
                    parent: "订单"
                },
                component: () => import("@/views/order/index.vue"),
            },
            {
                path: "/user/index",
                name: "用户管理",
                meta: {
                    parent: "用户"
                },
                component: () => import("@/views/user/index.vue"),
            },
            {
                path: "/user/label",
                name: "用户标签",
                meta: {
                    parent: "用户"
                },
                component: () => import("@/views/user/label.vue"),
            },
            {
                path: "/user/grade",
                name: "用户等级",
                meta: {
                    parent: "用户"
                },
                component: () => import("@/views/user/grade.vue"),
            },
            {
                path: "/user/group",
                name: "用户分组",
                meta: {
                    parent: "用户"
                },
                component: () => import("@/views/user/group.vue"),
            },
            {
                path: "/content/classifManager",
                name: "文章分类",
                meta: {
                    parent: "内容"
                },
                component: () => import("@/views/content/classifManager.vue"),
            },
            {
                path: "/content/articleManager",
                name: "文章管理",
                meta: {
                    parent: "内容"
                },
                component: () => import("@/views/content/articleManager.vue"),
            },
            {
                path: "/marketing/integral/integralconfig",
                name: "积分配置",
                meta: {
                    parent: "积分"
                },
                component: () => import("@/views/integral/integralconfig.vue"),
            },
            {
                path: "/marketing/integral/integrallog",
                name: "积分日志",
                meta: {
                    parent: "积分"
                },
                component: () => import("@/views/integral/integrallog.vue"),
            },
            {
                path: "/marketing/seckill/config",
                name: "秒杀配置",
                meta: {
                    parent: "秒杀"
                },
                component: () => import("@/views/seckill/config.vue"),
            },
            {
                path: "/marketing/seckill/list",
                name: "秒杀商品",
                meta: {
                    parent: "秒杀"
                },
                component: () => import("@/views/seckill/list.vue"),
            },
            {
                path: "/marketing/bargain/bargainGoods",
                name: "砍价商品",
                meta: {
                    parent: "砍价"
                },
                component: () => import("@/views/bargain/bargainGoods.vue"),
            },
            {
                path: "/marketing/bargain/bargainList",
                name: "砍价列表",
                meta: {
                    parent: "砍价"
                },
                component: () => import("@/views/bargain/bargainList.vue"),
            },


            {
                path: "/marketing/groupBuy/groupGoods",
                name: "拼团商品",
                meta: {
                    parent: "拼团"
                },
                component: () => import("@/views/groupBuy/groupGoods.vue"),
            },
            {
                path: "/marketing/groupBuy/groupList",
                name: "拼团列表",
                meta: {
                    parent: "拼团"
                },
                component: () => import("@/views/groupBuy/groupList.vue"),
            },
            {
                path: "/marketing/coupon/list",
                name: "优惠券",
                meta: {
                    parent: "优惠券"
                },
                component: () => import("@/views/coupon/list.vue"),
            },
            {
                path: "/marketing/coupon/record",
                name: "领取记录",
                meta: {
                    parent: "优惠券"
                },
                component: () => import("@/views/coupon/record.vue"),
            },
            {
                path: "/operation//roleManager/identityManager",
                name: "角色管理",
                meta: {
                    parent: "权限管理"
                },
                // component: () => import("@/views/content/articleManager.vue""),
            },
            {
                path: "/operation//roleManager/adminList",
                name: "管理员列表",
                meta: {
                    parent: "权限管理"
                },
                // component: () => import("@/views/content/articleManager.vue""),
            },
            {
                path: "/operation//roleManager/promiseRules",
                name: "权限规则",
                meta: {
                    parent: "权限管理"
                },
                // component: () => import("@/views/content/articleManager.vue""),
            },
            {
                path: "/content/userForm",
                name: "添加文章",
                meta: {
                    parent: "文章管理"
                },
                component: () => import("@/views/content/userForm.vue")
            }
        ]
    },
    {
        path: "/login",
        component: () => import("@/views/Login.vue"),
    },
    {
        path: "/error",
        component: () => import("@/views/404.vue"),
    },
    {
        path: "*",
        redirect: "/error",
    },
]