import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Iconfont from './components/Iconfont/index.vue';
import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.component('icon-font', Iconfont);

Vue.config.productionTip = false;

new Vue({
  render: (h: any) => h(App),
}).$mount('#app');
