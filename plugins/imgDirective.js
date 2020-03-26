import Vue from 'vue'
const location = window.location.origin
const test = 'http://207.154.223.158:8000'
Vue.directive('image', {
  bind: (el, binding, vnode) => {
    el.setAttribute('src', `${test}/uploads/${binding.value}`)
  },
  update: (el, binding, vnode) => {
    el.setAttribute('src', `${test}/uploads/${binding.value}`)
  }
})
