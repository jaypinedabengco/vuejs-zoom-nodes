import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Node from "@/components/ZoomNode/Node";
import ZoomNode from "@/components/ZoomNode/ZoomNode";
import ZoomNodeOld from "@/components/ZoomNode/ZoomNodeOld";

Vue.config.productionTip = false

Vue.component('z-node', Node);
Vue.component('z-zoom-node', ZoomNode);
Vue.component('z-zoom-node-old', ZoomNodeOld);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
