import Vue from 'vue'
import App from './App'
import store from './store'
import global_ from './common/common.vue'
import graceChecker from './common/common.vue'


Vue.config.productionTip = false
Vue.prototype.GLOBAL = global_
Vue.prototype.$store = store
Vue.prototype.$graceChecker = graceChecker
App.mpType = 'app'
 
const app = new Vue({
	store,
	graceChecker,
    ...App
})
app.$mount()
