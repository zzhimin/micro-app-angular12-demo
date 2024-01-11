import { NgModuleRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


declare global {
  interface Window {
    microApp: any
    mount: CallableFunction
    unmount: CallableFunction
    __MICRO_APP_ENVIRONMENT__: string
  }
}


let app: void | NgModuleRef<AppModule>
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((res: NgModuleRef<AppModule>) => {
      app = res
    })
    .catch(err => console.error(err))
}

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  // angular在部分场景下执行destroy时会删除根元素app-root，导致在此渲染时报错，此时可删除app.destroy()来避免这个问题
  app && app.destroy();
  app = undefined;
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}