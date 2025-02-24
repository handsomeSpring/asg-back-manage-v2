import Vue from 'vue';
import Toast from './index.vue';

// 创建一个 Toast 构造函数
const ToastConstructor = Vue.extend(Toast);

let instance;

const showToast = (message, duration = 2000) => {
  // 如果实例不存在，则创建一个新的实例
  if (!instance) {
    instance = new ToastConstructor({
      el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);
  }
  // 调用实例的 show 方法显示 Toast
  instance.show(message, duration);
};

export default showToast;