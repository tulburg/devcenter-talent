import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		api: {
			development: "http://alpha.developers.devcenter.co/api/",
			production: "http://developers.devcenter.co/api/"
		}
	},
	mutations: {
		startSession: function(state, payload){
			Cookie.set("DevTalent", { 
				userid: payload.user.id, 
				type: payload.user.account_type,
				activated: payload.user.activated,
				username: payload.user.username,
				verification: payload.user.verification,
				firstname: payload.user.first_name,
				lastname: payload.user.last_name,
				completed_level: payload.user.completed_level
			}, { expires: 7 });
		},
		endSession: function(state, payload) {
			Cookie.remove("DevTalent");
		}
	},
	actions: {
		getSession() {
			let cookie = Cookie.getJSON("DevTalent");
			if(cookie) {
				return cookie;
			} return null;
		}
	}
});