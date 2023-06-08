//html5缓存
export const setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};
