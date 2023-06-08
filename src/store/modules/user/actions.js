import { UPDATE_TOKEN, REMOVE_TOKEN, UPDATE_USERINFO } from "../../mutations-types";

import { userLogin } from "@/network/api/login";

export default {
    async saveUserToken({ commit }, args) {
        let token;
        let res;
        let { user } = args;
        try {
            // 登录请求
            res = await userLogin(user);
            // 获取token
            token = res.data.data.token;
            // 提交mutations
            commit(UPDATE_TOKEN, token);
            commit(UPDATE_USERINFO, res.data.data);
        } catch (e) {

        };

        return { res, token };
    },
    userClose(context) {
        let { commit, state } = context;
        //提交清除token状态
        commit(REMOVE_TOKEN);
    },
};