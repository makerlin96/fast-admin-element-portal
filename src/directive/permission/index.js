// import permission from './permission'
//
// const install = function(Vue) {
//   Vue.directive('permission', permission)
// }
//
// if (window.Vue) {
//   window['permission'] = permission
//   Vue.use(install); // eslint-disable-line
// }
//
// permission.install = install
// export default permission

import Vue from 'vue'
import store from '@/store'
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.style.display = 'none'
    }
  }
})
Vue.prototype.$_has = function(value) {
  let isExist = false
  const dynamicButtons = store.getters.buttons
  if (dynamicButtons === undefined || dynamicButtons === null || dynamicButtons.length < 1) {
    return isExist
  }
  dynamicButtons.forEach(button => {
    if (button === value) {
      isExist = true
      return isExist
    }
  })
  return isExist
}
