//全局mutations
import {
  ADD_HISTORY,
  REMOVE_HISTORY,
  SAVE_BREADMENU,
  UPDATE_COLLAPSE,
  UPDATE_DEFAULT,
} from "./mutations-types";
import { setStorage, getStorage } from "@/utils/html5";
export default {
  [ADD_HISTORY](state, payload) {
    let { name, path, isNow } = payload;
    //获取原数据
    let { history } = state;
    //检测是否存在
    let has = history.some((item, index) => item.path == path);
    //除了当前其余改false  默认不激活
    history = history.map((item) => {
      item.path != path ? (item.isNow = false) : (item.isNow = true);
      return item;
    });
    if (!has) {
      //添加
      history.push({ name, path, isNow });
    }

    state.history = [...history];
    setStorage("_history", state.history)
  },
  [REMOVE_HISTORY](state, payload) {
    let { index } = payload;
    let history = getStorage('_history');
    // //检测当前的是否是选中的
    // if (!history[index].isNow) {

    // };
    // //删除当前的记录
    history.splice(index, 1);
    setStorage("_history", history)
    state.history = [...history];
  },

  // 切换面包屑
  [SAVE_BREADMENU](state, payload) {
    if (payload[0] === "主页") {
      payload = ["主页"];
    } else {
      payload = ["主页", ...payload];
    }
    setStorage("_bread", payload)
    state.bread = [...payload];
  },

  [UPDATE_COLLAPSE](state) {
    state.isCollapse = !state.isCollapse;
  },
  [UPDATE_DEFAULT](state, payload) {
    setStorage("_defaultRouter", payload)
    state.defaultRouter = payload;
  },
};
