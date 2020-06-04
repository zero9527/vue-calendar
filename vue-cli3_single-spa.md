# vue-cli3 配置 single-spa

## 流程
### 主应用流程
- 启动由 `system.js` 接管，配置 `webpack` `out.libraryTarget` 为 `system`
- `html` 入口中通过 `importmap`，设置当前应用、子应用 `名称+地址`
- `registerApplication` 注册子应用，通过 `system.js` 引入，设置渲染路由 `activeWhen`，传递给子应用的参数 `customProps`

### 子应用流程(Vue)
- 启动方式由 `single-spa-vue` 接管，可以判断 `window.singleSpaNavigate` 为 `false` 单独启动
- 配置在主应用的挂载点，`appOptions` 下的 `el` 设置，默认挂载到 `body` 下
- 导出一些生命周期事件，至少如下三个：`bootstrap`/`mount`/`unmount`，可以在 `mount` 下接收主应用传递的参数


## 1、主项目的配置

### 1.1 下载依赖 

下载 `single-spa`

```shell
yarn add single-spa
```

### 1.2 配置
#### 在 `HTML` 入口 

- 在 `public/index.html` 下添加

```html
<meta name="importmap-type" content="systemjs-importmap" />
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "//localhost:666/js/app.js",
      "@vue-mf/calendar": "//localhost:2333/js/app.js"
    }
  }
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/system.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/amd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/named-exports.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/named-register.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/use-default.min.js"></script>
<script>
  System.import('root-config');
</script>
```

- 里面的东西是一个 `JSON`，注意格式！

这里配置当前应用的配置 `名称：地址`，与子应用的 `名称：地址`

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "//localhost:666/js/app.js",
      "@vue-mf/calendar": "//localhost:2333/js/app.js"
    }
  }
</script>
```

- 子应用名称 `@vue-mf/calendar`，在 `registerApplication` 时，对应 `app: ` `import(@vue-mf/calendar)` 的名称，如

```js
registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: '',
  customProps: {
    root: 'json-util',
  },
});
```

#### 系统启动由 `systemJS` 接管
- html

```html
<script>
  System.import('root-config');
</script>
```

- 对应的 `webpack` 配置

```js
// vue.config.js
module.exports = {
  outputDir: 'docs',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    config.output.libraryTarget = 'system';

    config.devServer = {
      port: 666,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      historyApiFallback: true,
    };
  },
};
```

#### 配置子应用
- single-spa.config.js

```js
// src\single-spa-config.ts
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: '',
  customProps: {
    root: 'json-util',
  },
});

start();
```

- 在 `main.ts` 中引入

```js
// src\main.ts
import './single-spa-config';
```

## 2、子项目的配置(Vue)

### 2.1 下载依赖
- 下载 `single-spa-vue`

```shell
yarn add single-spa-vue
```

- 下载 `vue-cli-plugin-single-spa`

```shell
yarn add -D vue-cli-plugin-single-spa
```

### 2.2 配置
- 应用入口 `main.js/ts`

> **注意：**<br/>
> `appOptions` 下，`el` 可以给当前应用配置在主应用的挂载 `DOM` 节点，这个节点需要**提前**设置好；不提供 `el` 的话默认挂载在 `body` 下

```js
// 其他的代码省略
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
// ...

// ============= 非 single-spa 单独启动 =============
if (!(window as any).singleSpaNavigate) {
  new Vue({
    render: (h: any) => h(App),
  }).$mount('#app-calendar');
}

// ============= single-spa 模式启动 =============
const vueLifeCycles = singleSpaVue({
  Vue,
  appOptions: {
    // el：挂载的dom节点，在主项目需要有；没有el的话会添加到body下
    el: '#app-calendar',
    render: (h: any) => h(App),
  },
});

export function bootstrap(props: object) {
  return vueLifeCycles.bootstrap(props);
}

export function mount(props: object) {
  console.log('mount: ', props);
  return vueLifeCycles.mount(props);
}

export function unmount(props: object) {
  return vueLifeCycles.unmount(props);
}
```

### 2.3 问题
子项目使用异步组件 `import()` 时，单独跑起来没问题！！！但是在主应用里面会报错，改为正常引入 `import from` 就没事。。。

子应用使用异步组件，在主应用报错

```
Uncaught TypeError: application '@vue-mf/calendar' died in status BOOTSTRAPPING: Object(...) is not a function
```

```js
<template>
  <div id="app-calendar">
    <div class="title">Vue-Calendar</div>
    <Calendar />
  </div>
</template>

<script lang="ts">
// 正常
import Calendar from '@/components/Calendar/index.vue';

// single-spa在主应用加载：不行
// const Calendar = () => import(@/components/Calendar/index.vue);

// single-spa在主应用加载：不行
// import AsyncComponent from '@/components/AsyncComponent/index';

// single-spa 下使用异步组件，在主应用加载有问题
// const Calendar = AsyncComponent(() =>
//   import(
//     /* webpackPrefetch: true */
//     /* webpackChunkName: 'calendar' */
//     '@/components/Calendar/index.vue'
//   ),
// );

export default {
  name: 'App',
  components: {
    Calendar,
  },
};
</script>
```

## 参考
- [single-spa](https://single-spa.js.org/docs/configuration/)
- 等等