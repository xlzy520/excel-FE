import Vue from './VuePackage'
import App from './App'
import store from './store'
import router from './router'
import '@/permission'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
