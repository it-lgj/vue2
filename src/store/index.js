import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 引入user模块
import userModule from "./modules/user";

//引入全局
import state from "./state";
import mutations from "./mutations";

const store = new Vuex.Store({
    state,
    mutations,
    modules: {
        User: userModule,
    },
});
export default store;
