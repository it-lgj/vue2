// 封装cookie缓存

import cookie from "js-cookie";

// 方法
export const setCookie = (key, value) => {
  cookie.set(key, value);
};

export const getCookie = (key) => {
  return cookie.get(key);
};

export const removeCookie = (key) => {
  cookie.remove(key);
};
