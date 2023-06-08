// 路由
import Vue from 'vue'
import vueRouter from 'vue-router'
import store from "@/store";
import { ADD_HISTORY, SAVE_BREADMENU, UPDATE_DEFAULT } from "@/store/mutations-types";

//replace重写
//先获取原replace方法进行接收
const originReplace = vueRouter.prototype.replace;
//重写replace方法 抛出异常
vueRouter.prototype.replace = function replace(location) {
  return originReplace.call(this, location).catch((error) => error);
};
const originPush = vueRouter.prototype.push;
//重写push
vueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch((error) => error);
};


// 导入存储文件和请求接口
import { getCookie } from "@/utils/cookie";
import { setStorage ,getStorage } from "@/utils/html5";
import { getMenu } from "@/network/api/login";


// 导入路由导航
import routes from "./config";
// 路由注册
Vue.use(vueRouter)

// 路由实例化
const router = new vueRouter({
  mode: 'hash',
  routes,
})

//路由的前置守卫
//设置白名单
const whiteList = ["/login"];

//接收系统菜单
let sysMenu = null;

router.beforeEach(async (to, from, next) => {
  //获取token令牌
  let token = getCookie("_token");
  //检测是否是白名单
  if (whiteList.indexOf(to.path) != -1) {
    //白名单
    if (token) {
      if (to.path == "/login") {
        next({ path: "/" });
      }
    }
    next();
  } else {
    //token检测
    if (!token) {
      //未登录情况
      //终止当前路由 跳转登录界面
      //跳转登录时  知道那个路由到登录的  哪么登录完成之后在回到原路由
      next({ path: "/login", query: { redirect: to.path } });
    } else {
      //已登陆直接放行
      //进入主页之前 获取菜单数据
      //检测系统菜单是否已经获取
      if (!sysMenu) {
        //发送ajax请求获取系统数据
        sysMenu = await getMenuList();
        //解析数据---返回解析之后的路由配置
        let route = compilerComponent(sysMenu);
        setStorage("_menu", route);

        //遍历routes进行添加路由
        // add(routes);
        // function add(routes) {

        //   routes.forEach((route) => {
        //     if (route.childrenArr) {
        //       let children = route.children;
        //       add(children);
        //     }
        //     router.addRoute("admin", route); //添加子路由
        //   });
        // }
        //终止当前路由跳转
        next();
      } else {
        //给vuex状态管理中写入记录
        store.commit(SAVE_BREADMENU, [to.meta.parent
          , to.name]);
        store.commit(ADD_HISTORY, {
          name: to.params.id ? to.name + to.params.id : to.name,
          path: to.path,
          isNow: true,
        });
        store.commit(UPDATE_DEFAULT, to.path)
        document.title = `${to.name} - CRMEB`;
        next();
      }
    }
  }
});

// 封装方法获取ajax数据
async function getMenuList() {
  let res = await getMenu();
  return res.data.data;
}
// 解析数据---使用递归算法进行数据解析
function compilerComponent(list, parent) {
  // 遍历
  let routesArr = [];
  list.forEach((item) => {
    // 创建对象接收属性
    let routeInfo = {
      path: item.component,
      icon: item.icon,
      // component: loadComponent(item.component),
      meta: {
        title: item.name,
        type: item.menuType,
        parent: parent ? parent.name : "",
      },
      title: item.name,
    };
    //检测当前item上是否存在children子属性
    if (item.menuType === "M") {
      // 递归
      routeInfo.children = compilerComponent(item.childList, item);
    }
    //追加
    routesArr.push(routeInfo);
  });
  return routesArr;
}

//加载组件
// function loadComponent(url) {
//   if (url) {
//     return () => import(`@/views${url}.vue`);
//   }
// }
export default router;