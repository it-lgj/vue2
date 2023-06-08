// 用户登录相关接口

import axios from "../request.js";

let loginUrl = '/api/admin/login';
let loginPicUrl = "/api/admin/getLoginPic";
let loginCaptchaUrl = '/api/admin/validate/code/get';
let loginCaptchaCheckUrl = '/api/admin/validate/code/check';
let logoutUrl = "/api/admin/logout";
let menuUrl = "api/admin/getMenus";

// 登录
export const userLogin = (user) => {
    return axios({
        method: "post",
        url: loginUrl,
        data: {
            pwd: user.password,
            account: user.name,
            code: user.captcha,
            key: user.key
        }
    });
};

// 退出
export const userLogout = () => {
    return axios({
        method: "get",
        url: logoutUrl,
    });
};

// 获取登录页图片
export const getLoginPic = () => {
    return axios({
        method: "get",
        url: loginPicUrl,
    });
};

// 获取验证码
export const getLoginCaptcha = () => {
    return axios({
        method: "get",
        url: loginCaptchaUrl,
    });
};

// 检测验证码
export const loginCaptchaCheck = (code, key) => {
    return axios({
        method: "get",
        url: loginCaptchaCheckUrl,
        params: {
            code,
            key,
        }
    });
};

//获取系统菜单
export const getMenu = () => {
    return axios({
        method: "get",
        url: menuUrl,
    });
};