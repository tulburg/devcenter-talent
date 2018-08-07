// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store.js'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(VueResource);

window.Array.prototype.where = function(obj) {
	for(var i=0;i<this.length;i++) {
		for(var v in obj) {
			if(this[i][v] && this[i][v] == obj[v]) return this[i];
		}
	}
	return undefined;
}
window.Array.prototype.fetch = function(obj) {
	var data = [];
	for(var i=0;i<this.length;i++) {
		for(var v in obj) {
			if(this[i][v] != undefined && this[i][v] == obj[v]) data.push(this[i]);
		}
	}
	return data;
}
Element.prototype.collapse = function (complete) {
	var h = this.offsetHeight;
	this.style = "height: "+h+"px; overflow: hidden; opacity: 1; transition: all .3s cubic-bezier(.25,.1,.25,1);";
	setTimeout(() => { this.style = "height: 0px; overflow: hidden; transition: all .3s cubic-bezier(.25,.1,.25,1); opacity: 0;"; }, 0.5);
	if(complete) setTimeout(() => { complete() }, 310);
},
Element.prototype.expand = function (complete) {
	this.style = "height: auto; overflow: hidden; opacity: 0; transition: all .3s cubic-bezier(.25,.1,.25,1);";
	var h = this.offsetHeight;
	this.style = "height: 0px; overflow: hidden; transition: all .3s cubic-bezier(.25,.1,.25,1); opacity: 0;"; 
	setTimeout(() => { 
		this.style = "height: "+h+"px; overflow: hidden; transition: all .3s cubic-bezier(.25,.1,.25,1); opacity: 1;"; }, 0.5);
	if(complete) setTimeout(() => { complete() }, 350);
	setTimeout(() => { this.style.height='auto'; }, 350);
}
Element.prototype.hasClass = function(c) { return (this.className.match(c)) }
Element.prototype.addClass = function(c) { if(!this.className.match(c)) this.className = this.className+" "+c; }
Element.prototype.removeClass = function(c) { return this.className = this.className.replace(" "+c, ""); }
window.Element.prototype.$ = window.$ = function(id) {
	if(id[0] == ".") return (this) ? (this.getElementsByClassName(id.substring(1)).length == 1) ? this.getElementsByClassName(id.substring(1))[0] : this.getElementsByClassName(id.substring(1)) : (document.getElementsByClassName(id.substring(1)).length == 1) ? document.getElementsByClassName(id.substring(1))[0] : document.getElementsByClassName(id.substring(1));
	if(id[0] == "#") return (this) ? this.getElementById(id.substring(1)) : document.getElementById(id.substring(1));
	if(id[0] == ">") return (this) ? (this.getElementsByTagName(id.substring(1)).length == 1) ? this.getElementsByTagName(id.substring(1))[0] : this.getElementsByTagName(id.substring(1)) : (document.getElementsByTagName(id.substring(1)).length == 1) ? document.getElementsByTagName(id.substring(1))[0] : document.getElementsByTagName(id.substring(1));
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
