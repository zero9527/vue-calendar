import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import VueCompositionApi from '@vue/composition-api';
import { printLog } from '@/utils';
import Iconfont from './components/Iconfont/index.vue';
import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.component('icon-font', Iconfont);

Vue.config.productionTip = false;
Vue.config.devtools = true;

const provide = {
  isSingleSpa: true,
};

// ============= 非 single-spa 单独启动 =============
if (!(window as any).singleSpaNavigate) {
  new Vue({
    provide,
    render: (h: any) => h(App),
  }).$mount('#app-calendar');
}

// ============= single-spa 模式启动 =============
const vueLifeCycles = singleSpaVue({
  Vue,
  appOptions: {
    provide,
    // el：挂载的dom节点，在主项目需要有；没有el的话会添加到body下
    el: '#app-calendar',
    render: (h: any) => h(App),
  },
});

export function bootstrap(props: object) {
  printLog('vue-calendar', 'single-spa 模式', 'primary');
  return vueLifeCycles.bootstrap(props);
}

export function mount(props: object) {
  console.log('mount: ', props);
  return vueLifeCycles.mount(props);
}

export function unmount(props: object) {
  return vueLifeCycles.unmount(props);
}
