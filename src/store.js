import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		api: {
			development: "http://alpha.developers.devcenter.co/api/",
			production: "http://developers.devcenter.co/api/"
		}
	}
});