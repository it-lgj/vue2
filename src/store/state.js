import { getStorage } from "@/utils/html5.js";
export default {
  history: getStorage("_history") || [
    {
      name: "主页",
      path: "/dashboard",
      isNow: true,
    },
  ],
  bread: getStorage("_bread") || ["主页"],
  isCollapse: false,
  defaultRouter: getStorage("_defaultRouter") || "/dashboard"
};
