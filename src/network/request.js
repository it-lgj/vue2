import axios from "axios";
import { getCookie } from "@/utils/cookie";
import Nprogress from "@/components/NProgress";

//基本配置
axios.defaults.baseURL = "http://xawn.f3322.net:10003";
// axios.defaults.baseURL = "http://172.16.11.18:8088";
axios.defaults.timeout = 9000;
//请求拦截器
axios.interceptors.request.use(
    (config) => {
        //启动
        Nprogress.start();
        //获取token 携带token
        let token = getCookie("_token");
        token && (config.headers["Authori-zation"] = token);
        //拦截成功
        return config;
    },
    (error) => {
        //服务器请求失败
        Nprogress.done();
        return Promise.reject(error);
    }
);

//响应拦截器
axios.interceptors.response.use(
    (response) => {
        //服务器响应成功
        Nprogress.done();
        return Promise.resolve(response);
    },
    (error) => {
        //服务器响应失败
        Nprogress.done();
        return Promise.reject(error);
    }
);

export default axios;
