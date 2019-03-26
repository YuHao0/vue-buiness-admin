import Vue from 'vue'
import App from './App.vue'
import router from './router';
import core from './core';
import { 
  Dialog,
  Radio,
  Checkbox,
  CheckboxGroup,
  Scrollbar,
  Tree,
  RadioGroup,
  Icon,
  Input,
  Select,
  Option,
  DatePicker,
  Progress,
  Message,
  Pagination,
  Upload,
  MessageBox,
  Popover,
  ColorPicker,
  Carousel,
  CarouselItem
 } from 'element-ui';
Message.install = function (Vue) {
  Vue.prototype.$message = Message
}
MessageBox.install = function (Vue) {
  Vue.prototype.$msgbox = MessageBox
}
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Scrollbar);
Vue.use(Tree);
Vue.use(RadioGroup);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Progress);
Vue.use(Message);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(MessageBox);
Vue.use(Popover);
Vue.use(ColorPicker);
Vue.use(Carousel);
Vue.use(CarouselItem);

import upload from './components/upload';

Vue.component('upload',upload);

for(let key in core){
  Vue.prototype[key] = core[key];
}

router.beforeEach((to, from, next) => {
  Vue.prototype.userConfig = JSON.parse(localStorage.userConfig || '{}') || {};
  if(localStorage.user && !window.refreshMenu){
    Vue.prototype.api.common.menu({}).then((res) => {
      localStorage.menu = JSON.stringify(res.data);
      localStorage.firstMenu = res.data[0].menus[0].menus[0].title;
      window.refreshMenu = true;
      next();
    });
  } else {
    next();
  }
});

router.afterEach(route => {
  document.title = route.name || 'Api Union';
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
