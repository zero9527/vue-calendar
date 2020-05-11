import Loading from './Loading.vue';

/**
 * 异步组件配置
 * 例：
 *  import AsyncComponent from '@/components/AsyncComponent/index';
    const Calendar = AsyncComponent(() =>
      import('@/components/Calendar/index.vue'),
    );
 */
const AsyncComponent = (AsyncComp: () => Promise<any>) => {
  const Comp = () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    component: AsyncComp(),
    // 异步组件加载时使用的组件
    loading: Loading,
    // 加载失败时使用的组件
    error: 'error', // ErrorComponent,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    // delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000,
  });

  return {
    render: (h: any) => h(Comp),
  };
};

export default AsyncComponent;
