import './set-public-path';
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import VueCompositionApi from '@vue/composition-api';
import Iconfont from '@/components/Iconfont/index.vue';
import { printLog } from '@/utils';
import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.component('icon-font', Iconfont);

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true;
}

const provide = {
  useSingleSpa: Boolean((window as any).singleSpaNavigate),
};

// ============= 非 single-spa 单独启动 =============
if (!(window as any).singleSpaNavigate) {
  new Vue({
    provide,
    render: (h: any) => h(App),
  }).$mount('#app-calendar');
}

// ============= single-spa 模式启动 =============
// appOptions.el：挂载的dom节点，在主项目需要有；没有 el 的话会添加到body下
const vueLifeCycles = singleSpaVue({
  Vue,
  appOptions: {
    provide,
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
