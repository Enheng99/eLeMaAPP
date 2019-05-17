import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource';
//引入路由
import VueRouter from 'vue-router';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/stylus/index.styl';

Vue.config.productionTip = false;
Vue.use(VueResource);//请求数据
Vue.use(VueRouter);//请求路由
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
];
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
router.push('/goods');