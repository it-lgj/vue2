import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

//引入全局css
import "@/assets/css/base.css";
//引入全局scss
import "@/assets/css/base.scss";
import "@/assets/css/base-zxy.scss";
//引入animate.css
import "animate.css";
//引入element
import "./components/element-ui";

import { MessageBox } from 'element-ui';
Vue.prototype.$confirm = MessageBox.confirm;
Vue.config.productionTip = false
Vue.use(ContainerMixin);
Vue.use(ElementMixin);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
