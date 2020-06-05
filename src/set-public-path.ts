import { setPublicPath } from 'systemjs-webpack-interop';

// single-spa下才执行，不然会报错
if ((window as any).singleSpaNavigate) {
  setPublicPath('@vue-mf/calendar', 2);
}
