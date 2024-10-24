import MyMoneyInput from './input.vue'

const MoneyInput = {
  install(Vue) {
    Vue.component('MoneyInput', MyMoneyInput)
  }
}

// 导出组件
export default MoneyInput