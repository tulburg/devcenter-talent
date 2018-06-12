// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store.js'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(VueResource);

window.Element.prototype.$ = window.$ = function(id) {
	if(id[0] == ".") return (this) ? (this.getElementsByClassName(id.substring(1)).length == 1) ? this.getElementsByClassName(id.substring(1))[0] : this.getElementsByClassName(id.substring(1)) : document.getElementsByClassName(id.substring(1));
	if(id[0] == "#") return (this) ? this.getElementById(id.substring(1)) : document.getElementById(id.substring(1));
	return undefined;
}

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
