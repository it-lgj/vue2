import { getCookie } from '@/utils/cookie';
import { getStorage } from "@/utils/html5.js";
export default {
    token: getCookie("_token") || null,
    userInfo: getStorage("_userInfo") || null,
}