//引入mutations类型
import { UPDATE_TOKEN, REMOVE_TOKEN, UPDATE_USERINFO } from "../../mutations-types";

export default {
    //存储token
    [UPDATE_TOKEN](state, payload) {
        state.token = payload;
    },
    //清除token
    [REMOVE_TOKEN](state) {
        state.token = null;
        state.userInfo = null;
    },
    [UPDATE_USERINFO](state, payload) {
        state.userInfo = payload;
    }
};