import Vue from 'vue'
Vue.directive('image', {
  bind: (el, binding, vnode) => {
    el.setAttribute('src', `${process.env.secondUrl}/uploads/${binding.value}`)
  },
  update: (el, binding, vnode) => {
    el.setAttribute('src', `${process.env.secondUrl}/uploads/${binding.value}`)
  }
})
